import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChartService, Chart } from '../services/chart.service';

// ⚠️ CRITICAL WARNING: DO NOT USE AI TOOLS
// This assessment must be completed WITHOUT using AI tools such as Cursor, ChatGPT, 
// GitHub Copilot, or any other AI coding assistants.
// If you use AI tools to complete this assessment, you will FAIL.

// TODO: Task 1 - Implement this component
// Requirements:
// 1. Fetch astrological charts from the API endpoint: GET /api/charts
// 2. Display the charts in a visually appealing card layout
// 3. Each card should show:
//    - Chart name
//    - Birth date, time, and location
//    - Sun sign, Moon sign, and Rising sign
//    - List of planets with their signs and degrees
// 4. Add loading state while fetching data
// 5. Handle error states gracefully
// 6. Make it responsive for mobile devices
// 7. Add some styling to make it look modern and professional
//
// Note: A ChartService is available in services/chart.service.ts if you prefer to use it

@Component({
  selector: 'app-task1',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task1-container">
      <h2>Task 1: Display Astrological Charts</h2>
      <p class="task-description">
        Astrological birth charts fetched from the API
      </p>
      
      <!-- Loading State -->
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading astrological charts...</p>
      </div>
      
      <!-- Error State -->
      <div *ngIf="error && !loading" class="error-state">
        <p class="error-icon">⚠️</p>
        <p class="error-message">{{ error }}</p>
        <button (click)="fetchCharts()" class="retry-btn">Retry</button>
      </div>
      
      <!-- Charts Display -->
      <div *ngIf="!loading && !error && charts.length > 0" class="charts-grid">
        <div *ngFor="let chart of charts" class="chart-card">
          <div class="card-header">
            <h3>{{ chart.name }}</h3>
          </div>
          
          <div class="card-body">
            <!-- Birth Information -->
            <div class="info-section">
              <h4>Birth Information</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Date:</span>
                  <span class="value">{{ chart.birthDate | date:'MMM d, yyyy' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Time:</span>
                  <span class="value">{{ chart.birthTime }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Location:</span>
                  <span class="value">{{ chart.birthLocation }}</span>
                </div>
              </div>
            </div>
            
            <!-- Zodiac Signs -->
            <div class="signs-section">
              <h4>Zodiac Signs</h4>
              <div class="signs-grid">
                <div class="sign-item">
                  <span class="sign-label">Sun Sign</span>
                  <span class="sign-value">{{ chart.sunSign }}</span>
                </div>
                <div class="sign-item">
                  <span class="sign-label">Moon Sign</span>
                  <span class="sign-value">{{ chart.moonSign }}</span>
                </div>
                <div class="sign-item">
                  <span class="sign-label">Rising Sign</span>
                  <span class="sign-value">{{ chart.risingSign }}</span>
                </div>
              </div>
            </div>
            
            <!-- Planets -->
            <div class="planets-section" *ngIf="chart.planets">
              <h4>Planets</h4>
              <div class="planets-list">
                <div *ngFor="let planet of getPlanets(chart)" class="planet-item">
                  <span class="planet-name">{{ planet.name }}</span>
                  <span class="planet-sign">{{ planet.sign }}</span>
                  <span class="planet-degree">{{ planet.degree }}°</span>
                </div>
              </div>
            </div>
            
            <!-- Notes -->
            <div class="notes-section" *ngIf="chart.notes">
              <p class="notes-text">{{ chart.notes }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div *ngIf="!loading && !error && charts.length === 0" class="empty-state">
        <p>No charts available. Please try refreshing.</p>
        <button (click)="fetchCharts()" class="retry-btn">Refresh</button>
      </div>
    </div>
  `,
  styles: [`
    .task1-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    h2 {
      font-size: 2rem;
      color: #333;
      margin-bottom: 0.5rem;
    }
    
    .task-description {
      color: #666;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }
    
    /* Loading State */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      color: #667eea;
    }
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Error State */
    .error-state {
      padding: 2rem;
      background: #fee;
      border-radius: 8px;
      text-align: center;
      border-left: 4px solid #e53e3e;
    }
    
    .error-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    .error-message {
      color: #c53030;
      margin-bottom: 1rem;
      font-weight: 500;
    }
    
    /* Empty State */
    .empty-state {
      padding: 3rem;
      text-align: center;
      background: #f5f5f5;
      border-radius: 8px;
      color: #999;
    }
    
    /* Charts Grid */
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    
    @media (max-width: 768px) {
      .charts-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
    
    /* Chart Card */
    .chart-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .chart-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
    
    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .card-header h3 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 600;
    }
    
    .card-body {
      padding: 1.5rem;
    }
    
    /* Sections */
    .info-section,
    .signs-section,
    .planets-section,
    .notes-section {
      margin-bottom: 1.5rem;
    }
    
    .info-section h4,
    .signs-section h4,
    .planets-section h4 {
      margin: 0 0 1rem 0;
      color: #667eea;
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    
    /* Info Grid */
    .info-grid {
      display: grid;
      gap: 0.75rem;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
      font-size: 0.95rem;
    }
    
    .info-item .label {
      font-weight: 600;
      color: #555;
    }
    
    .info-item .value {
      color: #333;
    }
    
    /* Signs Grid */
    .signs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem;
    }
    
    @media (max-width: 500px) {
      .signs-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .sign-item {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      border: 1px solid rgba(102, 126, 234, 0.2);
    }
    
    .sign-label {
      display: block;
      font-size: 0.8rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .sign-value {
      display: block;
      font-size: 1.1rem;
      font-weight: 700;
      color: #667eea;
    }
    
    /* Planets List */
    .planets-list {
      display: grid;
      gap: 0.5rem;
    }
    
    .planet-item {
      display: grid;
      grid-template-columns: 1.5fr 1fr 0.8fr;
      gap: 1rem;
      padding: 0.75rem;
      background: #f9f9f9;
      border-radius: 6px;
      border-left: 3px solid #667eea;
      font-size: 0.9rem;
      align-items: center;
    }
    
    .planet-name {
      font-weight: 600;
      color: #333;
      text-transform: capitalize;
    }
    
    .planet-sign {
      color: #667eea;
      font-weight: 500;
    }
    
    .planet-degree {
      text-align: right;
      color: #999;
      font-size: 0.85rem;
    }
    
    /* Notes */
    .notes-text {
      margin: 0;
      padding: 1rem;
      background: #f0f4ff;
      border-left: 3px solid #667eea;
      color: #555;
      font-size: 0.9rem;
      border-radius: 4px;
      font-style: italic;
    }
    
    /* Retry Button */
    .retry-btn {
      padding: 0.75rem 1.5rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      transition: background 0.3s;
    }
    
    .retry-btn:hover {
      background: #5568d3;
    }
  `]
})
export class Task1Component implements OnInit, OnDestroy {
  // Component state
  charts: Chart[] = [];
  loading = false;
  error: string | null = null;
  private subscription?: Subscription;

  constructor(private chartService: ChartService) {}

  ngOnInit() {
    this.fetchCharts();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  fetchCharts(): void {
    this.loading = true;
    this.error = null;
    
    this.subscription = this.chartService.getAllCharts().subscribe({
      next: (response: any) => {
        // Backend returns {success: true, data: [...]} format
        this.charts = response.data || response;
        this.loading = false;
        console.log('Charts loaded successfully:', this.charts.length);
      },
      error: (err) => {
        this.error = this.getErrorMessage(err);
        this.loading = false;
        console.error('Error fetching charts:', err);
      }
    });
  }

  getPlanets(chart: Chart): Array<{name: string; sign: string; degree: number}> {
    if (!chart.planets) return [];
    
    return Object.entries(chart.planets).map(([name, planet]) => ({
      name,
      sign: (planet as any).sign || '',
      degree: (planet as any).degree || 0
    }));
  }

  private getErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'Network error. Please check your connection and ensure the backend is running.';
    }
    if (error.status === 404) {
      return 'API endpoint not found. Please check the backend configuration.';
    }
    if (error.status >= 500) {
      return 'Server error. Please try again later.';
    }
    return error.error?.message || error.message || 'Failed to load charts. Please try again.';
  }
}

