import { Component, inject } from '@angular/core';
import { ViewModeService } from '../../core/services/view-mode.service';
import { PortfolioPageComponent } from '../portfolio/pages/portfolio-page/portfolio-page.component';
import { PageEditorComponent } from '../page-editor/page-editor/page-editor.component';

@Component({
  selector: 'app-page-wrapper',
  standalone: true,
  imports: [PortfolioPageComponent, PageEditorComponent],
  templateUrl: './page-wrapper.component.html',
  styleUrls: ['./page-wrapper.component.css'],
})
export class PageWrapperComponent {
  readonly viewModeService = inject(ViewModeService);
}
