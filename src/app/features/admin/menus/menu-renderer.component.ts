import { Directive, inject } from '@angular/core';
import { MenuType } from '../../../core/models/menu.model';
import { MenuService } from '../../../core/services/menu.service';
import { ViewModeService } from '../../../core/services/view-mode.service';
import { SidenavService } from '../../../core/services/sidenav.service';
import { merge, Subject, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MenuEditorComponent } from './menu-editor/menu-editor.component';

@Directive()
export abstract class MenuRendererComponent {
  abstract readonly menuType: MenuType;
  readonly menuService = inject(MenuService);
  readonly viewModeService = inject(ViewModeService);
  readonly sidenavService = inject(SidenavService);
  private readonly reload$ = new Subject<void>();
  readonly menu = toSignal(
    merge(
      toObservable(this.viewModeService.viewMode),
      this.reload$
    ).pipe(
      switchMap(() => this.menuService.getMenu(this.menuType))
    ),
    { initialValue: null }
  );

   openMenuEditor(): void {
      let menu = this.menu();

      if (!menu) {
        menu = {
          id: undefined,
          type: this.menuType,
          menuItems: []
        };
      }

      const sidenavRef = this.sidenavService.open(MenuEditorComponent, {
        disableBackdropClick: true
      });
      sidenavRef.componentInstance.menu = menu;

      sidenavRef.result.then(() => {
        this.reload$.next();
      });
    }
}
