import { Component } from '@angular/core';

export interface TestimonialCard {
  id: number;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials {
  testimonials: TestimonialCard[] = [
    {
      id: 1,
      quote:
        'Pranjal is a focused developer who delivers on time. His attention to detail and clean code made our project a success. Would work with him again.',
      name: 'Yash Sahu',
      role: 'Software Engineer',
      company: 'HCL Technologies',
      avatar: '/m1.PNG',
    },
    {
      id: 2,
      quote:
        'Working with Pranjal was a pleasure. He brings design and code together really well and communicates clearly. Highly recommend him for frontend work.',
      name: 'Heather Forster',
      role: 'UI/UX Designer',
      company: 'PixelWorks',
      avatar: '/w1.PNG',
    },
    {
      id: 3,
      quote:
        'From concept to delivery, Pranjal handled everything professionally. His work ethic and ability to ship quality features on time are impressive.',
      name: 'Amy Jacobson',
      role: 'Tech Manager',
      company: 'CodeEmpire',
      avatar: '/w2.PNG',
    },
    {
      id: 4,
      quote:
        'Pranjal transformed our ideas into a modern, fast application. His skills and responsiveness made the entire collaboration smooth and productive.',
      name: 'Carry Smith',
      role: 'CTO',
      company: 'Innovate Labs',
      avatar: '/m2.PNG',
    },
  ];
}
