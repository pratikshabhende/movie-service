import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HeaderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the brand name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.navbar-brand')?.textContent).toContain('MovieApp');
  });

  it('should have a link to the movies page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('.nav-link');
    
    // Find the Movies link
    const moviesLink = Array.from(navLinks).find(link => 
      link.textContent?.includes('Movies')
    );
    
    expect(moviesLink).toBeTruthy();
    expect(moviesLink?.getAttribute('routerLink')).toBe('/movies');
  });

  it('should have the correct navigation structure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navbarNav = compiled.querySelector('#navbarNav');
    
    expect(navbarNav).toBeTruthy();
    expect(navbarNav?.querySelectorAll('.nav-item').length).toBe(1); // Only Movies link
  });
});
