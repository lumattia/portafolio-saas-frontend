import { Component, inject, computed, input, signal, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { PageEditorService } from '../../../core/services/page-editor.service';
import { PageService } from '../../../core/services/page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionRendererComponent } from '../section-renderer/section-renderer.component';
import { TemplateSelectorComponent } from '../template-selector/template-selector.component';
import { SectionEditorComponent } from '../section-editor/section-editor.component';
import { SectionTreeComponent } from '../section-tree/section-tree.component';
import { PageDetailDto, PageRequest } from '../../../core/models/page.model';
import { SectionDto } from '../../../core/models/section.model';

@Component({
  selector: 'app-page-editor',
  standalone: true,
  imports: [CommonModule, SectionRendererComponent, TemplateSelectorComponent, SectionEditorComponent, SectionTreeComponent],
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.scss'],
})
export class PageEditorComponent implements OnInit {
  private readonly pageEditorService = inject(PageEditorService);
  private readonly pageService = inject(PageService);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);

  readonly editorState = this.pageEditorService.editorState;
  readonly sections = computed(() => this.editorState().sections.sort((a, b) => a.order - b.order));
  readonly isTemplateSelectorOpen = computed(() => this.editorState().isTemplateSelectorOpen);
  readonly isEditorOpen = computed(() => this.editorState().isEditorOpen);
  readonly expandedSections = computed(() => new Set<string>());

  readonly pageTitle = signal<string>('');
  readonly pageSlug = signal<string>('');
  readonly internalPageId = signal<string>('');
  readonly pageNotFound = signal<boolean>(false);
  readonly pageIsDeleted = signal<boolean>(false);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loadPage()
  }

  private loadPage(): void {
    const slug = this.route.snapshot.url.join('/');
    this.pageService.getByIdentifier(slug).subscribe({
      next: (detail: PageDetailDto) => {
        if (detail === null) {
          this.pageNotFound.set(true);
          this.pageSlug.set(slug);
          this.loading.set(false);
          return;
        }
        this.location.replaceState(`${detail.slug}`);
        this.pageSlug.set(detail.slug);
        this.pageTitle.set(detail.title);
        this.internalPageId.set(detail.id);
        this.pageIsDeleted.set(detail.isDeleted);
        this.pageNotFound.set(false);
        this.pageEditorService.loadSections(detail.sections);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load page content', err);
        this.loading.set(false);
      },
    });
  }

  createPage(): void {
    const slug = this.pageSlug();
    const request: PageRequest = {
      title: slug,
      slug: slug,
      metaDescription: ''
    };
    this.pageService.create(request).subscribe({
      next: (page) => {
        this.internalPageId.set(page.id);
        this.pageNotFound.set(false);
        this.location.replaceState(`/${page.slug}`);
        this.loadPage();
      },
      error: (err: any) => {
        console.error('Failed to create page', err);
      }
    });
  }

  undoDelete(): void {
    const slug = this.pageSlug();
    const request: PageRequest = {
      title: this.pageTitle(),
      slug: slug,
      metaDescription: '',
      sections: undefined
    };
    this.pageService.update(this.internalPageId(), request).subscribe({
      next: () => {
        this.pageIsDeleted.set(false);
      },
      error: (err: any) => {
        console.error('Failed to undo delete', err);
      }
    });
  }

  openTemplateSelector(): void {
    this.pageEditorService.openTemplateSelector();
  }

  selectSection(section: SectionDto): void {
    this.pageEditorService.selectSection(section);
  }

  closeTemplateSelector(): void {
    this.pageEditorService.closeTemplateSelector();
  }

  closeEditor(): void {
    this.pageEditorService.deselectSection();
  }

  savePage(): void {
    this.loading.set(true)
    const sections = this.pageEditorService.getSectionsForSave();
    const id = this.internalPageId();

    if (!id) return;

    this.pageService.update(id, {
      title: this.pageTitle(),
      slug: this.pageSlug(),
      metaDescription: '',
      sections: sections
    }).subscribe({
      next: (detail) => {
        this.location.replaceState(`${detail.slug}`);
        this.pageSlug.set(detail.slug);
        this.pageTitle.set(detail.title);
        this.internalPageId.set(detail.id);
        this.pageIsDeleted.set(detail.isDeleted);
        this.pageNotFound.set(false);
        this.pageEditorService.loadSections(detail.sections);
        this.loading.set(false);
      },
      error: (err: any) => this.loading.set(false)
    });
  }

  publishPage(): void {
    this.loading.set(true)
    const sections = this.pageEditorService.getSectionsForSave();
    const id = this.internalPageId();

    if (!id) return;

    // First save with sections, then publish
    this.pageService.update(id, {
      title: this.pageTitle(),
      slug: this.pageSlug(),
      metaDescription: '',
      sections: sections
    }).subscribe({
      next: () => {
        this.pageService.publish(id).subscribe({
          next: () => this.loading.set(false),
          error: (err: any) => this.loading.set(false)
        });
      },
      error: (err: any) => this.loading.set(false)
    });
  }
}
