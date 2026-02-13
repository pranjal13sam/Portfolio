import { Routes } from '@angular/router';
import { Home } from './Pages/home/home';
import { About } from './Pages/about/about';
import { Skills } from './Pages/skills/skills';
import { Projects } from './Pages/projects/projects';
import { Experience } from './Pages/experience/experience';
import { Contact } from './Pages/contact/contact';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'skills', component: Skills },
  { path: 'projects', component: Projects },
  { path: 'experience', component: Experience },
  { path: 'contact', component: Contact },
  { path: '**', redirectTo: '' }
];