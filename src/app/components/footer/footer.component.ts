import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BrandIconComponent, BrandIconName } from '../brand-icon/brand-icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, BrandIconComponent],
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
    // { label: 'Alchemist Demo', anchor: 'alchemist-demo' },
    { label: 'Skills', anchor: 'tech-stack' },
    { label: 'Contact', anchor: 'contact' }
  ];

  socialLinks: { name: string; icon: BrandIconName; url: string }[] = [
    { name: 'GitHub', icon: 'github', url: 'https://github.com/sdeaaditya' },
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/in/sdeaditya' },
    { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/keshriadityaa' },
    { name: 'Email', icon: 'email', url: 'https://mail.google.com/mail/?view=cm&fs=1&to=akkeshriaditya@gmail.com' }
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
