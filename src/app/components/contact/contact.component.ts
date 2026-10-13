import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

interface ContactInfo {
  icon: string;
  title: string;
  value: string;
  link?: string;
}

type ChatField = 'name' | 'email' | 'subject' | 'message' | 'done';

interface ChatMessage {
  from: 'bot' | 'user';
  text: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [
    trigger('slideInUp', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('600ms ease-out')
      ])
    ]),
    trigger('slideInLeft', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('600ms 300ms ease-out')
      ])
    ]),
    trigger('slideInRight', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('600ms 300ms ease-out')
      ])
    ])
  ]
})
export class ContactComponent implements OnInit {
  @ViewChild('chatBody') chatBody?: ElementRef<HTMLDivElement>;

  visible = false;
  draft = '';
  isTyping = false;
  currentField: ChatField = 'name';
  messages: ChatMessage[] = [];

  collected = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  readonly emailTo = 'akkeshriaditya@gmail.com';

  socialLinks: SocialLink[] = [
    {
      name: 'GitHub',
      url: 'https://github.com/sdeaaditya',
      icon: 'code',
      color: '#333333'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/sdeaditya',
      icon: 'work',
      color: '#0077b5'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/keshriadityaa',
      icon: 'alternate_email',
      color: '#1da1f2'
    }
  ];

  contactInfo: ContactInfo[] = [
    {
      icon: 'email',
      title: 'Email',
      value: 'akkeshriaditya@gmail.com',
      link: 'mailto:akkeshriaditya@gmail.com'
    },
    {
      icon: 'phone',
      title: 'Phone',
      value: '+91 9560061303',
      link: 'tel:+919560061303'
    },
    {
      icon: 'location_on',
      title: 'Location',
      value: 'Bangalore, Karnataka, India'
    },
    {
      icon: 'schedule',
      title: 'Availability',
      value: 'Open to opportunities'
    }
  ];

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.resetChat(false);

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.visible = true;
          }
        });
      }, { threshold: 0.2 });

      const element = document.getElementById('contact');
      if (element) {
        observer.observe(element);
      }
    } else {
      setTimeout(() => {
        this.visible = true;
      }, 500);
    }
  }

  get placeholder(): string {
    switch (this.currentField) {
      case 'name':
        return 'Type your name…';
      case 'email':
        return 'Type your email…';
      case 'subject':
        return 'Type a subject…';
      case 'message':
        return 'Type your message…';
      default:
        return 'Chat complete';
    }
  }

  get canSendEmail(): boolean {
    return this.currentField === 'done';
  }

  sendDraft() {
    const value = this.draft.trim();
    if (!value || this.currentField === 'done' || this.isTyping) {
      return;
    }

    if (this.currentField === 'email' && !this.isValidEmail(value)) {
      this.pushBot('That email looks off — try something like name@example.com');
      return;
    }

    if (this.currentField === 'name' && value.length < 2) {
      this.pushBot('Please share at least a 2-character name.');
      return;
    }

    this.messages.push({ from: 'user', text: value });
    this.collected[this.currentField] = value;
    this.draft = '';
    this.scrollChat();

    const nextMap: Record<Exclude<ChatField, 'done'>, ChatField> = {
      name: 'email',
      email: 'subject',
      subject: 'message',
      message: 'done'
    };

    const next = nextMap[this.currentField as Exclude<ChatField, 'done'>];
    this.currentField = next;
    this.replyForField(next);
  }

  mailProviders = [
    { id: 'gmail', label: 'Gmail', icon: 'mail' },
    { id: 'outlook', label: 'Outlook', icon: 'desktop_windows' },
    { id: 'yahoo', label: 'Yahoo', icon: 'alternate_email' }
  ] as const;

  showMailProviders = false;

  openMailClient() {
    if (!this.canSendEmail) {
      return;
    }
    this.showMailProviders = true;
    this.pushBot('Choose your webmail — it opens in this browser (Gmail, Outlook, or Yahoo).');
  }

  openWebMail(provider: 'gmail' | 'outlook' | 'yahoo') {
    const hasChatDraft = !!(this.collected.name && this.collected.subject && this.collected.message);
    const subject = hasChatDraft
      ? `[Portfolio] ${this.collected.subject} — ${this.collected.name}`
      : 'Hello from your portfolio';
    const body = hasChatDraft
      ? `Hi Aditya,\n\n${this.collected.message}\n\n—\nFrom: ${this.collected.name}\nEmail: ${this.collected.email}\nSent via portfolio contact chatbot`
      : 'Hi Aditya,\n\n';

    const url = this.buildWebMailUrl(provider, subject, body);
    window.open(url, '_blank', 'noopener,noreferrer');
    this.snackBar.open(`Opening ${provider} compose in your browser…`, 'Close', {
      duration: 4000,
      panelClass: ['success-snackbar']
    });
  }

  private buildWebMailUrl(
    provider: 'gmail' | 'outlook' | 'yahoo',
    subject: string,
    body: string
  ): string {
    const to = encodeURIComponent(this.emailTo);
    const su = encodeURIComponent(subject);
    const bd = encodeURIComponent(body);

    switch (provider) {
      case 'gmail':
        return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${bd}`;
      case 'outlook':
        return `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${su}&body=${bd}`;
      case 'yahoo':
        return `https://compose.mail.yahoo.com/?to=${to}&subject=${su}&body=${bd}`;
    }
  }

  resetChat(announce = true) {
    this.collected = { name: '', email: '', subject: '', message: '' };
    this.currentField = 'name';
    this.draft = '';
    this.messages = [];
    this.showMailProviders = false;
    this.pushBot(
      "Hi! I'm Aditya's contact assistant. I'll collect a few details, then open a webmail compose window in your browser."
    );
    this.pushBot("What's your name?");
    if (announce) {
      this.snackBar.open('Chat restarted.', 'Close', { duration: 2000 });
    }
  }

  openSocialLink(url: string) {
    window.open(url, '_blank');
  }

  openContactLink(link: string) {
    if (link) {
      window.open(link, '_blank');
    }
  }

  private replyForField(field: ChatField) {
    this.isTyping = true;
    setTimeout(() => {
      this.isTyping = false;
      if (field === 'email') {
        this.pushBot(`Nice to meet you, ${this.collected.name}! What's your email?`);
      } else if (field === 'subject') {
        this.pushBot('Got it. What subject should I use?');
      } else if (field === 'message') {
        this.pushBot('Great. Tell me your message or opportunity details.');
      } else {
        this.pushBot(
          `Perfect. I have everything. Tap “Compose in browser”, then pick Gmail, Outlook, or Yahoo — it opens a draft to ${this.emailTo} in a new tab.`
        );
        this.showMailProviders = true;
      }
      this.scrollChat();
    }, 450);
  }

  private pushBot(text: string) {
    this.messages.push({ from: 'bot', text });
    this.scrollChat();
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private scrollChat() {
    setTimeout(() => {
      const el = this.chatBody?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 30);
  }
}
