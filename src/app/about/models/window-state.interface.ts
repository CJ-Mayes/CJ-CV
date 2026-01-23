import { ElementRef } from '@angular/core';

export interface WindowState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  position: { x: number; y: number };
  zIndex: number;
  scrollTransform: { y: number; scale: number; opacity: number };
  transform: string;
  bgOpacity: number;
  elementRef?: ElementRef;
}

export interface LifeMomentCard {
  frontTitle: string;
  frontContent: string;
  backTitle: string;
  backContent: string;
  frontImage: string;
}

export interface FileTreeItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  expanded?: boolean;
  link?: string;
  children?: FileTreeItem[];
}

export interface ScrollTransform {
  y: number;
  opacity: number;
}
