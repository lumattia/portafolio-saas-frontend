import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEditorService } from '../../../core/services/page-editor.service';
import { SectionTemplateService } from '../../../core/services/section-template.service';
import {
  SectionTemplateDto,
} from '../../../core/models/section-template.model';
import { IdName, PagedList } from '../../../core/models/common.models';
import { SelectInputComponent } from '../../../shared/components/inputs/select-input/select-input.component';

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [CommonModule, SelectInputComponent],
  templateUrl: './template-selector.component.html',
  styleUrls: ['./template-selector.component.scss'],
})
export class TemplateSelectorComponent implements OnInit {
  private readonly pageEditorService = inject(PageEditorService);
  private readonly sectionTemplateService = inject(SectionTemplateService);

  readonly searchQuery = signal('');
  readonly selectedCategory = signal<number|null>(null);
  readonly currentPage = signal(1);
  readonly pageSize = signal(12);

  readonly templates = signal<PagedList<SectionTemplateDto> | null>(null);
  readonly isLoading = signal(false);

  readonly categoryOptions = signal<IdName[]>([]);

  ngOnInit(): void {
    this.loadTemplates();
    this.loadCategoryOption();
  }
  loadCategoryOption(): void{
    this.sectionTemplateService.getCategoryTags().subscribe({
      next: (data) => {
        this.categoryOptions.set(data);
      },
      error: (err) => {
        console.error('Failed to load category options', err);
      }
    });
  }
  loadTemplates(): void {
    this.isLoading.set(true);
    this.sectionTemplateService
      .getAll(
        {
          name: this.searchQuery() || undefined,
          categoryTags:
            this.selectedCategory() !== null
              ? this.selectedCategory()?.toString()
              : undefined,
        },
        {
          pageIndex: this.currentPage(),
          pageSize: this.pageSize(),
          isDescending: false,
        }
      )
      .subscribe({
        next: (data) => {
          this.templates.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
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
    if (this.templates()?.hasNext) {
      this.currentPage.update((page) => page + 1);
      this.loadTemplates();
    }
  }

  onPreviousPage(): void {
    if (this.templates()?.hasPrevious) {
      this.currentPage.update((page) => page - 1);
      this.loadTemplates();
    }
  }

  selectTemplate(template: SectionTemplateDto): void {
    this.pageEditorService.addSection(template.id);
  }

  close(): void {
    this.pageEditorService.closeTemplateSelector();
  }
}
