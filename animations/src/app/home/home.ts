import { CommonModule, NgClass } from '@angular/common';
 
 import { Component, HostListener, OnInit, Inject, PLATFORM_ID, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [ CommonModule],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
 isNavVisible = false;
  isHovering = false;
  private bodyMarginClass = 'body-menu-hover';

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  onMenuHover() {
    this.isHovering = true;
    this.isNavVisible = true;
    this.renderer.addClass(document.body, this.bodyMarginClass);
  }

  onMenuLeave() {
    this.isHovering = false;
    this.renderer.removeClass(document.body, this.bodyMarginClass);
    // Add a small delay before hiding to prevent flickering
    setTimeout(() => {
      if (!this.isHovering) {
        this.isNavVisible = false;
      }
    }, 300);
  }

  onNavHover() {
    this.isHovering = true;
    this.renderer.addClass(document.body, this.bodyMarginClass);
  }

  onNavLeave() {
    this.isHovering = false;
    this.renderer.removeClass(document.body, this.bodyMarginClass);
    this.isNavVisible = false;
  }

  // Clean up when component is destroyed
  ngOnDestroy() {
    this.renderer.removeClass(document.body, this.bodyMarginClass);
  }


  
 

  // Show nav when hovering over the button
  @HostListener('click', ['$event'])
  onMouseEnter(event: any) {
    if (event.target.closest('.menu-btn')) {
      this.isNavVisible = true;
    }
  }

  // Hide nav when leaving the button area
  @HostListener('click', ['$event'])
  onMouseLeave(event: any) {
    if (event.target.closest('.menu-btn')) {
      this.isNavVisible = false;
    }
  }
  @ViewChild('section1Items') section1Items!: ElementRef;
  @ViewChild('section2Items') section2Items!: ElementRef;
  @ViewChild('section3Items') section3Items!: ElementRef;

  currentSection = 0;
  totalSections = 6;
  isScrolling = false;
  scrollOffset = '0vw';
  
  // Track scroll state for each section
  sectionScrollState = [
    { scrolled: false, element: null as any },
    { scrolled: false, element: null as any },
    { scrolled: false, element: null as any },
    { scrolled: true, element: null }, // Section 4 has no horizontal scrolling
    { scrolled: true, element: null }, // Section 5 has no horizontal scrolling
    { scrolled: true, element: null }  // Section 6 has no horizontal scrolling
  ];

  ngOnInit() {
    this.updateScrollOffset();
  }

  ngAfterViewInit() {
    // Set up the scrollable elements after view initialization
    this.sectionScrollState[0].element = this.section1Items.nativeElement;
    this.sectionScrollState[1].element = this.section2Items.nativeElement;
    this.sectionScrollState[2].element = this.section3Items.nativeElement;

    // Add scroll event listeners to each scrollable section
    this.sectionScrollState.forEach((section, index) => {
      if (section.element) {
        section.element.addEventListener('scroll', () => {
          this.checkScrollCompletion(index);
        });
      }
    });
  }

  updateScrollOffset() {
    this.scrollOffset = `${this.currentSection * 100}vw`;
  }

  checkScrollCompletion(sectionIndex: number) {
    const section = this.sectionScrollState[sectionIndex];
    if (!section.scrolled && section.element) {
      const scrollableWidth = section.element.scrollWidth - section.element.clientWidth;
      if (section.element.scrollLeft >= scrollableWidth - 10) { // 10px threshold
        section.scrolled = true;
      }
    }
  }

  // Handle wheel events
  @HostListener('window:wheel', ['$event'])
  onWindowWheel(event: WheelEvent) {
    if (this.isScrolling) return;
    
    const currentSectionData = this.sectionScrollState[this.currentSection];
    
    // If the current section has horizontal scrolling and isn't fully scrolled
    if (currentSectionData.element && !currentSectionData.scrolled) {
      // Allow horizontal scrolling to take precedence
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        currentSectionData.element.scrollLeft += event.deltaX;
      } else if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        // If vertical scrolling, apply it to horizontal scroll
        currentSectionData.element.scrollLeft += event.deltaY * 2;
      }
      event.preventDefault();
      
      // Check if scrolling has completed after a delay
      setTimeout(() => {
        this.checkScrollCompletion(this.currentSection);
      }, 150);
    } else {
      // Standard vertical navigation
      if (event.deltaY > 50) {
        this.scrollToSection(this.currentSection + 1);
      } else if (event.deltaY < -50) {
        this.scrollToSection(this.currentSection - 1);
      }
    }
  }

  // Handle keyboard navigation
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.isScrolling) return;
    
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      this.scrollToSection(this.currentSection + 1);
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      this.scrollToSection(this.currentSection - 1);
      event.preventDefault();
    }
  }

  // Scroll to a specific section
  scrollToSection(index: number) {
    // Check if we're trying to go to next section without scrolling current one
    if (index > this.currentSection && !this.sectionScrollState[this.currentSection].scrolled) {
      return;
    }
    
    if (index < 0 || index >= this.totalSections || this.isScrolling) return;
    
    this.isScrolling = true;
    this.currentSection = index;
    this.updateScrollOffset();
    
    // Allow scrolling again after transition
    setTimeout(() => {
      this.isScrolling = false;
    }, 1000);
  }

  // Get hint text for the current section
  getHintText(): string {
    if (this.currentSection === 0) {
      return this.sectionScrollState[0].scrolled 
        ? 'Scroll down or use arrow keys to continue' 
        : 'Scroll horizontally through all items to continue';
    }
    return '';
  }
}
