import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);

  isNotFound(): boolean {
    return this.router.url !== '/' &&
      !['/home', '/login', '/register', '/profile'].includes(this.router.url);
  }
}