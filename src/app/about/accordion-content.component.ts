import { Component, Input } from '@angular/core';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
  selector: 'app-accordion-content',
  template: `
    <div 
      class="accordion-content"
      [class.open]="isOpen"
      [id]="'content-' + itemValue"
      [attr.aria-hidden]="!isOpen">
      <div class="accordion-content-inner">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out, padding 0.3s ease-out;
      padding: 0 1rem;
    }

    .accordion-content.open {
      max-height: 2000px;
      padding: 0 1rem 1rem 1rem;
    }

    .accordion-content-inner {
      padding-top: 0.5rem;
      color: rgba(0, 0, 0, 0.7);
      font-size: 0.875rem;
      line-height: 1.6;
    }
  `],
  standalone: false
})
export class AccordionContentComponent {
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
}
