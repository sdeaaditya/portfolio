import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  animationState = 'in';
  laptopOpened = true;
  hologramActive = true;
  profileVisible = true;
  terminalActive = false;
  textVisible = true;
  typedCommands: string[] = [];
  isTyping = false;
  displayName = 'ADITYA KESHRI';
  nameWords: { char: string }[][] = [];
  nameHovered = false;

  keys = Array(48).fill(0);
  
  codeSnippets = [
  ];

  terminalCommands = [
    'git clone https://github.com/sdeaaditya/portfolio.git',
    'npm install && npm run build',
    'docker build -t portfolio:latest .',
    'docker run -p 3000:3000 portfolio:latest',
    'Application running successfully ✓'
  ];

  mainTechs = [
    { icon: '🅰️', name: 'Angular' },
    { icon: '🐍', name: 'Python' },
    { icon: '☕︎', name: 'Java' },
    { icon: '🟢', name: 'Node.js' },
    { icon: '🐬', name: 'MySQL' },
    { icon: '🍃', name: 'MongoDB' },
    { icon: '☁️', name: 'AWS/Azure' },
  ];

  private typingTimeouts: ReturnType<typeof setTimeout>[] = [];

  ngOnInit() {
    this.animationState = 'in';
    this.nameWords = this.displayName
      .split(' ')
      .map(word => word.split('').map(char => ({ char })));
  }

  onNameEnter() {
    this.nameHovered = true;
  }

  onNameLeave() {
    this.nameHovered = false;
  }

  bounceLetter(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('letter-pop');
    // Force reflow so animation can replay
    void target.offsetWidth;
    target.classList.add('letter-pop');
  }

  downloadResume() {
    const link = document.createElement('a');
    link.href = 'https://drive.google.com/uc?export=download&id=1raxpa3jaa_JEf7VWAvjxCilKqQwkw6v_';
    link.download = 'Aditya_Keshri_Resume.pdf';
    link.click();
  }

  scrollToContact() {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  onMonitorClick() {
    if (this.hologramActive) {
      this.hologramActive = false;
      this.profileVisible = false;
      this.terminalActive = true;
      this.startTerminalTyping();
    } else {
      this.clearTypingTimers();
      this.terminalActive = false;
      this.hologramActive = true;
      this.profileVisible = true;
      this.typedCommands = [];
      this.isTyping = false;
    }
  }

  private startTerminalTyping() {
    this.clearTypingTimers();
    this.typedCommands = [];
    this.isTyping = true;

    let delay = 0;
    this.terminalCommands.forEach((command, index) => {
      this.typedCommands.push('');
      for (let charIndex = 0; charIndex < command.length; charIndex++) {
        const timeout = setTimeout(() => {
          this.typedCommands[index] = command.slice(0, charIndex + 1);
        }, delay + charIndex * 28);
        this.typingTimeouts.push(timeout);
      }
      delay += command.length * 28 + 350;
    });

    const doneTimeout = setTimeout(() => {
      this.isTyping = false;
    }, delay);
    this.typingTimeouts.push(doneTimeout);
  }

  private clearTypingTimers() {
    this.typingTimeouts.forEach(timeout => clearTimeout(timeout));
    this.typingTimeouts = [];
  }
}
