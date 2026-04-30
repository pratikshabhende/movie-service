import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-dark text-white">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
          <a class="navbar-brand" routerLink="/">
            <span class="material-icons me-2">movie</span>
            MovieApp
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                  aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <a class="nav-link" routerLink="/movies" routerLinkActive="active">Movies</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .navbar-brand {
      display: flex;
      align-items: center;
      font-size: 1.5rem;
      font-weight: 500;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .material-icons {
      vertical-align: middle;
    }
  `]
})
export class HeaderComponent {}
