import { Component, inject, computed, input, signal, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ViewContainerRef } from '@angular/core';
import { PageService } from '../../../core/services/page.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { SectionRendererComponent } from '../section-renderer/section-renderer.component';
import { SectionEditorComponent } from '../section-editor/section-editor.component';
import { PageRenderer, PageRequest, SectionRenderer, SectionRequest } from '../../../core/models/page.model';
import { ModalService } from '../../../core/services/modal.service';
import { TemplateSelectorComponent } from '../template-selector/template-selector.component';
import { SidenavService } from '../../../core/services/sidenav.service';
import { ConfirmModalComponent } from '../../../shared/components/modals/confirm-modal/confirm-modal.component';
import { filter } from 'rxjs/operators';
import { OverlayRef } from '../../../core/services/dynamic-overlay.service';

@Component({
  selector: 'app-page-editor',
  standalone: true,
  imports: [CommonModule, SectionRendererComponent],
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.scss'],
})
export class PageEditorComponent implements OnInit {
  private readonly pageService = inject(PageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly sidenavService = inject(SidenavService);
  private readonly modalService = inject(ModalService);

  sections = signal<SectionRenderer[]>([]);
  selectedSection: SectionRenderer | null = null;
  editorSidenavRef: OverlayRef<SectionEditorComponent> | null = null;
  readonly expandedSections = computed(() => new Set<string>());

  readonly pageTitle = signal<string>('');
  readonly pageSlug = signal<string>('');
  readonly internalPageId = signal<string>('');
  readonly pageNotFound = signal<boolean>(false);
  readonly pageIsDeleted = signal<boolean>(false);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loadPage();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadPage();
    });
  }

  private loadPage(): void {
    const slug = this.route.snapshot.url.join('/');
    this.pageService.getByIdentifier(slug).subscribe({
      next: (detail: PageRenderer) => {
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
        let newSection = res.data as SectionRenderer;
        this.sections.update((sections) => [...sections, newSection])
      };
    });
  }

  selectSection(section: SectionRenderer): void {
    this.selectedSection = section;
    this.editorSidenavRef = this.sidenavService.open(SectionEditorComponent, {
      section: section,
      onSetDeleteState: (isDelete: boolean) => this.setDeletedState(isDelete)
    });
    this.editorSidenavRef.result.then(() => {
      this.selectedSection = null;
    });
  }

  savePage(): void {
    this.loading.set(true)
    
    const sections: SectionRequest[] = this.getSectionsForSave();
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

  setDeletedState(isDelete: boolean): void {
    const section = this.selectedSection;
    if (!section) return;
    if (section.isPublished) {
      section.isDeleted = isDelete;
    this.editorSidenavRef?.close()
    }else{
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        title: 'Elimnar',
        message: 'Esta sección aún no ha sido publicada. Al eliminarla y guardar, se borrará definitivamente y no podrá recuperarse. ¿Deseas continuar?'
      });
      modalRef.result.then((res) => {
        if (res.confirmed) {
          this.sections.update(sections => sections.filter(s => s.id !== section.id));
          this.editorSidenavRef?.close()
        }
      })
    }
  }
  getSectionsForSave(): SectionRequest[]{
   const result: SectionRequest[] = [];

  const flatten = (sections: SectionRenderer[]) => {
    for (const s of sections) {
      const dto: SectionRequest = {
        id: s.id,
        sectionTemplateId: s.sectionTemplateId ?? undefined,
        contentJson: s.contentJson,
        isEnabled: s.isEnabled,
        isDeleted: s.isDeleted,
        parentSectionId: s.parentSectionId,
      };

      result.push(dto);

      if (s.subSections && s.subSections.length > 0) {
        flatten(s.subSections);
      }
    }
  };

  // Ejecutamos con tus secciones raíz
  flatten(this.sections());
  
  return result;
  }
}
