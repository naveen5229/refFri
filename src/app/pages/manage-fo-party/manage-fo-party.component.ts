import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'manage-fo-party',
  templateUrl: './manage-fo-party.component.html',
  styleUrls: ['./manage-fo-party.component.scss']
})
export class ManageFoPartyComponent implements OnInit {

  associationType=[];

  constructor(public api:ApiService) {
    this.getAssociationType();
   }

  ngOnInit() {
  }

  getAssociationType() {
    const params="id="+63;
    this.api.get('Suggestion/getTypeMasterList?'+params)
      .subscribe(res => {
        this.associationType=res['data'];
      }, err => {
      });
  }

}
