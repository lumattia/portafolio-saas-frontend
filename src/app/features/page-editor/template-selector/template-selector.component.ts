import { Component, inject, signal, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionTemplateService } from '../../../core/services/section-template.service';
import { SectionTemplateDto } from '../../../core/models/section-template.model';
import { hasNext, hasPrevious, IdName, PagedList } from '../../../core/models/common.models';
import { SelectInputComponent } from '../../../shared/components/inputs/select-input/select-input.component';
import { TextInputComponent } from "../../../shared/components/inputs/text-input/text-input.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SectionRenderer } from '../../../core/models/page.model';

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [CommonModule, SelectInputComponent, TextInputComponent, ButtonComponent],
  templateUrl: './template-selector.component.html',
  styleUrls: ['./template-selector.component.scss'],
})
export class TemplateSelectorComponent implements OnInit {
  private readonly sectionTemplateService = inject(SectionTemplateService);

  close!: (result?: SectionRenderer) => void;
  dismiss!: (reason?: any) => void;

  readonly searchQuery = signal('');
  readonly selectedCategory = signal<number | null>(null);
  readonly currentPage = signal(1);
  readonly pageSize = signal(12);

  readonly templates = signal<PagedList<SectionTemplateDto> | null>(null);
  readonly isLoading = signal(false);
  readonly categoryOptions = signal<IdName[]>([]);

  // 1. Refactorizado a Signal Input (100% reactivo)
  readonly parentSectionId = input<string | undefined>(undefined);

  hasPrevious(): boolean {
    return hasPrevious(this.templates());
  }

  hasNext(): boolean {
    return hasNext(this.templates());
  }

  ngOnInit(): void {
    this.loadTemplates();
    this.loadCategoryOption();
  }

  loadCategoryOption(): void {
    this.sectionTemplateService.getCategoryTags().subscribe({
      next: (data) => this.categoryOptions.set(data),
      error: (err) => console.error('Failed to load category options', err),
    });
  }

  loadTemplates(): void {
    this.isLoading.set(true);
    this.sectionTemplateService
      .getAll(
        {
          name: this.searchQuery() || undefined,
          categoryTags: this.selectedCategory() !== null ? this.selectedCategory()?.toString() : undefined,
        },
        {
          pageIndex: this.currentPage(),
          pageSize: this.pageSize(),
        }
      )
      .subscribe({
        next: (data) => {
          this.templates.set(data);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
    this.loadTemplates();
  }

  onCategoryChange(category: number): void {
    this.selectedCategory.set(category);
    this.loadTemplates();
  }

  onNextPage(): void {
    if (this.hasNext()) {
      this.currentPage.update((page) => page + 1);
      this.loadTemplates();
    }
  }

  onPreviousPage(): void {
    if (this.hasPrevious()) {
      this.currentPage.update((page) => page - 1);
      this.loadTemplates();
    }
  }

  selectTemplate(template: SectionTemplateDto): void {
    const newSection: SectionRenderer = {
      id: crypto.randomUUID(),
      sectionTemplateId: template.id,
      componentSelector: template.componentSelector,
      contentJson: template.defaultContentJson,
      isEnabled: true,
      isDeleted: false,
      isPublished: false,
      parentSectionId: this.parentSectionId(),
      subSections: [],
    };
    this.close(newSection);
  }
}
