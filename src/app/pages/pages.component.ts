import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['./pages.component.css'],
  template: `
    <ngx-sample-layout>
    
       <nb-menu [items]="menu" autoCollapse="true"></nb-menu>
     
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent {

  menu = MENU_ITEMS;

  constructor(public menuService: NbMenuService) {
    console.log('Menu:', this.menuService);
  }


}
