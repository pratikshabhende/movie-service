import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { VERSION as ANGULAR_VERSION } from '@angular/core';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the current year in the copyright notice', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const currentYear = new Date().getFullYear().toString();
    
    expect(compiled.textContent).toContain(`© ${currentYear}`);
  });

  it('should display the Angular version', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // The component uses a simplified version number (just '17'), not the full version
    expect(compiled.textContent).toContain('Angular 17');
  });
});
