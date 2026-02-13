import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {
 skills = [
    { id: 'react', name: 'React' },
    { id: 'mongodb', name: 'MongoDB' },
    { id: 'html', name: 'HTML' },
    { id: 'node', name: 'Node.js' },
    { id: 'angular', name: 'Angular' },
    { id: 'mysql', name: 'MySQL' },
    { id: 'css', name: 'CSS' },
    { id: 'postgres', name: 'PostgreSQL' },
    { id: 'cpp', name: 'C++' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'csharp', name: 'C#' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'nextjs', name: 'Next.js' },
    { id: 'tailwind', name: 'Tailwind CSS' },
    { id: 'dotnet', name: '.NET' },
    { id: 'python', name: 'Python' },
    { id: 'fastapi', name: 'FastAPI' },
    {id:'react',name:'React Native'}
  ];

  getIcon(id: string): string {
    const map: Record<string, string> = {
      react: 'fa-brands fa-react',
      mongodb: 'fa-solid fa-database',
      dotnet: 'fa-solid fa-code',
      html:'fa-brands fa-html5',
      css:'fa-brands fa-css',
        postgres: 'fa-solid fa-database',
      node: 'fa-brands fa-node-js',
      angular: 'fa-brands fa-angular',
      mysql: 'fa-solid fa-database',
      cpp: 'fa-solid fa-code',
      typescript: 'fa-brands fa-typescript',
      csharp: 'fa-solid fa-code',
      javascript: 'fa-brands fa-js',
      nextjs: 'fa-solid fa-n',
      tailwind: 'fa-solid fa-wind',
      python: 'fa-brands fa-python',

      fastapi: 'fa-solid fa-bolt',
    };

    return map[id] || 'fa-solid fa-code';
  }
}
