import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuType } from '../../../../core/models/menu.model';
import { SmartLinkDirective } from "../../../../core/utils/smartLink.directive";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { IconComponent } from "../../../../shared/components/icon/icon.component";
import { MenuRendererComponent } from '../menu-renderer.component';

@Component({
  selector: 'app-footer-menu-renderer',
  standalone: true,
  imports: [CommonModule, SmartLinkDirective, ButtonComponent, IconComponent],
  templateUrl: './footer-menu-renderer.component.html',
  styleUrls: ['./footer-menu-renderer.component.css']
})
export class FooterMenuRendererComponent extends MenuRendererComponent {
  readonly menuType = MenuType.Footer;
}
