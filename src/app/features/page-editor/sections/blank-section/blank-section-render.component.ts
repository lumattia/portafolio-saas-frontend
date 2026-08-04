import { Component, inject, ElementRef, Renderer2, AfterViewInit, computed, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseSectionRendererComponent } from '../base-section-renderer.component';
import { BlankSectionContent, createDefaultBlankSectionContent } from './blank-section.model';
import { ViewModeService } from '../../../../core/services/view-mode.service';

@Component({
  selector: 'app-blank-section-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blank-section-render.component.html',
  styleUrls: ['./blank-section-render.component.scss'],
})
export class BlankSectionRenderComponent extends BaseSectionRendererComponent{
  private viewModeService = inject(ViewModeService);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  get content(): BlankSectionContent {
      return createDefaultBlankSectionContent(this.section().contentJson);
  }
  constructor() {
    super();
    effect(() => {
      this.section(); // Track the section signal
      this.updateParentFlexStyle();
    });
  }

  get isEditMode(): boolean {
    return this.viewModeService.isAdminMode();
  }


  @HostListener('window:blank-section-update', ['$event'])
  onBlankSectionUpdate(event: Event): void {
    const customEvent = event as CustomEvent;
    if (customEvent.detail?.sectionId === this.section().id) {
      this.updateParentFlexStyle();
    }
  }

  private updateParentFlexStyle(): void {
    const parentElement = this.elementRef.nativeElement.parentElement;
    if (parentElement && parentElement.classList.contains('section-renderer')) {
      // Read directly from section().contentJson to get the latest values
      const width = this.content.styles.width;
      const height = this.content.styles.height;

      // Apply width to parent if it's a percentage
      if (width.unit === 'auto') {
        this.renderer.setStyle(parentElement, 'width', 'auto');
      } else {
        this.renderer.setStyle(parentElement, 'width', `${width.value}${width.unit}`);
      }

      // Apply height to parent
      if (height.unit === 'auto') {
        this.renderer.setStyle(parentElement, 'height', 'auto');
      } else {
        this.renderer.setStyle(parentElement, 'height', `${height.value}${height.unit}`);
      }
    }
  }
}
