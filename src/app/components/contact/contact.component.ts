import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule, 
    MatFormFieldModule,
    MatInputModule,
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
  visible = false;
  contactForm: FormGroup;
  isSubmitting = false;

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
    },
    // {
    //   name: 'Instagram',
    //   url: 'https://instagram.com/sdeaaditya',
    //   icon: 'camera_alt',
    //   color: '#e4405f'
    // },
    // {
    //   name: 'YouTube',
    //   url: 'https://youtube.com/sdeaaditya',
    //   icon: 'play_circle',
    //   color: '#ff0000'
    // },
    // {
    //   name: 'Discord',
    //   url: 'https://discord.gg/sdeaaditya',
    //   icon: 'chat',
    //   color: '#7289da'
    // }
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

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    // Use Intersection Observer to trigger animations when section is visible
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
      // Fallback for SSR or browsers without IntersectionObserver
      setTimeout(() => {
        this.visible = true;
      }, 500);
    }
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      
      // Simulate form submission (in real app, this would send to backend)
      setTimeout(() => {
        this.isSubmitting = false;
        this.snackBar.open('Message sent successfully! I\'ll get back to you soon.', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.contactForm.reset();
      }, 2000);
    } else {
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
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

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is too short`;
      }
    }
    return '';
  }
}
