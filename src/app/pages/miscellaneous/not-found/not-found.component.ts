import { NbMenuService } from '@nebular/theme';
import { Component } from '@angular/core';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'ngx-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {

  constructor(private menuService: NbMenuService) {
  }

  ngOnDestroy(){
  }

  goToHome() {
    this.menuService.navigateHome();
  }
}
