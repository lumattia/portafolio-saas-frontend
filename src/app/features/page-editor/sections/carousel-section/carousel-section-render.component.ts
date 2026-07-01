import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselSectionContent, createDefaultCarouselSectionContent } from './carousel-section.model';
import { SectionDto } from '../../../../core/models/section.model';
import { RENDER_COMPONENT_MAP } from '../../../../core/constants/component-maps';

@Component({
  selector: 'app-carousel-section-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel-section-render.component.html',
  styleUrls: ['./carousel-section-render.component.scss'],
})
export class CarouselSectionRenderComponent {
  section = input.required<SectionDto>();
  subSections = computed(() => this.section().subSections || []);

  readonly currentIndex = signal(0);

  readonly componentMap = RENDER_COMPONENT_MAP;

  get content(): CarouselSectionContent {
    return createDefaultCarouselSectionContent(this.section()!.contentJson);
  }

  get slides(): SectionDto[] {
    return this.subSections() || [];
  }

  get currentSlide(): SectionDto | null {
    return this.slides[this.currentIndex()] || null;
  }

  nextSlide(): void {
    event?.stopPropagation();
    if (this.currentIndex() < this.slides.length - 1) {
      this.currentIndex.update((i) => i + 1);
    } else {
      this.currentIndex.set(0);
    }
  }

  previousSlide(): void {
    event?.stopPropagation();
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    } else {
      this.currentIndex.set(this.slides.length - 1);
    }
  }

  goToSlide(index: number): void {
    event?.stopPropagation();
    this.currentIndex.set(index);
  }
}
