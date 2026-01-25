import { Component, Input, AfterViewInit, OnDestroy, HostListener, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { LifeMomentCard } from './models/window-state.interface';

const TICKER_CONSTANTS = {
  INITIALIZATION_DELAY: 100,
  BASE_SCROLL_SPEED: 1,
  SCROLL_SPEED_MULTIPLIER: 0.5,
  SCROLL_SPEED_MULTIPLIER_MOBILE: 0.25, // Slower speed on mobile
  SCROLL_PROGRESS_MULTIPLIER: 2,
  MAX_SCROLL_SPEED: 3,
  GAP_PIXELS: 32 // 2rem gap
};

@Component({
  selector: 'app-polaroid-ticker',
  templateUrl: './polaroid-ticker.component.html',
  styleUrls: ['./polaroid-ticker.component.css'],
  standalone: false
})
export class PolaroidTickerComponent implements AfterViewInit, OnDestroy {
  @Input() cards: LifeMomentCard[] = [];
  @ViewChild('tickerContainer', { static: false }) tickerContainer!: ElementRef<HTMLDivElement>;
  
  scrollSpeed = TICKER_CONSTANTS.BASE_SCROLL_SPEED;
  private animationFrameId: number | null = null;
  private currentPosition = 0;
  private isMobile = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.checkMobile();
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth <= 768;
    // Listen for resize events to update mobile status
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.startAnimation();
    }, TICKER_CONSTANTS.INITIALIZATION_DELAY);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    const scrollProgress = Math.min(1, Math.max(0, scrollY / Math.max(1, documentHeight - windowHeight)));
    this.scrollSpeed = TICKER_CONSTANTS.BASE_SCROLL_SPEED + (scrollProgress * TICKER_CONSTANTS.SCROLL_PROGRESS_MULTIPLIER);
  }

  startAnimation(): void {
    const animate = () => {
      const container = this.tickerContainer?.nativeElement;
      if (!container) {
        this.animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const speedMultiplier = this.isMobile 
        ? TICKER_CONSTANTS.SCROLL_SPEED_MULTIPLIER_MOBILE 
        : TICKER_CONSTANTS.SCROLL_SPEED_MULTIPLIER;
      this.currentPosition -= this.scrollSpeed * speedMultiplier;
      
      const firstItem = container.querySelector('.polaroid-item') as HTMLElement;
      if (firstItem) {
        const itemWidth = firstItem.offsetWidth;
        const itemsPerSet = this.cards.length;
        const contentWidth = (itemWidth + TICKER_CONSTANTS.GAP_PIXELS) * itemsPerSet;
        
        if (Math.abs(this.currentPosition) >= contentWidth) {
          this.currentPosition = 0;
        }
      }
      
      container.style.transform = `translateX(${this.currentPosition}px)`;
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
