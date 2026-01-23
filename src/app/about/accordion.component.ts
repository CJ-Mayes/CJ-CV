import { Component, Input, ContentChildren, QueryList, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
  selector: 'app-accordion',
  template: `
    <div class="accordion" [class]="className">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .accordion {
      display: flex;
      flex-direction: column;
      gap: 0;
      width: 100%;
    }
  `],
  standalone: false
})
export class AccordionComponent implements AfterContentInit {
  @Input() defaultValue: string[] = [];
  @Input() className: string = '';
  @ContentChildren(AccordionItemComponent) items!: QueryList<AccordionItemComponent>;
  
  private openValues: Set<string> = new Set();

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    // Set default open items
    if (this.defaultValue.length > 0) {
      this.defaultValue.forEach(value => this.openValues.add(value));
    }
    
    // Initialize all items - use changes subscription to catch all items
    this.items.changes.subscribe(() => {
      this.items.forEach(item => {
        item.setParent(this);
        item.isOpen = this.openValues.has(item.value);
        item.updateState();
      });
      this.cdr.detectChanges();
    });
    
    // Also initialize immediately
    this.items.forEach(item => {
      item.setParent(this);
      item.isOpen = this.openValues.has(item.value);
      item.updateState();
    });
    
    this.cdr.detectChanges();
  }

  toggleItem(value: string): void {
    // Validate the value exists
    if (!value) {
      return;
    }
    
    // Find the clicked item to check if it was open
    const clickedItem = this.items.find(item => item.value === value);
    if (!clickedItem) {
      return;
    }
    
    const wasOpen = clickedItem.isOpen;
    
    // Always close all items first
    this.openValues.clear();
    
    // Toggle behavior: if it was closed, open it. If it was open, keep it closed (toggle off).
    if (!wasOpen) {
      this.openValues.add(value);
    }
    // If it was open, we don't add it back, so it stays closed
    
    // Update all items simultaneously
    this.items.forEach(item => {
      const wasItemOpen = item.isOpen;
      item.isOpen = this.openValues.has(item.value);
      // Always update state to ensure UI reflects the change
      item.updateState();
    });
    
    this.cdr.detectChanges();
  }
}
