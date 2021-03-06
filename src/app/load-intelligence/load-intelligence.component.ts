import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';


@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
    <nb-menu   [items]="user._menu.loadIntelligence" autoCollapse="false"></nb-menu>
    <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class LoadIntelligenceComponent  {

  constructor(public user: UserService) {
    console.log(user._menu);
  }

}
