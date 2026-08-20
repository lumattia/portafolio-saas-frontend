import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuType } from '../../../../core/models/menu.model';
import { MenuRendererComponent } from '../menu-renderer.component';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { IconComponent } from "../../../../shared/components/icon/icon.component";
import { SmartLinkDirective } from "../../../../core/utils/smartLink.directive";

@Component({
  selector: 'app-sidebar-menu-renderer',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, SmartLinkDirective],
  templateUrl: './sidebar-menu-renderer.component.html',
  styleUrls: ['./sidebar-menu-renderer.component.css']
})
export class SidebarMenuRendererComponent extends MenuRendererComponent {
  readonly menuType = MenuType.Sidebar;
}
