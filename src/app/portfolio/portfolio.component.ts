import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { HeroComponent } from '../components/hero/hero.component';
import { EducationComponent } from '../components/education/education.component';
import { ProjectsComponent } from '../components/projects/projects.component';
import { ExperienceComponent } from '../components/experience/experience.component';
// import { AlchemistDemoComponent } from '../components/alchemist-demo/alchemist-demo.component';
import { TechStackComponent } from '../components/tech-stack/tech-stack.component';
import { ContactComponent } from '../components/contact/contact.component';
import { FooterComponent } from '../components/footer/footer.component';

interface TrailDot {
  x: number;
  y: number;
  id: number;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    HeaderComponent, 
    HeroComponent, 
    EducationComponent,
    ProjectsComponent,
    ExperienceComponent,
    // AlchemistDemoComponent, // kept in codebase, not shown in build
    TechStackComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  scrollProgress = 0;
  trailDots: TrailDot[] = [];
  private trailId = 0;
  private preferReducedMotion = false;

  ngOnInit() {
    this.updateScrollProgress();
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.updateScrollProgress();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.preferReducedMotion || typeof window === 'undefined') {
      return;
    }

    this.trailDots = [
      ...this.trailDots.slice(-14),
      { x: event.clientX, y: event.clientY, id: this.trailId++ }
    ];

    this.applyMagneticPull(event.clientX, event.clientY);
  }

  private applyMagneticPull(x: number, y: number) {
    const magnets = document.querySelectorAll<HTMLElement>('.magnetic');
    magnets.forEach(el => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);
      const radius = 120;

      if (dist < radius) {
        const pull = (1 - dist / radius) * 12;
        el.style.transform = `translate(${(dx / dist) * pull || 0}px, ${(dy / dist) * pull || 0}px)`;
      } else {
        el.style.transform = '';
      }
    });
  }

  private updateScrollProgress() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    this.scrollProgress = height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0;
  }
}
