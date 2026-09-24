import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SectionRendererComponent } from '../../../page-editor/section-renderer/section-renderer.component';
import { PageRenderer } from '../../../../core/models/page.model';
import { PageService } from '../../../../core/services/page.service';

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [SectionRendererComponent],
  templateUrl: './portfolio-page.component.html',
  styleUrl: './portfolio-page.component.scss',
})
export class PortfolioPageComponent implements OnInit {
  private readonly pageService = inject(PageService);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly pageContent = signal<PageRenderer | null>(null);

  ngOnInit(): void {
    this.loadPublishedContent();
    this.route.url.subscribe(() => {
      this.loadPublishedContent();
    });
  }

  private loadPublishedContent(): void {
    const slug = this.route.snapshot.url.join('/');
    this.pageService.getByIdentifier(slug).subscribe({
      next: (snapshot) => {
        this.pageContent.set(snapshot);
        this.location.replaceState(`${snapshot.slug}`);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load portfolio content');
        this.loading.set(false);
      },
    });
  }
}
