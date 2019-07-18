import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'receive-items',
  templateUrl: './receive-items.component.html',
  styleUrls: ['./receive-items.component.scss']
})
export class ReceiveItemsComponent implements OnInit {
  dataReceive='';
  dataMainFest='';
  table = null;
  data = [];
  id=null;

  constructor(public activeModal:NgbActiveModal,
    public api:ApiService,
    public common:CommonService) { 
      this.getData();
      this.getTable();
      this.id = this.common.params.warehouseId;
      console.log("is", this.id  )
    }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  getData(){
    this.api.get("Suggestion/getWarehouseList").subscribe(
      res => {
        this.dataReceive = res['data']
        console.log("autosugg", this.dataReceive);

      }
    )
    this.api.get("Suggestion/getManifestName").subscribe(
      res => {
        this.dataMainFest = res['data']
        console.log("autosugg", this.dataMainFest);
        console.log("iss",this.id)

      }
    )

  }

  getList(event) {
    console.log("get")
    this.id = event.target.value;
    console.log("event", this.id);

  }
  
  getTable() {
    console.log("iss1",this.id)
   const params="manifestId=" + this.id;

    this.api.get('WareHouse/getLrWrtManifest?' + params)
      .subscribe(res => {
        this.data = res['data'] || [];
        // this.table = this.setTable();
        console.log("datA", res);
      }, err => {
        console.log(err);
      });
}
}
