import { Component, Input } from '@angular/core';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
  selector: 'app-accordion-trigger',
  template: `
    <button 
      type="button"
      class="accordion-trigger"
      [class.open]="isOpen"
      (click)="handleClick($event)"
      [attr.aria-expanded]="isOpen"
      [attr.aria-controls]="'content-' + itemValue">
      <span class="trigger-text"><ng-content></ng-content></span>
      <svg 
        class="accordion-icon"
        [class.open]="isOpen"
        width="15" 
        height="15" 
        viewBox="0 0 15 15" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" 
          fill="currentColor" 
          fill-rule="evenodd" 
          clip-rule="evenodd">
        </path>
      </svg>
    </button>
  `,
  styles: [`
    .accordion-trigger {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      font-size: 0.875rem;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.9);
      transition: background-color 0.2s ease;
      position: relative;
      z-index: 1;
    }

    .accordion-trigger:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }

    .trigger-text {
      flex: 1;
    }

    .accordion-icon {
      width: 1rem;
      height: 1rem;
      transition: transform 0.2s ease;
      color: rgba(0, 0, 0, 0.5);
      flex-shrink: 0;
      margin-left: 0.5rem;
    }

    .accordion-icon.open {
      transform: rotate(180deg);
    }
  `],
  standalone: false
})
export class AccordionTriggerComponent {
  @Input() itemValue: string = '';
  isOpen: boolean = false;
  private item?: AccordionItemComponent;

  setItem(item: AccordionItemComponent): void {
    this.item = item;
    this.itemValue = item.value;
    this.isOpen = item.isOpen;
  }

  updateState(open: boolean): void {
    this.isOpen = open;
  }

  handleClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.item && this.item.value) {
      this.item.toggle();
    }
  }
}
