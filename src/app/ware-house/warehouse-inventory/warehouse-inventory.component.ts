import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { ApiService } from '../../services/api.service';
import { GotPassComponent } from '../modal/got-pass/got-pass.component';
@Component({
  selector: 'warehouse-inventory',
  templateUrl: './warehouse-inventory.component.html',
  styleUrls: ['./warehouse-inventory.component.scss']
})
export class WarehouseInventoryComponent implements OnInit {
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  request = 0;
  dataInventory = null;
  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 10));
  headings = [];
  valobj = {};
  data = [];
  wareHouseId = ''
  constructor(public common: CommonService,
    public modalService: NgbModal,
    private api: ApiService) {
    // this.getdata();
    this.getWareData();
    this.common.refresh = this.refresh.bind(this);

  }
  stateDetail = [];
  ngOnInit() {
  }

  refresh(){
    this.getWareData();
  }

  getWareData() {
    this.api.get("Suggestion/getWarehouseList").subscribe(
      res => {
        this.dataInventory = res['data']
        console.log("autosugg", this.dataInventory[0].id);
        this.wareHouseId = this.dataInventory[0].id
      }
    )
  }



  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  getTableColumns() {

    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        console.log("ico1n")

        if (this.headings[i] == 'Action') {
          this.valobj['Action'] = { class: "fas fa-eye", action: this.showAction.bind(this, doc._item_id, doc.State, doc._state_id, doc.RemQauantity) }

        }
        else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'blue', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }


  getdata() {
    this.data = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    this.headings = [];
    this.valobj = {};

    if (this.startDate > this.endDate) {
      return this.common.showError("Start Date should not be Greater than End Date")
    }


    let startDate = this.startDate != null ? this.common.dateFormatter(this.startDate) : null;
  

    let endDate = this.endDate != null ? this.common.dateFormatter(this.endDate.setDate(this.endDate.getDate() + 1)) : null;
    console.log("end date:", endDate);


    if (this.request == 1) {
      if (startDate == null) {
        return this.common.showError("Start Date is missing")
      }
      else if (endDate == null) {
        return this.common.showError("End Date is missing")

      }
    }
    const params =
    {
      startDate: startDate,
      endDate: endDate,
      whId: this.wareHouseId,
      status: this.request
    }

    console.log("params", params)
    this.common.loading++;

    this.api.post("WareHouse/getStockItemPendingList", params).subscribe(
      res => {
        this.common.loading--;

        this.data = [];
        this.data = res['data'];
        console.log("result", res);
        if (this.data == null) {
          this.common.showToast("No record found")
        }
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      }
    );
  }




  showAction(itemId, stateName, stateId, quantity) {
    this.common.params = { itemId, stateName, stateId, quantity };
    console.log("Item", this.common.params)
    const activeModal = this.modalService.open(GotPassComponent, {
      size: "lg",
      container: "nb-layout"
    });
    activeModal.result.then(data => {
      //console.log("data", data.respone);
      if (data) {

        this.getdata();
      }

    });
  }
}
