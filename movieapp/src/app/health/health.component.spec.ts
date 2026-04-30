import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HealthComponent } from './health.component';

describe('HealthComponent', () => {
  let component: HealthComponent;
  let fixture: ComponentFixture<HealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a currentTime property', () => {
    expect(component.currentTime).toBeDefined();
    expect(typeof component.currentTime).toBe('string');
  });

  it('should display health status information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Health Status: OK');
    expect(compiled.querySelector('p')?.textContent).toContain('Application is running normally');
  });

  it('should display version information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.status-details')?.textContent).toContain('Version: 1.0.0');
  });

  it('should display status information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.status-details')?.textContent).toContain('Status: Healthy');
  });

  it('should display timestamp information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.status-details')?.textContent).toContain('Timestamp:');
    expect(compiled.querySelector('.status-details')?.textContent).toContain(component.currentTime);
  });
});
