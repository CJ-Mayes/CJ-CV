import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, ElementRef, ViewChild} from '@angular/core';
import { WindowState, LifeMomentCard, FileTreeItem, ScrollTransform } from './models/window-state.interface';
import { LIFE_MOMENTS_CARDS } from './constants/life-moments.constants';
import { FILE_TREE_DATA } from './constants/file-tree.constants';
import { WINDOW_CONSTANTS, PORTFOLIO_CONSTANTS, NAV_TABS_ORDER, SECTION_ICONS } from './constants/about.constants';

declare var data: any;

interface NavTab {
  id: string;
  name: string;
  placement: string;
}

interface PortfolioProject {
  project: string;
  description: string;
  link?: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./about.component.css'],
  standalone: false
})
export class AboutComponent implements OnInit, AfterViewInit {
  public aboutData = data["About"];
  public portfolioData: PortfolioProject[] = data["About"]["Portfolio"];
  public activeTab = "portfolio";
  public activeTab2 = "story";
  public sidebarOpen = true;
  public selector: any;
  public activeElements: any = {};
  
  // Window management - using array instead of separate properties
  public windows: WindowState[] = [
    { isDragging: false, dragOffset: { x: 0, y: 0 }, position: { x: 0, y: 0 }, zIndex: WINDOW_CONSTANTS.INITIAL_Z_INDEX[0], scrollTransform: { y: 0, scale: 1, opacity: 1 }, transform: 'translate(0px, 0px) scale(1)', bgOpacity: 1 },
    { isDragging: false, dragOffset: { x: 0, y: 0 }, position: { x: 0, y: 0 }, zIndex: WINDOW_CONSTANTS.INITIAL_Z_INDEX[1], scrollTransform: { y: 0, scale: 1, opacity: 1 }, transform: 'translate(0px, 0px) scale(1)', bgOpacity: 1 },
    { isDragging: false, dragOffset: { x: 0, y: 0 }, position: { x: 0, y: 0 }, zIndex: WINDOW_CONSTANTS.INITIAL_Z_INDEX[2], scrollTransform: { y: 0, scale: 1, opacity: 1 }, transform: 'translate(0px, 0px) scale(1)', bgOpacity: 1 }
  ];
  
  @ViewChild('cursorWindow', { static: false }) cursorWindowRef!: ElementRef;
  @ViewChild('cursorWindow2', { static: false }) cursorWindow2Ref!: ElementRef;
  @ViewChild('cursorWindow3', { static: false }) cursorWindow3Ref!: ElementRef;
  @ViewChild('aboutSection', { static: false }) aboutSectionRef!: ElementRef;
  @ViewChild('aboutSideText', { static: false }) aboutSideTextRef!: ElementRef;
  @ViewChild('gallery', { static: false }) galleryRef!: ElementRef;

  // Scroll animation properties
  public scrollTransform: ScrollTransform = { y: 0, opacity: 1 };

  // Experience and file tree accordion state
  public expandedExperiences: { [key: number]: boolean } = {};
  public expandedTreeItems: { [key: string]: boolean } = {};

  // Life moments and file tree data
  public lifeMomentsCards: LifeMomentCard[] = LIFE_MOMENTS_CARDS;
  public fileTree: FileTreeItem[] = FILE_TREE_DATA;

  // Getters for template compatibility
  public get window1Transform(): string { return this.windows[0].transform; }
  public get window2Transform(): string { return this.windows[1].transform; }
  public get window3Transform(): string { return this.windows[2].transform; }
  public get window1BgOpacity(): number { return this.windows[0].bgOpacity; }
  public get window2BgOpacity(): number { return this.windows[1].bgOpacity; }
  public get window3BgOpacity(): number { return this.windows[2].bgOpacity; }
  public get windowZIndex(): number { return this.windows[0].zIndex; }
  public get windowZIndex2(): number { return this.windows[1].zIndex; }
  public get windowZIndex3(): number { return this.windows[2].zIndex; }
  public get windowScrollTransform() { return this.windows[0].scrollTransform; }
  public get window2ScrollTransform() { return this.windows[1].scrollTransform; }
  public get window3ScrollTransform() { return this.windows[2].scrollTransform; }
  public get isDragging(): boolean { return this.windows[0].isDragging; }
  public get isDragging2(): boolean { return this.windows[1].isDragging; }
  public get isDragging3(): boolean { return this.windows[2].isDragging; }

  constructor(public changeDetectorRef: ChangeDetectorRef, private elementRef: ElementRef) {
    changeDetectorRef.detach();
  }

  ngOnInit(): void {
    this.initializeTreeExpandedState(this.fileTree);
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.changeActiveTab('portfolio');
    this.changeActiveTab2(this.activeTab2);
    this.initScrollAnimation();
    this.initializeWindowPositions();
  }

  // Filter and reorder NavTabs: Portfolio, Experience, Skill (exclude story)
  public get filteredNavTabs(): NavTab[] {
    if (!this.aboutData || !this.aboutData['NavTabs']) return [];
    const tabs = this.aboutData['NavTabs'].filter((tab: NavTab) => tab.id !== 'story');
    return tabs.sort((a: NavTab, b: NavTab) => {
      const indexA = NAV_TABS_ORDER.indexOf(a.id);
      const indexB = NAV_TABS_ORDER.indexOf(b.id);
      return indexA - indexB;
    });
  }

  // Initialize window positions
  private initializeWindowPositions(): void {
    setTimeout(() => {
      const windowElement = this.cursorWindowRef?.nativeElement;
      const columnContainer = windowElement?.parentElement;
      
      if (windowElement && columnContainer) {
        const containerRect = columnContainer.getBoundingClientRect();
        const windowRect = windowElement.getBoundingClientRect();
        
        // Window 1 - centered
        this.windows[0].position = {
          x: (containerRect.width - windowRect.width) / 2,
          y: WINDOW_CONSTANTS.POSITION.INITIAL_Y
        };
        
        // Window 2 - offset to the right
        const windowElement2 = this.cursorWindow2Ref?.nativeElement;
        if (windowElement2) {
          this.windows[1].position = {
            x: this.windows[0].position.x + (windowRect.width * WINDOW_CONSTANTS.POSITION.WINDOW_2_OFFSET_X),
            y: this.windows[0].position.y + (windowRect.height * WINDOW_CONSTANTS.POSITION.WINDOW_2_OFFSET_Y)
          };
        }
        
        // Window 3 - bottom left
        const windowElement3 = this.cursorWindow3Ref?.nativeElement;
        if (windowElement3) {
          const window3Rect = windowElement3.getBoundingClientRect();
          this.windows[2].position = {
            x: window3Rect.width * WINDOW_CONSTANTS.POSITION.WINDOW_3_OFFSET_X,
            y: containerRect.height - window3Rect.height + WINDOW_CONSTANTS.POSITION.WINDOW_3_OFFSET_Y
          };
        }
        
        this.updateWindowTransforms();
        this.changeDetectorRef.detectChanges();
      }
    }, WINDOW_CONSTANTS.DRAG.INITIALIZATION_DELAY);
  }

  public changeActiveTab(tab: string): void {
    this.activeTab = tab;
    this.changeDetectorRef.detectChanges();
  }
  
  public changeActiveTab2(tab: string): void {
    this.activeTab2 = tab;
    this.changeDetectorRef.detectChanges();
  }

  // Template-compatible methods
  public onHeaderMouseDown(event: MouseEvent): void { 
    this.handleHeaderMouseDown(0, event); 
  }
  
  public onHeaderMouseDown2(event: MouseEvent): void { 
    this.handleHeaderMouseDown(1, event); 
  }
  
  public onHeaderMouseDown3(event: MouseEvent): void { 
    this.handleHeaderMouseDown(2, event); 
  }
  
  // Helper to get coordinates from mouse or touch event
  private getEventCoordinates(event: MouseEvent | TouchEvent): { x: number; y: number } {
    if (event instanceof TouchEvent) {
      const touch = event.touches[0] || event.changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    return { x: event.clientX, y: event.clientY };
  }

  // Internal unified handler for mouse events
  private handleHeaderMouseDown(windowIndex: 0 | 1 | 2, event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('.window-controls') || target.closest('.window-actions')) {
      return;
    }

    this.bringToFront(windowIndex + 1 as 1 | 2 | 3, event);
    
    this.windows[windowIndex].isDragging = true;
    const windowElement = this.getWindowElement(windowIndex);
    
    if (windowElement) {
      const columnContainer = windowElement.parentElement;
      const containerRect = columnContainer?.getBoundingClientRect();
      
      if (containerRect) {
        const coords = this.getEventCoordinates(event);
        this.windows[windowIndex].dragOffset = {
          x: coords.x - containerRect.left - this.windows[windowIndex].position.x,
          y: coords.y - containerRect.top - this.windows[windowIndex].position.y
        };
      }
    }
    
    event.preventDefault();
  }

  // Touch event handlers
  public onHeaderTouchStart(windowIndex: 0 | 1 | 2, event: TouchEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('.window-controls') || target.closest('.window-actions')) {
      return;
    }

    // Convert touch event to work with bringToFront (which expects MouseEvent)
    const fakeMouseEvent = { target: event.target } as MouseEvent;
    this.bringToFront(windowIndex + 1 as 1 | 2 | 3, fakeMouseEvent);
    
    this.windows[windowIndex].isDragging = true;
    const windowElement = this.getWindowElement(windowIndex);
    
    if (windowElement) {
      const columnContainer = windowElement.parentElement;
      const containerRect = columnContainer?.getBoundingClientRect();
      
      if (containerRect) {
        const coords = this.getEventCoordinates(event);
        this.windows[windowIndex].dragOffset = {
          x: coords.x - containerRect.left - this.windows[windowIndex].position.x,
          y: coords.y - containerRect.top - this.windows[windowIndex].position.y
        };
      }
    }
    
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    for (let i = 0; i < this.windows.length; i++) {
      if (this.windows[i].isDragging) {
        this.handleWindowDrag(i, event);
      }
    }
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    for (let i = 0; i < this.windows.length; i++) {
      if (this.windows[i].isDragging) {
        this.handleWindowDrag(i, event);
        event.preventDefault(); // Prevent scrolling while dragging
      }
    }
  }

  private handleWindowDrag(windowIndex: number, event: MouseEvent | TouchEvent): void {
    const windowElement = this.getWindowElement(windowIndex);
    if (!windowElement) return;

    const columnContainer = windowElement.parentElement;
    const containerRect = columnContainer?.getBoundingClientRect();
    const windowRect = windowElement.getBoundingClientRect();
    
    if (!containerRect) return;

    const scale = windowIndex === 1 ? WINDOW_CONSTANTS.SCALE.WINDOW_2 : 1;
    const actualWidth = windowRect.width / scale;
    const actualHeight = windowRect.height / scale;
    
    const coords = this.getEventCoordinates(event);
    let newX = coords.x - containerRect.left - this.windows[windowIndex].dragOffset.x;
    let newY = coords.y - containerRect.top - this.windows[windowIndex].dragOffset.y;
    
    const maxY = containerRect.height - actualHeight * scale;
    const minX = -actualWidth * scale * WINDOW_CONSTANTS.DRAG.HORIZONTAL_OVERFLOW;
    const maxX = containerRect.width - actualWidth * scale * WINDOW_CONSTANTS.DRAG.HORIZONTAL_OVERFLOW;
    
    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    this.windows[windowIndex].position = { x: newX, y: newY };
    this.updateWindowTransforms();
    this.changeDetectorRef.detectChanges();
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    this.windows.forEach(window => window.isDragging = false);
  }

  @HostListener('document:touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.windows.forEach(window => window.isDragging = false);
  }

  private getWindowElement(windowIndex: number): HTMLElement | null {
    const refs = [this.cursorWindowRef, this.cursorWindow2Ref, this.cursorWindow3Ref];
    return refs[windowIndex]?.nativeElement || null;
  }

  // Bring window to foreground
  public bringToFront(windowNumber: 1 | 2 | 3, event?: MouseEvent | TouchEvent): void {
    const windowIndex = windowNumber - 1;
    
    if (this.windows[windowIndex].isDragging) return;
    
    if (event) {
      const target = event.target as HTMLElement;
      if (target.closest('.window-controls') || target.closest('.window-actions')) {
        return;
      }
    }
    
    const maxZIndex = Math.max(...this.windows.map(w => w.zIndex));
    this.windows[windowIndex].zIndex = maxZIndex + 1;
    
    // Set background opacity: 1 for foreground window, 0 for others
    const foregroundZIndex = Math.max(...this.windows.map(w => w.zIndex));
    this.windows.forEach((window, index) => {
      window.bgOpacity = window.zIndex === foregroundZIndex ? 1 : 0;
    });
    
    this.changeDetectorRef.detectChanges();
  }

  // Sidebar handlers
  onSidebarMouseEnter(): void {
    this.sidebarOpen = true;
    this.changeDetectorRef.detectChanges();
  }

  onSidebarMouseLeave(): void {
    this.sidebarOpen = false;
    this.changeDetectorRef.detectChanges();
  }

  // Get icon for each section
  getSectionIcon(sectionId: string): string {
    return SECTION_ICONS[sectionId] || 'fas fa-circle';
  }

  // Portfolio methods
  getFirstThreePortfolioItems(): PortfolioProject[] {
    return this.portfolioData.filter(project => 
      PORTFOLIO_CONSTANTS.ALLOWED_PROJECTS.includes(project.project)
    );
  }

  getPortfolioImagePath(projectName: string): string {
    const imageName = PORTFOLIO_CONSTANTS.IMAGE_MAP[projectName as keyof typeof PORTFOLIO_CONSTANTS.IMAGE_MAP];
    if (imageName) {
      return `${PORTFOLIO_CONSTANTS.IMAGE_BASE_PATH}${imageName}`;
    }
    return `${PORTFOLIO_CONSTANTS.IMAGE_BASE_PATH}${projectName}.webp`;
  }

  openPortfolioLink(url: string): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  // Helper method to replace dashes with spaces
  replaceDashes(text: string): string {
    return text.replace(/-/g, ' ');
  }

  // Experience accordion
  toggleExperience(index: number): void {
    const wasExpanded = this.expandedExperiences[index] === true;
    Object.keys(this.expandedExperiences).forEach(key => {
      this.expandedExperiences[parseInt(key)] = false;
    });
    this.expandedExperiences[index] = !wasExpanded;
    this.changeDetectorRef.detectChanges();
  }

  isExperienceExpanded(index: number): boolean {
    return this.expandedExperiences[index] === true;
  }

  // File tree methods
  initializeTreeExpandedState(items: FileTreeItem[]): void {
    items.forEach(item => {
      if (item.type === 'folder' && item.expanded) {
        this.expandedTreeItems[item.id] = true;
      }
      if (item.children) {
        this.initializeTreeExpandedState(item.children);
      }
    });
  }

  toggleTreeItem(itemId: string): void {
    this.expandedTreeItems[itemId] = !this.expandedTreeItems[itemId];
    this.changeDetectorRef.detectChanges();
  }

  isTreeItemExpanded(itemId: string): boolean {
    return this.expandedTreeItems[itemId] === true;
  }

  updateTreeItemExpanded(item: FileTreeItem, expanded: boolean): void {
    item.expanded = expanded;
    this.expandedTreeItems[item.id] = expanded;
    if (item.children) {
      item.children.forEach(child => {
        if (child.type === 'folder') {
          this.updateTreeItemExpanded(child, expanded);
        }
      });
    }
  }

  // Scroll animation
  initScrollAnimation(): void {
    this.updateScrollTransform();
  }

  updateScrollTransform(): void {
    if (!this.aboutSectionRef?.nativeElement) return;

    const rect = this.aboutSectionRef.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    
    const scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));
    
    // Apply parallax effect to left side text
    const textOffset = scrollProgress * WINDOW_CONSTANTS.SCROLL.TEXT_OFFSET_MULTIPLIER;
    const textOpacity = Math.max(0, Math.min(1, 1 - (scrollProgress * WINDOW_CONSTANTS.SCROLL.OPACITY_MULTIPLIER)));
    this.scrollTransform = { y: textOffset, opacity: textOpacity };

    // Apply scroll animation to windows
    const windowOffset = scrollProgress * WINDOW_CONSTANTS.SCROLL.WINDOW_OFFSET_MULTIPLIER;
    const windowScale = WINDOW_CONSTANTS.SCROLL.WINDOW_SCALE_MIN + (scrollProgress * WINDOW_CONSTANTS.SCROLL.WINDOW_SCALE_RANGE);
    const windowOpacity = 1;
    
    this.windows[0].scrollTransform = { y: windowOffset, scale: windowScale, opacity: windowOpacity };
    this.windows[1].scrollTransform = { 
      y: windowOffset * WINDOW_CONSTANTS.SCROLL.WINDOW_2_SPEED, 
      scale: windowScale * WINDOW_CONSTANTS.SCROLL.WINDOW_2_SCALE, 
      opacity: windowOpacity 
    };
    this.windows[2].scrollTransform = { 
      y: windowOffset * WINDOW_CONSTANTS.SCROLL.WINDOW_3_SPEED, 
      scale: windowScale * WINDOW_CONSTANTS.SCROLL.WINDOW_3_SCALE, 
      opacity: windowOpacity 
    };

    this.updateWindowTransforms();
    this.changeDetectorRef.detectChanges();
  }

  updateWindowTransforms(): void {
    this.windows.forEach((window, index) => {
      window.transform = `translate(${window.position.x}px, ${window.position.y + window.scrollTransform.y}px) scale(${window.scrollTransform.scale})`;
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.updateScrollTransform();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateScrollTransform();
  }
}
