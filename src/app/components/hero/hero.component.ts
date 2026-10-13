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
  laptopOpened = true; // Static - always opened
  hologramActive = true; // Static - always active
  profileVisible = true; // Static - always visible
  terminalActive = false; // Static - terminal off by default
  textVisible = true; // Static - always visible

  // Static flags
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

  ngOnInit() {
    // Static initialization - no animations
    this.animationState = 'in';
  }

  downloadResume() {
    // For demo purposes - in real app, this would download an actual resume
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
    // Toggle between hologram and terminal view - instant switching
    if (this.hologramActive) {
      this.hologramActive = false;
      this.profileVisible = false;
      this.terminalActive = true;
    } else {
      this.terminalActive = false;
      this.hologramActive = true;
      this.profileVisible = true; // Instant visibility
    }
  }
}
