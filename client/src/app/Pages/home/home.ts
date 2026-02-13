import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ParticlesBackground } from '../../components/particles-background/particles-background';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { CommonModule, NgFor } from '@angular/common';
import * as THREE from 'three';
@Component({
  selector: 'app-home',
  standalone: true, // if using standalone component
  imports: [CommonModule, ParticlesBackground, FontAwesomeModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  animations: [
    trigger('typewriterEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),

    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),

    trigger('fadeInDelayed', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('800ms 400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class Home implements OnInit, OnDestroy {
  roles = ['Full Stack Developer', 'MERN Stack Developer', 'React Native Developer', 'Software Engineer'] as const;
  index = 0;
  subIndex = 0;
  deleting = false;
  displayedText = '';

    faGithub = faGithub;
  faLinkedin = faLinkedin;
  faInstagram = faInstagram;

  socials = [
    { icon: this.faGithub, label: 'GitHub', href: 'https://github.com/pranjal13sam' },
    { icon: this.faLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/pranjalpandey17/' },
    { icon: this.faInstagram, label: 'Instagram', href: 'https://www.instagram.com/pranjal__17/' },
  ];


  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private readonly typeDelay = 60;
  private readonly deleteDelay = 40;
  private readonly pauseAtEndMs = 1200;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.runTypewriter();
  }

  ngOnDestroy(): void {
    if (this.timeoutId != null) {
      clearTimeout(this.timeoutId);
    }
  }

  private runTypewriter(): void {
    const current = this.roles[this.index];

    if (!this.deleting && this.subIndex < current.length) {
      this.subIndex += 1;
      this.displayedText = current.substring(0, this.subIndex);
      this.cdr.markForCheck();
      this.timeoutId = setTimeout(() => this.runTypewriter(), this.typeDelay);
    } else if (!this.deleting && this.subIndex === current.length) {
      this.timeoutId = setTimeout(() => {
        this.deleting = true;
        this.cdr.markForCheck();
        this.timeoutId = setTimeout(() => this.runTypewriter(), this.deleteDelay);
      }, this.pauseAtEndMs);
    } else if (this.deleting && this.subIndex > 0) {
      this.subIndex -= 1;
      this.displayedText = current.substring(0, this.subIndex);
      this.cdr.markForCheck();
      this.timeoutId = setTimeout(() => this.runTypewriter(), this.deleteDelay);
    } else if (this.deleting && this.subIndex === 0) {
      this.deleting = false;
      this.index = (this.index + 1) % this.roles.length;
      this.cdr.markForCheck();
      this.timeoutId = setTimeout(() => this.runTypewriter(), this.typeDelay);
    }
  }
}
