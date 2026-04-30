import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { Component } from '@angular/core';

// Create mock components
@Component({
  selector: 'app-header',
  standalone: true,
  template: '<div>Mock Header</div>'
})
class MockHeaderComponent {}

@Component({
  selector: 'app-footer',
  standalone: true,
  template: '<div>Mock Footer</div>'
})
class MockFooterComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppComponent,
        MockHeaderComponent,
        MockFooterComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render header', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
  });

  it('should render router outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should render footer', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });

  it('should have the correct structure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check for header at the top
    const firstChild = compiled.firstElementChild;
    expect(firstChild?.tagName.toLowerCase()).toBe('app-header');
    
    // Check for main content area
    const mainContent = compiled.querySelector('main');
    expect(mainContent).toBeTruthy();
    expect(mainContent?.classList.contains('container')).toBeTruthy();
    expect(mainContent?.querySelector('router-outlet')).toBeTruthy();
    
    // Check for footer at the bottom
    const lastChild = compiled.lastElementChild;
    expect(lastChild?.tagName.toLowerCase()).toBe('app-footer');
  });
});
