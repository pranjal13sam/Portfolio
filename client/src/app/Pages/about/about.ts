import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  fullName = 'Pranjal';
  profilePhoto = '/PassPhoto.jpg';
  stats = [
    { label: 'Experience', value: '2+ years' },
    { label: 'Specialty', value: 'Full Stack' },
    { label: 'Focus', value: 'Performance-Driven Development' },
  ];

  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
