import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Home } from './Pages/home/home';
import { About } from './Pages/about/about';
import { Skills } from './Pages/skills/skills';
import { Testimonials } from './Pages/testimonials/testimonials';
import { Projects } from './Pages/projects/projects';
import { Experience } from './Pages/experience/experience';
import { Contact } from './Pages/contact/contact';
import { ParticlesBackground } from './components/particles-background/particles-background';
import { CustomCursor } from './components/custom-cursor/custom-cursor';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,Navbar,Footer,Home,About,Skills,Testimonials,Projects,Experience,Contact,ParticlesBackground,CustomCursor],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('portfolio-client');
}
