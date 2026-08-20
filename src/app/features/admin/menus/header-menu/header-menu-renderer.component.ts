import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuType } from '../../../../core/models/menu.model';
import { MenuRendererComponent } from '../menu-renderer.component';
import { SmartLinkDirective } from "../../../../core/utils/smartLink.directive";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { IconComponent } from "../../../../shared/components/icon/icon.component";

@Component({
  selector: 'app-header-menu-renderer',
  standalone: true,
  imports: [CommonModule, SmartLinkDirective, ButtonComponent, IconComponent],
  templateUrl: './header-menu-renderer.component.html',
  styleUrls: ['./header-menu-renderer.component.css']
})
export class HeaderMenuRendererComponent extends MenuRendererComponent {
  readonly menuType = MenuType.Header;
}
