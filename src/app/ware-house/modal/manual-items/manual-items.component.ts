import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'manual-items',
  templateUrl: './manual-items.component.html',
  styleUrls: ['./manual-items.component.scss']
})
export class ManualItemsComponent implements OnInit {
  unitList=[];
  wareHouseList=[];
  wareHouseId=null;
  constructor(public activeModal:NgbActiveModal,
    public api:ApiService,
    public common:CommonService) { 
      this.getUnitList();
      this.getWareHouseList();
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  getUnitList() {
    let params = {
      search: ''
    }
    this.api.post('Suggestion/getUnit', params)
      .subscribe(res => {
        this.unitList = res['data'];
        console.log('type', this.unitList);
      }, err => {
        this.common.showError();
      });
  }

  getWareHouseList() {
    this.api.get('Suggestion/getWarehouseList')
      .subscribe(res => {
        this.wareHouseList = res['data'];
        console.log('type', this.wareHouseList);
      }, err => {

        this.common.showError();
      });
  }

}
