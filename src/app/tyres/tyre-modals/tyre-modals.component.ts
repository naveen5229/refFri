import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'tyre-modals',
  templateUrl: './tyre-modals.component.html',
  styleUrls: ['./tyre-modals.component.scss','../../pages/pages.component.css', '../tyres.component.css']
})
export class TyreModalsComponent implements OnInit {
public modals =[];
public items = [];
public selectedModal = null;
  constructor(
    public api:ApiService,
    public common:CommonService
  ) {
    this.getModals();
    this.getStockItems()
   }

  ngOnInit() {
  }

  getModals() {
    let params = "typeId=-1";
    console.log("params ", params)
    this.api.get('Stock/getModals?'+ params)
      .subscribe(res => {
        this.modals = res['data'];
        console.log("getTyreModals", this.modals);

      }, err => {
        console.error(err);
        this.common.showError();
      });

  }

  getStockItems() {
    let params = "typeId=-1&stockSubTypeId="+this.selectedModal;
    console.log("params ", params)
    this.api.get('Stock/getStockItems?'+ params)
      .subscribe(res => {
        this.items = res['data'];
        console.log("getItems", this.items);

      }, err => {
        console.error(err);
        this.common.showError();
      });

  }

}
