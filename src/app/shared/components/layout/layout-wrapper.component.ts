import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewModeService } from '../../../core/services/view-mode.service';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';

@Component({
  selector: 'app-layout-wrapper',
  standalone: true,
  imports: [CommonModule, PublicLayoutComponent, AdminLayoutComponent],
  templateUrl: './layout-wrapper.component.html',
  styleUrls: ['./layout-wrapper.component.css']
})
export class LayoutWrapperComponent implements OnInit {
  private readonly viewModeService = inject(ViewModeService);  
  
  get viewMode(): string | null {
    return this.viewModeService.viewMode();
  }
  
  ngOnInit(): void {
    this.viewModeService.initViewMode();
  }
}
