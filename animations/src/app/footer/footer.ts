import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule ],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit, OnDestroy {
 phrase = "NEXT UP - WATCH THE FULL DOCUMENTARY";
  letters: { char: string, active: boolean, visible: boolean }[] = [];
  private animationInterval: any;
  private isAnimating = false;
  private isScrolling = false;

  ngOnInit() {
    // Initialize letters array
    this.letters = this.phrase.split('').map(char => {
      return { char, active: false, visible: false };
    });
    
    // Start animation when component initializes
    setTimeout(() => this.startAnimation(), 1000);
  }

  startAnimation() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    let index = 0;
    
    // Reset all letters
    this.letters.forEach(letter => {
      letter.active = false;
      letter.visible = false;
    });
    
    this.animationInterval = setInterval(() => {
      if (index < this.letters.length) {
        this.letters[index].visible = true;
        
        // Add a slight delay before activating for visual effect
        setTimeout(() => {
          this.letters[index].active = true;
        }, 100);
        
        index++;
      } else {
        // Animation complete
        clearInterval(this.animationInterval);
        this.isAnimating = false;
        
        // Scroll to top after a brief delay
        setTimeout(() => {
          this.scrollToTop();
        }, 1500);
      }
    }, 120);
  }

  scrollToTop() {
    if (this.isScrolling) return;
    
    this.isScrolling = true;
    const scrollDuration = 1000;
    const scrollStep = -window.scrollY / (scrollDuration / 15);
    
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
        this.isScrolling = false;
      }
    }, 15);
  }
 

  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }
}
