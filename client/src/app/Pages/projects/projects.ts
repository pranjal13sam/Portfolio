import { Component } from '@angular/core';

export interface ProjectSlide {
  id: number;
  title: string;
  tagline: string;
  description: string;
  wallpaper: string;
  bgClass: string;
  liveUrl?: string;
  exploreText: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  currentIndex = 0;

  projects: ProjectSlide[] = [
    {
      id: 1,
      title: 'Prescripto',
      tagline: 'A Doctor Appointment Booking System',
      description: 'Doctor and admin panel for hassle-free appointment scheduling.',
      wallpaper: '/projects/prescripto.png',
      bgClass: 'projects-bg-prescripto',
      exploreText: 'Explore Prescripto',
      liveUrl: 'https://prescripto-frontend-2xjv.onrender.com/',
    },
    {
      id: 2,
      title: 'AI SaaS',
      tagline: 'Create amazing content with AI tools',
      description: 'Transform your content creation with premium AI tools and workflow.',
      wallpaper: '/projects/ai-saas.png',
      bgClass: 'projects-bg-ai',
      exploreText: 'Explore our universe',
      liveUrl: 'https://quickai-nu.vercel.app/',
    },
    {
      id: 3,
      title: 'Pingify',
      tagline: 'A Chat Application in Real Time',
      description: 'Real-time messaging with a modern, secure sign-in experience.',
      wallpaper: '/projects/pingify.png',
      bgClass: 'projects-bg-pingify',
      exploreText: 'Explore Pingify',
      liveUrl: 'https://chat-application-5nxc.onrender.com/login',
    },
  ];

  get currentProject(): ProjectSlide {
    return this.projects[this.currentIndex];
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.projects.length;
  }

  prev(): void {
    this.currentIndex =
      this.currentIndex === 0 ? this.projects.length - 1 : this.currentIndex - 1;
  }

  goTo(index: number): void {
    this.currentIndex = index;
  }
}
