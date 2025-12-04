import { Component, ChangeDetectorRef, NgZone, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { timeout, finalize } from 'rxjs/operators';
import html2pdf from 'html2pdf.js';
// Optional: You can use the ChartService from services/chart.service.ts instead of HttpClient directly
// import { ChartService, Chart, CalculateChartRequest } from '../services/chart.service';

// ⚠️ CRITICAL WARNING: DO NOT USE AI TOOLS
// This assessment must be completed WITHOUT using AI tools such as Cursor, ChatGPT, 
// GitHub Copilot, or any other AI coding assistants.
// If you use AI tools to complete this assessment, you will FAIL.

// TODO: Task 2 - Implement this component
// Requirements:
// 1. Create a form with the following fields:
//    - Birth Date (date picker)
//    - Birth Time (time input)
//    - Birth Location (text input)
// 2. Validate all fields are required
// 3. On form submission, send POST request to /api/charts/calculate
// 4. Display the calculated chart result in a nice format
// 5. Show loading state during API call
// 6. Handle errors appropriately
// 7. Reset form after successful submission
// 8. Add form validation messages
// 9. Make the form responsive and user-friendly
//
// Note: A ChartService is available in services/chart.service.ts if you prefer to use it

interface ChartResult {
  id: number;
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  planets: {
    sun: { sign: string; degree: number };
    moon: { sign: string; degree: number };
    mercury: { sign: string; degree: number };
    venus: { sign: string; degree: number };
    mars: { sign: string; degree: number };
  };
}

@Component({
  selector: 'app-task2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="task2-container">
      <h2>Task 2: Birth Chart Calculator</h2>
      <p class="task-description">
        Enter your birth information to calculate your astrological birth chart
      </p>
      
      <div class="content-wrapper">
        <!-- Form Section -->
        <div class="form-section">
          <h3>Birth Information</h3>
          
          <form [formGroup]="chartForm" (ngSubmit)="onSubmit()" class="chart-form">
            <!-- Birth Date Field -->
            <div class="form-group">
              <label for="birthDate">Birth Date *</label>
              <input
                type="date"
                id="birthDate"
                formControlName="birthDate"
                class="form-control"
                [class.invalid]="isFieldInvalid('birthDate')"
              />
              <div *ngIf="isFieldInvalid('birthDate')" class="error-message">
                <span *ngIf="chartForm.get('birthDate')?.errors?.['required']">
                  Birth date is required
                </span>
              </div>
            </div>
            
            <!-- Birth Time Field -->
            <div class="form-group">
              <label for="birthTime">Birth Time *</label>
              <input
                type="time"
                id="birthTime"
                formControlName="birthTime"
                class="form-control"
                [class.invalid]="isFieldInvalid('birthTime')"
              />
              <div *ngIf="isFieldInvalid('birthTime')" class="error-message">
                <span *ngIf="chartForm.get('birthTime')?.errors?.['required']">
                  Birth time is required
                </span>
              </div>
            </div>
            
            <!-- Birth Location Field -->
            <div class="form-group">
              <label for="birthLocation">Birth Location *</label>
              <input
                type="text"
                id="birthLocation"
                formControlName="birthLocation"
                placeholder="e.g., New York, NY"
                class="form-control"
                [class.invalid]="isFieldInvalid('birthLocation')"
              />
              <div *ngIf="isFieldInvalid('birthLocation')" class="error-message">
                <span *ngIf="chartForm.get('birthLocation')?.errors?.['required']">
                  Birth location is required
                </span>
              </div>
            </div>
            
            <!-- Submit Button -->
            <div class="form-actions">
              <button
                type="submit"
                class="submit-btn"
                [disabled]="chartForm.invalid || calculating"
              >
                <span *ngIf="!calculating">Calculate Chart</span>
                <span *ngIf="calculating">
                  <span class="spinner-small"></span> Calculating...
                </span>
              </button>
              <button
                type="button"
                class="reset-btn"
                (click)="onReset()"
                [disabled]="calculating"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
        
        <!-- Result Section -->
        <div class="result-section" *ngIf="chartResult || calculating || resultError">
          <!-- Loading State -->
          <div *ngIf="calculating" class="loading-result">
            <div class="spinner"></div>
            <p>Calculating your birth chart...</p>
          </div>
          
          <!-- Error State -->
          <div *ngIf="resultError && !calculating" class="error-result">
            <p class="error-icon">⚠️</p>
            <p class="error-text">{{ resultError }}</p>
            <button (click)="clearResult()" class="close-btn">Dismiss</button>
          </div>
          
          <!-- Success State - Chart Result -->
          <div *ngIf="chartResult && !calculating" class="chart-result">
            <div class="result-header">
              <h3>Your Birth Chart</h3>
              <div class="result-actions">
                <button (click)="downloadPDF()" class="download-btn" title="Download as PDF">
                   Download PDF
                </button>
                <button (click)="clearResult()" class="close-btn">✕</button>
              </div>
            </div>
            
            <div class="result-body" #chartPdfContent>
              <!-- Birth Information -->
              <div class="result-section-birth">
                <h4>Birth Information</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Date:</span>
                    <span class="value">{{ chartResult.birthDate | date:'MMM d, yyyy' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Time:</span>
                    <span class="value">{{ chartResult.birthTime }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Location:</span>
                    <span class="value">{{ chartResult.birthLocation }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Zodiac Signs -->
              <div class="result-signs">
                <h4>Your Zodiac Signs</h4>
                <div class="signs-display">
                  <div class="sign-box">
                    <span class="sign-label">Sun</span>
                    <span class="sign-name">{{ chartResult.sunSign }}</span>
                  </div>
                  <div class="sign-box">
                    <span class="sign-label">Moon</span>
                    <span class="sign-name">{{ chartResult.moonSign }}</span>
                  </div>
                  <div class="sign-box">
                    <span class="sign-label">Rising</span>
                    <span class="sign-name">{{ chartResult.risingSign }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Planets -->
              <div class="result-planets" *ngIf="chartResult.planets">
                <h4>Planetary Positions</h4>
                <div class="planets-table">
                  <div class="planet-header">
                    <span>Planet</span>
                    <span>Sign</span>
                    <span>Degree</span>
                  </div>
                  <div *ngFor="let planet of getResultPlanets(chartResult)" class="planet-row">
                    <span class="planet-name">{{ planet.name }}</span>
                    <span class="planet-sign">{{ planet.sign }}</span>
                    <span class="planet-degree">{{ planet.degree }}°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task2-container {
      max-width: 1200px;
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
    
    .content-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }
    
    @media (max-width: 968px) {
      .content-wrapper {
        grid-template-columns: 1fr;
      }
    }
    
    /* Form Section */
    .form-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .form-section h3 {
      color: #667eea;
      margin-top: 0;
      margin-bottom: 1.5rem;
      font-size: 1.2rem;
    }
    
    .chart-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }
    
    .form-group label {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }
    
    .form-control {
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .form-control.invalid {
      border-color: #e53e3e;
    }
    
    .form-control.invalid:focus {
      box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
    }
    
    .error-message {
      color: #e53e3e;
      font-size: 0.85rem;
      margin-top: 0.35rem;
      font-weight: 500;
    }
    
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .submit-btn,
    .reset-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      flex: 1;
    }
    
    .submit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .reset-btn {
      background: #f0f0f0;
      color: #333;
    }
    
    .reset-btn:hover:not(:disabled) {
      background: #e0e0e0;
    }
    
    .reset-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .spinner-small {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 0.5rem;
    }
    
    /* Result Section */
    .result-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      min-height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    
    .loading-result {
      text-align: center;
    }
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .loading-result p {
      color: #667eea;
      font-weight: 500;
    }
    
    .error-result {
      text-align: center;
      width: 100%;
    }
    
    .error-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
    }
    
    .error-text {
      color: #e53e3e;
      margin-bottom: 1.5rem;
      font-weight: 500;
    }
    
    .chart-result {
      width: 100%;
    }
    
    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f0f0f0;
    }
    
    .result-header h3 {
      margin: 0;
      color: #667eea;
      font-size: 1.2rem;
    }
    
    .result-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    
    .download-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
    }
    
    .download-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    
    .download-btn:active {
      transform: translateY(0);
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #999;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.3s;
    }
    
    .close-btn:hover {
      background: #f0f0f0;
      color: #333;
    }
    
    .result-body {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .result-section-birth h4,
    .result-signs h4,
    .result-planets h4 {
      margin: 0 0 1rem 0;
      color: #667eea;
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    
    .info-grid {
      display: grid;
      gap: 0.75rem;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem;
      background: #f9f9f9;
      border-radius: 6px;
      border-left: 3px solid #667eea;
    }
    
    .info-item .label {
      font-weight: 600;
      color: #555;
    }
    
    .info-item .value {
      color: #333;
    }
    
    .signs-display {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem;
    }
    
    @media (max-width: 500px) {
      .signs-display {
        grid-template-columns: 1fr;
      }
    }
    
    .sign-box {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      border: 1px solid rgba(102, 126, 234, 0.2);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .sign-label {
      font-size: 0.8rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      font-weight: 600;
    }
    
    .sign-name {
      font-size: 1.2rem;
      font-weight: 700;
      color: #667eea;
    }
    
    .planets-table {
      display: flex;
      flex-direction: column;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .planet-header {
      display: grid;
      grid-template-columns: 1.5fr 1fr 0.8fr;
      gap: 1rem;
      padding: 1rem;
      background: #f9f9f9;
      font-weight: 600;
      color: #555;
      text-transform: uppercase;
      font-size: 0.85rem;
      border-bottom: 2px solid #e0e0e0;
    }
    
    .planet-row {
      display: grid;
      grid-template-columns: 1.5fr 1fr 0.8fr;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f0f0f0;
      align-items: center;
    }
    
    .planet-row:last-child {
      border-bottom: none;
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
    }
  `]
})
export class Task2Component {
  chartForm: FormGroup;
  calculating = false;
  chartResult: ChartResult | null = null;
  resultError: string | null = null;
  
  @ViewChild('chartPdfContent') chartPdfContent!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.chartForm = this.fb.group({
      birthDate: ['', Validators.required],
      birthTime: ['', Validators.required],
      birthLocation: ['', Validators.required]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.chartForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.chartForm.invalid) {
      return;
    }

    this.calculating = true;
    this.resultError = null;
    this.chartResult = null;

    const formData = this.chartForm.value;
    console.log('Submitting form data:', formData);

    // Add timeout and finalize to prevent hanging and ensure calculating is cleared
    this.http.post<any>('/api/charts/calculate', formData).pipe(
      timeout(15000), // 15s timeout
      finalize(() => {
        // ensure loading flag is cleared regardless of success or error
        try {
          this.ngZone.run(() => {
            this.calculating = false;
          });
        } catch (e) {
          this.calculating = false;
        }
      })
    ).subscribe({
      next: (response: any) => {
        console.log('API Response received:', response);
        // Normalize result (backend may return {data: ...} or {chart: ...})
        let result = response;
        if (response && response.data) result = response.data;
        if (response && response.chart) result = response.chart;

        // Update state inside Angular zone so change detection runs
        this.ngZone.run(() => {
          this.chartResult = result;
        });
      },
      error: (err) => {
        console.error('API Error:', err);
        this.ngZone.run(() => {
          this.resultError = this.getErrorMessage(err);
        });
      }
    });
  }

  onReset(): void {
    this.chartForm.reset();
    this.clearResult();
  }

  clearResult(): void {
    this.chartResult = null;
    this.resultError = null;
  }

  getResultPlanets(chart: ChartResult): Array<{name: string; sign: string; degree: number}> {
    if (!chart.planets) return [];

    return Object.entries(chart.planets).map(([name, planet]) => ({
      name,
      sign: planet.sign || '',
      degree: planet.degree || 0
    }));
  }

  downloadPDF(): void {
    if (!this.chartResult || !this.chartPdfContent) {
      console.error('Chart result or PDF content not available');
      return;
    }

    try {
      // Get the element to convert to PDF
      const element = this.chartPdfContent.nativeElement;
      
      // Create a copy of the element to avoid modifying the original
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Remove any download button from the PDF content
      const downloadBtn = clone.querySelector('.result-header .download-btn');
      if (downloadBtn) {
        downloadBtn.remove();
      }
      
      // Prepare PDF options with proper types
      const opt = {
        margin: 10,
        filename: `birth-chart-${this.chartResult.birthDate || 'chart'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait' as const, unit: 'mm' as const, format: 'a4' as const }
      };
      
      // Generate and download PDF
      (html2pdf() as any).set(opt).from(clone).save();
      
      console.log('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  }

  private getErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'Network error. Please check your connection and ensure the backend is running.';
    }
    if (error.status === 400) {
      return 'Invalid input. Please check your birth information and try again.';
    }
    if (error.status === 404) {
      return 'API endpoint not found. Please check the backend configuration.';
    }
    if (error.status >= 500) {
      return 'Server error. Please try again later.';
    }
    return error.error?.message || error.message || 'Failed to calculate chart. Please try again.';
  }
}

