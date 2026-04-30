import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="health-status">
      <h2>Health Status: OK</h2>
      <p>Application is running normally</p>
      <div class="status-details">
        <p><strong>Version:</strong> 1.0.0</p>
        <p><strong>Status:</strong> Healthy</p>
        <p><strong>Timestamp:</strong> {{ currentTime }}</p>
      </div>
    </div>
  `,
  styles: `
    .health-status {
      padding: 20px;
      border-radius: 5px;
      background-color: #dff0d8;
      border: 1px solid #d6e9c6;
      color: #3c763d;
      margin: 20px;
    }
    .status-details {
      margin-top: 15px;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 3px;
    }
  `
})
export class HealthComponent {
  currentTime = new Date().toISOString();
}
