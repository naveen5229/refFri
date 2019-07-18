import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReceiveItemsComponent } from '../modals/receive-items/receive-items.component';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'ware-house-receipts',
  templateUrl: './ware-house-receipts.component.html',
  styleUrls: ['./ware-house-receipts.component.scss']
})
export class WareHouseReceiptsComponent implements OnInit {
  data = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true

    }

  };
  wareHouseId=null;
  dataReceive='';
  startDate = null;
  endDate=null;
  headings = [];
  valobj = {};
  constructor(
    public api: ApiService,
    public user: UserService,
    public common: CommonService,
    public modalService:NgbModal
  ) {
    this.getWareData()
  }

  ngOnInit() {
  }


  // receiveItems(){
  //     const activeModal = this.modalService.open(ReceiveItemsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  
  //   }

    getTableColumns() {
      let columns = [];
      console.log("Data=", this.data);
      this.data.map(doc => {
        this.valobj = {};
        for (let i = 0; i < this.headings.length; i++) {
          console.log("doc index value:", doc[this.headings[i]]);
              
          if(this.headings[i]=='Action'){
            this.valobj['Action'] = { class: "fas fa-eye", action: this.showAction.bind(this, doc.status, doc.foid) }
          }
          else{
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
          }
        }
        columns.push(this.valobj);
      });
      return columns;
    }
  
    getdata(){
      let startDate = this.common.dateFormatter(this.startDate);
      let endDate = this.common.dateFormatter(this.endDate);
      const params={
        startDate:startDate,
        endDate:endDate
      }
      console.log("ap")
      this.api.post("WareHouse/getManifestPendingList" ,params).subscribe(
        res => {
          this.data = [];
          this.data = res['data'];
          console.log("result", res);
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
  
    showAction() {
      this.common.params = {warehouseId : this.wareHouseId};
      const activeModal = this.modalService.open(ReceiveItemsComponent, {
        size: "lg",
        container: "nb-layout"
      });
    }

    getWareData(){
      this.api.get("Suggestion/getWarehouseList").subscribe(
        res => {
          this.dataReceive = res['data']
          console.log("autosugg", this.dataReceive);
  
        }
      )
    }

    formatTitle(title) {
      return title.charAt(0).toUpperCase() + title.slice(1)
    }
  }


