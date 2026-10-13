import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isScrolled = false;
  isMobileMenuOpen = false;

  menuItems = [
    { label: 'Home', anchor: 'hero', icon: 'home' },
    { label: 'Education', anchor: 'education', icon: 'school' },
    { label: 'Projects', anchor: 'projects', icon: 'work' },
    { label: 'Experience', anchor: 'experience', icon: 'business_center' },
    { label: 'Alchemist', anchor: 'alchemist-demo', icon: 'auto_awesome' },
    { label: 'Skills', anchor: 'tech-stack', icon: 'code' },
    { label: 'Contact', anchor: 'contact', icon: 'contact_mail' }
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  scrollToSection(anchor: string) {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    this.isMobileMenuOpen = false;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
