import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { HeroComponent } from '../components/hero/hero.component';
import { EducationComponent } from '../components/education/education.component';
import { ProjectsComponent } from '../components/projects/projects.component';
import { ExperienceComponent } from '../components/experience/experience.component';
import { AlchemistDemoComponent } from '../components/alchemist-demo/alchemist-demo.component';
import { TechStackComponent } from '../components/tech-stack/tech-stack.component';
import { ContactComponent } from '../components/contact/contact.component';
import { FooterComponent } from '../components/footer/footer.component';

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
    AlchemistDemoComponent,
    TechStackComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  scrollProgress = 0;

  ngOnInit() {
    this.updateScrollProgress();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.updateScrollProgress();
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
