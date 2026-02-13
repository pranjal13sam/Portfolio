import { Component } from '@angular/core';

export interface ExperienceEntry {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  /** true = card above timeline, false = below */
  above: boolean;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience {
  experiences: ExperienceEntry[] = [
    {
      id: 1,
      title: 'Intern',
      company: 'Tomtomed Pvt. Limited',
      location: 'Virtual',
      period: 'Mar 2024 - Apr 2024',
      description:
        'Learned React and Tailwind CSS, how production code works, and version control with Git and GitHub.',
      above: true,
    },
    {
      id: 2,
      title: 'Frontend Engineer',
      company: 'Lexys Technologies',
      location: 'Hyderabad',
      period: 'May 2024 - Jan 2026',
      description:
        'Built BBS Optimization System (TATA Projects) reducing iron bar wastage by 30%. Implemented role-based access control (Requester, Manager, Viewer) with approval workflows.',
      above: false,
    },
    {
      id: 3,
      title: 'Software Engineer-1',
      company: 'Rugged Monitoring',
      location: 'Hyderabad',
      period: 'Jan 2026 - Present',
      description:
        'New joinee. Onboarding and getting to know the RM-Eye product.',
      above: true,
    },
  ];
}
