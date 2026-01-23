import { Component, Input, ContentChild, AfterContentInit, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { AccordionTriggerComponent } from './accordion-trigger.component';
import { AccordionContentComponent } from './accordion-content.component';
import { AccordionComponent } from './accordion.component';

@Component({
  selector: 'app-accordion-item',
  template: `
    <div class="accordion-item" [class.open]="isOpen">
      <ng-content select="app-accordion-trigger"></ng-content>
      <ng-content select="app-accordion-content"></ng-content>
    </div>
  `,
  styles: [`
    .accordion-item {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .accordion-item:last-child {
      border-bottom: none;
    }
  `],
  standalone: false
})
export class AccordionItemComponent implements AfterContentInit, OnChanges {
  @Input() value: string = '';
  @ContentChild(AccordionTriggerComponent) trigger?: AccordionTriggerComponent;
  @ContentChild(AccordionContentComponent) content?: AccordionContentComponent;
  
  isOpen: boolean = false;
  private parent?: AccordionComponent;

  constructor(private cdr: ChangeDetectorRef) {
    // Ensure value is set
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update trigger and content when value changes
    if (changes['value'] && this.value) {
      if (this.trigger) {
        this.trigger.itemValue = this.value;
      }
      if (this.content) {
        this.content.itemValue = this.value;
      }
    }
  }

  ngAfterContentInit(): void {
    // Initialize trigger and content immediately
    // The value should be set by now via @Input binding
    if (this.trigger) {
      this.trigger.setItem(this);
    }
    if (this.content) {
      this.content.setItem(this);
    }
    
    // Also update after a tick to ensure value is set
    setTimeout(() => {
      if (this.trigger && this.value) {
        this.trigger.itemValue = this.value;
      }
      if (this.content && this.value) {
        this.content.itemValue = this.value;
      }
    }, 0);
  }

  setParent(parent: AccordionComponent): void {
    this.parent = parent;
  }

  toggle(): void {
    if (this.parent && this.value) {
      this.parent.toggleItem(this.value);
    }
  }


  updateState(): void {
    if (this.trigger) {
      this.trigger.updateState(this.isOpen);
    }
    if (this.content) {
      this.content.updateState(this.isOpen);
    }
    this.cdr.detectChanges();
  }
}
