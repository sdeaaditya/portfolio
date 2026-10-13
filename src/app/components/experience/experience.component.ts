import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';

interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  logo: string;
  current: boolean;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  animations: [
    trigger('slideInUp', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('600ms ease-out')
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger(300, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ExperienceComponent implements OnInit {
  visible = false;

  experiences: Experience[] = [
    {
      id: 1,
      company: 'Netlink Software Group',
      position: 'Senior Software Developer',
      duration: 'Dec 2025 - Present',
      location: 'Remote / India',
      description: 'As a Senior Software Developer at Netlink Software Group, I build enterprise backend platforms and GenAI-powered agents for life-science and product feedback use cases. I work across Python, FastAPI, React, cloud orchestration, and AI agent workflows to deliver production-ready solutions for client programs.',
      achievements: [
        'Evidence Planner (Dec 2025 – Jun 2026): Built a portal to create and update medicine-related activities and publish new medicine data for stakeholders across planning and publication workflows',
        'Alchemist AI Agent (mid-Jun 2026 – Aug 2026): Developed an AI agent that tracks medicine sales across 133 territories; users upload PDF data, the agent extracts insights, and returns sales performance percentages with top-performing medicines',
        'Feedback Agent (Aug 2026 – Present): Built an installable feedback agent that captures mouse interactions, supports screen recording, converses with users about bugs or feedback, and creates tickets on Jira, Confluence, or Azure DevOps boards based on the integrated tool'
      ],
      technologies: ['Python', 'FastAPI', 'React', 'GenAI', 'AWS', 'Docker', 'Airflow', 'PDF Parsing'],
      logo: 'assets/images/Netlink.svg',
      current: true
    },
    {
      id: 2,
      company: 'ZeOmega Infotech',
      position: 'Senior Full Stack Developer',
      duration: 'Jul 2024 - Dec 2025',
      location: 'Bangalore, Karnataka',
      description: 'As a Senior Software Developer, I led the design and development of scalable healthcare applications, architected microservices, and implemented secure API integrations. I mentored junior developers, drove best practices, and collaborated with cross-functional teams to deliver cloud-native solutions on Kubernetes and Rancher, ensuring high performance, reliability, and security.',
      achievements: [
        'Led development of scalable healthcare applications serving 100K+ users, ensuring performance and reliability',
        'Architected and implemented microservices solutions with secure API integrations using WSO2 API Manager',
        'Mentored junior developers, establishing coding standards and best practices to improve delivery quality',
        'Streamlined cloud-native deployments on Kubernetes and Rancher, reducing release cycle time and improving system uptime',
        'Enhanced system reliability and security by implementing API integrations, authentication mechanisms, and cloud deployments (Kubernetes, Rancher)'
      ],
      technologies: ['Angular', 'Python', 'WSO2', 'Docker', 'Kubernetes', 'Java', 'Azure'],
      logo: 'assets/images/Zeomega.jpeg',
      current: false
    },
    {
      id: 3,
      company: 'ZeOmega Infotech',
      position: 'Software Developer',
      duration: 'Sep 2021 - Jun 2024',
      location: 'Bangalore, Karnataka',
      description: 'As a Software Developer, I contributed to building enterprise healthcare applications, developing features in Java, Python, and Angular. I implemented REST APIs, optimized database queries, and supported API management with WSO2, while collaborating with QA and DevOps teams to deliver secure, high-quality, cloud-ready solutions.',
      achievements: [
        'Developed and deployed 15+ responsive healthcare web applications, improving usability and scalability',
        'Reduced bug reports by 30% through comprehensive testing and debugging practices',
        'Implemented real-time features with WebSocket, enhancing system responsiveness',
        'Optimized database queries, improving API response time by 25%'
      ],
      technologies: ['Angular', 'Python', 'TypeScript', 'WSO2', 'Docker', 'Kubernetes', 'Java', 'Azure'],
      logo: 'assets/images/Zeomega.jpeg',
      current: false
    },
    {
      id: 4,
      company: 'Newton School',
      position: 'Software Developer Intern',
      duration: 'Mar 2021 - Aug 2021',
      location: 'Virtual Bootcamp',
      description: 'Worked on hands-on projects using Java, MongoDB, Express.js, React, and Node.js (MERN). Collaborated with peers in Agile sprints, developed RESTful APIs, and built responsive web applications while strengthening data structures and algorithms through problem-solving practice.',
      achievements: [
        'Built 3+ full-stack web applications using MERN and Java',
        'Designed and deployed REST APIs integrated with frontend applications',
        'Enhanced problem-solving skills by solving 300+ DSA problems during the program',
        'Gained exposure to version control (Git/GitHub) and collaborative coding practices'
      ],
      technologies: ['ReactJs', 'JavaScript', 'MongoDB', 'Express.js', 'Node.js'],
      logo: 'assets/images/NewtonSchool.jpeg',
      current: false
    }
  ];

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

      const element = document.getElementById('experience');
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
}