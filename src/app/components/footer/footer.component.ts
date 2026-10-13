import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  quickLinks = [
    { label: 'Home', anchor: 'hero' },
    { label: 'About', anchor: 'education' },
    { label: 'Projects', anchor: 'projects' },
    { label: 'Experience', anchor: 'experience' },
    { label: 'Skills', anchor: 'tech-stack' },
    { label: 'Contact', anchor: 'contact' }
  ];

  socialLinks = [
    { name: 'GitHub', icon: 'code', url: 'https://github.com/sdeaaditya' },
    { name: 'LinkedIn', icon: 'work', url: 'https://linkedin.com/in/sdeaditya' },
    { name: 'Twitter', icon: 'alternate_email', url: 'https://twitter.com/keshriadityaa' },
    { name: 'Email', icon: 'email', url: 'mailto:akkeshriaditya@gmail.com' }
  ];

  scrollToSection(anchor: string) {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
