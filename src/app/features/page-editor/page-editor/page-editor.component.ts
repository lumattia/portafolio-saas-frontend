import { Component, inject, computed, input, signal, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ViewContainerRef } from '@angular/core';
import { PageService } from '../../../core/services/page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionRendererComponent } from '../section-renderer/section-renderer.component';
import { SectionEditorComponent } from '../section-editor/section-editor.component';
import { SectionTreeComponent } from '../section-tree/section-tree.component';
import { PageDetailDto, PageRequest } from '../../../core/models/page.model';
import { SectionDto } from '../../../core/models/section.model';
import { ModalService } from '../../../core/services/modal.service';
import { TemplateSelectorComponent } from '../template-selector/template-selector.component';
import { SidenavService } from '../../../core/services/sidenav.service';
import { GenericErrorModalComponent } from '../../../shared/components/modals/generic-error-modal/generic-error-modal.component';
import { ConfirmModalComponent } from '../../../shared/components/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-page-editor',
  standalone: true,
  imports: [CommonModule, SectionRendererComponent, SectionEditorComponent, SectionTreeComponent],
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.scss'],
})
export class PageEditorComponent implements OnInit {
  private readonly pageService = inject(PageService);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly sidenavService = inject(SidenavService);
  private readonly modalService = inject(ModalService);

  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer!: ViewContainerRef;

  sections = signal<SectionDto[]>([]);
  isEditorOpen = signal<boolean>(false)
  selectedSection: SectionDto | null = null;
  readonly expandedSections = computed(() => new Set<string>());

  readonly pageTitle = signal<string>('');
  readonly pageSlug = signal<string>('');
  readonly internalPageId = signal<string>('');
  readonly pageNotFound = signal<boolean>(false);
  readonly pageIsDeleted = signal<boolean>(false);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loadPage();
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
        this.sections.set(detail.sections);
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
    var sidenavRef = this.sidenavService.open(TemplateSelectorComponent);
    sidenavRef.result.then((res) => {
      if (res.confirmed && res.data) {
        let newSection = res.data as SectionDto;
        newSection.order=this.sections().length;
        this.sections.update((sections) => [...sections, newSection])
      };
    });
  }

  selectSection(section: SectionDto): void {
    this.selectedSection = section;
  }

  closeEditor(): void {
    this.selectedSection = null;
  }

  savePage(): void {
    this.loading.set(true)
    
    const sections: SectionDto[] = this.getSectionsForSave();
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
        this.sections.set(detail.sections);
        this.loading.set(false);
      },
      error: (err: any) => this.loading.set(false)
    });
  }

  publishPage(): void {
    this.loading.set(true)
    const sections = this.getSectionsForSave();
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
  setDeletedState(isDelete: boolean): void {
    const section = this.selectedSection;
    if (!section) return;
    if (section.isPublished) {
      section.isDeleted = isDelete;
    this.selectedSection = null;
    }else{
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        title: 'Elimnar',
        message: 'No es una sección publicada, esa acción eliminar la seccion permanentemente y no podrá ser deshecha.'
      });
      modalRef.result.then((res) => {
        if (res.confirmed) {
          this.sections.update(sections => sections.filter(s => s.id !== section.id));
          this.selectedSection = null;
        }
      })
    }
  }
  getSectionsForSave(): SectionDto[]{
    return this.sections().map((s) => ({
      id: s.id,
      sectionTemplateId: s.sectionTemplateId,
      componentSelector: "", // used on get, not for save
      contentJson: s.contentJson,
      order: s.order,
      isEnabled: s.isEnabled,
      isDeleted: s.isDeleted,
      isPublished: s.isPublished,
      parentSectionId: s.parentSectionId,
      subSections: s.subSections,
    }));
  }
}
