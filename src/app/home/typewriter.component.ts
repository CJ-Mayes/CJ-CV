import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-typewriter',
  template: `
    <span class="typewriter-text">{{displayText}}<span class="cursor" [class.blink]="showCursor">|</span></span>
  `,
  styles: [`
    .typewriter-text {
      display: inline-block;
    }
    .cursor {
      display: inline-block;
      margin-left: 2px;
      color: inherit;
      font-weight: normal;
    }
    .cursor.blink {
      animation: blink 1s infinite;
    }
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TypewriterComponent implements OnInit, OnDestroy {
  @Input() strings: string[] = [];
  @Input() typeSpeed: number = 100; // milliseconds per character
  @Input() deleteSpeed: number = 50; // milliseconds per character
  @Input() pauseDelay: number = 2000; // milliseconds to pause before deleting
  @Input() loop: boolean = true;

  displayText: string = '';
  showCursor: boolean = true;
  private currentStringIndex: number = 0;
  private currentCharIndex: number = 0;
  private isDeleting: boolean = false;
  private timeoutId: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.strings.length > 0) {
      this.type();
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private type(): void {
    const currentString = this.strings[this.currentStringIndex];
    
    if (!this.isDeleting) {
      // Typing
      this.displayText = currentString.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
      this.cdr.detectChanges();

      if (this.currentCharIndex < currentString.length) {
        // Continue typing
        this.timeoutId = setTimeout(() => this.type(), this.typeSpeed);
      } else {
        // Finished typing, pause before deleting
        this.timeoutId = setTimeout(() => {
          this.isDeleting = true;
          this.type();
        }, this.pauseDelay);
      }
    } else {
      // Deleting
      this.displayText = currentString.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
      this.cdr.detectChanges();

      if (this.currentCharIndex > 0) {
        // Continue deleting
        this.timeoutId = setTimeout(() => this.type(), this.deleteSpeed);
      } else {
        // Finished deleting, move to next string
        this.isDeleting = false;
        this.currentStringIndex++;
        
        if (this.currentStringIndex >= this.strings.length) {
          if (this.loop) {
            this.currentStringIndex = 0;
          } else {
            // Stop if not looping
            return;
          }
        }
        
        this.timeoutId = setTimeout(() => this.type(), this.typeSpeed);
      }
    }
  }
}
