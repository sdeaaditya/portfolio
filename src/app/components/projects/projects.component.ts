import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  featured: boolean;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  animations: [
    trigger('slideIn', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('600ms ease-out')
      ])
    ])
  ]
})
export class ProjectsComponent implements OnInit {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  
  visible = false;
  currentIndex = 0;
  itemsPerView = 1;
  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  projects: Project[] = [
    {
      id: 1,
      title: 'Data Agency Management System',
      description: 'A Data Agency Management System that streamlines client onboarding, project tracking, and reporting with secure access controls and real-time insights.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
      technologies: ['ReactJs', 'MongoDB', 'Express.js', 'Tailwind CSS', 'Bcrypt.js'],
      githubUrl: 'https://github.com/sdeaaditya/dba-project',
      demoUrl: 'https://socialanalytics-demo.com',
      featured: false
    },
    {
      id: 2,
      title: 'MediCart – Online Pharmacy Platform',
      description: 'A pharmacy e-commerce platform that enables secure online medicine purchases with prescription uploads, inventory management, and order tracking.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop',
      technologies: ['Angular', 'Django REST Framework', 'Python', 'Stripe API', 'Socket.io'],
      githubUrl: 'https://github.com/sdeaaditya/medicart',
      demoUrl: 'https://ecommerce-demo.com',
      featured: false
    },
    {
      id: 3,
      title: 'To-Do List Application',
      description: 'A comprehensive task management web application with RESTful APIs for CRUD operations, MySQL database integration, and a responsive web interface for easy task management.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop',
      technologies: ['Flask', 'MySQL', 'HTML/CSS/JavaScript','Python', 'Jinja2'],
      githubUrl: 'https://github.com/sdeaaditya/task-manager',
      demoUrl: 'https://taskmanager-demo.com',
      featured: false
    },
    {
      id: 4,
      title: 'Weather Dashboard',
      description: 'A responsive weather dashboard with interactive maps, forecasts, and weather alerts. Features beautiful data visualizations and location-based services.',
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500&h=300&fit=crop',
      technologies: ['React', 'Flask', 'OpenWeatherMap API', 'SQLite', 'Python'],
      githubUrl: 'https://github.com/sdeaaditya/weather-report',
      demoUrl: 'https://weather-demo.com',
      featured: false
    },
    {
      id: 5,
      title: 'AI Chat Assistant',
      description: 'An intelligent chat assistant with real-time messaging, typing indicators, chat history, and session management. Features a modern responsive interface with natural language processing capabilities.',
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=500&h=300&fit=crop',
      technologies: ['React', 'Python', 'Flask', 'Machine Learning', 'WebSocket'],
      githubUrl: 'https://github.com/sdeaaditya/chat-assist',
      demoUrl: 'https://aichat-demo.com',
      featured: false
    },
    {
      id: 6,
      title: 'Cryptocurrency Tracker',
      description: 'A modern, responsive web application for tracking real-time cryptocurrency prices and managing personal watchlists. Features live market data, detailed coin analysis, advanced search functionality, and interactive price charts.',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=300&fit=crop',
      technologies: ['Angular', 'Node.js', 'Express.js', 'SQLite', 'CoinGecko API'],
      githubUrl: 'https://github.com/sdeaaditya/crypto-tracker',
      demoUrl: 'https://cryptotracker-demo.com',
      featured: false
    }
  ];

  ngOnInit() {
    this.updateItemsPerView();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.updateItemsPerView());
    }

    // Intersection Observer for animations
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.visible = true;
          }
        });
      }, { threshold: 0.2 });

      const element = document.getElementById('projects');
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

  updateItemsPerView() {
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1200) {
        this.itemsPerView = 3;
      } else if (width >= 768) {
        this.itemsPerView = 2;
      } else {
        this.itemsPerView = 1;
      }
    } else {
      // Default for server-side rendering
      this.itemsPerView = 3;
    }
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.pageX - this.carousel.nativeElement.offsetLeft;
    this.scrollLeft = this.carousel.nativeElement.scrollLeft;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - this.carousel.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2;
    this.carousel.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  nextSlide() {
    if (this.currentIndex < this.projects.length - this.itemsPerView) {
      this.currentIndex++;
      this.scrollToIndex();
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.scrollToIndex();
    }
  }

  scrollToIndex() {
    const cardWidth = 400; // Approximate card width including margin
    const scrollPosition = this.currentIndex * cardWidth;
    this.carousel.nativeElement.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  trackByProjectId(index: number, project: Project): number {
    return project.id;
  }
}
