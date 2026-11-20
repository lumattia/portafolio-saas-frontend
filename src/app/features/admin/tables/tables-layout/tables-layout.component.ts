import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tables-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tables-layout.component.html',
  styleUrls: ['./tables-layout.component.scss']
})
export class TablesLayoutComponent {
  readonly tables = [
    { path: '/tables/pages', name: 'Pages', icon: 'table' },
    { path: '/tables/versions', name: 'Versions', icon: 'eye' }
  ];
}
