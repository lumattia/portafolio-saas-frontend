import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { catchError, merge, of, switchMap, tap } from 'rxjs';
import { SectionRendererComponent } from '../../../page-editor/section-renderer/section-renderer.component';
import { PageRenderer } from '../../../../core/models/page.model';
import { SnapshotContentService } from '../../../../core/services/snapshot-content.service';
import { ViewModeService } from '../../../../core/services/view-mode.service';

@Component({
  selector: 'app-snapshot-page',
  standalone: true,
  imports: [SectionRendererComponent],
  templateUrl: './snapshot-page.component.html',
  styleUrl: './snapshot-page.component.scss',
})
export class SnapshotPageComponent implements OnInit {
  private readonly contentService = inject(SnapshotContentService);
  private readonly viewMode = inject(ViewModeService);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly versionChanges$ = toObservable(this.viewMode.snapshotVersion);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly pageContent = signal<PageRenderer | null>(null);

  ngOnInit(): void {
    merge(
      this.route.url,
      this.versionChanges$
    ).pipe(
      switchMap(() => {
        const slug = this.route.snapshot.url.join('/');
        return this.contentService.getPage(slug, this.viewMode.snapshotVersion()).pipe(
          tap((snapshot) => {
            this.pageContent.set(snapshot);
            this.location.replaceState(`${snapshot.slug}`);
          }),
          catchError(() => {
            this.error.set('Failed to load snapshot content');
            return of(null);
          })
        );
      })
    ).subscribe(() => this.loading.set(false));
  }
}
