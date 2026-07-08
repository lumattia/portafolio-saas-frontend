import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { PublishedService } from '../../../../core/services/published.service';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { PublishedSectionRendererComponent } from '../../components/published-section-renderer/published-section-renderer.component';
import { PageRenderer } from '../../../../core/models/page.model';

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [PublishedSectionRendererComponent
  ],
  templateUrl: './portfolio-page.component.html',
  styleUrl: './portfolio-page.component.css',
})
export class PortfolioPageComponent implements OnInit {
  private readonly publishedService = inject(PublishedService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly pageContent = signal<PageRenderer | null>(null);

  ngOnInit(): void {
    this.loadPublishedContent();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadPublishedContent();
    });
  }

  private loadPublishedContent(): void {
    const slug = this.route.snapshot.url.join('/');
    this.publishedService.get(slug || undefined).subscribe({
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
