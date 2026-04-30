import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-dark text-white py-4 mt-5">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h5>MovieApp</h5>
            <p class="mb-0">A demo application for movie browsing and reviews.</p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="mb-0">© {{ currentYear }} MovieApp. All rights reserved.</p>
            <p class="small text-muted">Powered by Angular {{ angularVersion }}</p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      margin-top: auto;
    }
    
    .text-muted {
      color: #adb5bd !important;
    }
  `]
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  angularVersion: string = '17';
}
