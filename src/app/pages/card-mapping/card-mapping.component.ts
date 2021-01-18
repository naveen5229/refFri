import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { dateFieldName } from '@telerik/kendo-intl';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'card-mapping',
  templateUrl: './card-mapping.component.html',
  styleUrls: ['./card-mapping.component.scss']
})
export class CardMappingComponent implements OnInit {
  refId='';
  is_card=0;
  cardNo='';
  effDate=new Date();
  dataCardDetails='';
  date=''
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
  headings = [];
  valobj = {};

  constructor( public common:CommonService,
    public api:ApiService,
    public modalService:NgbModal) { 
    this.getData()
    this.common.refresh = this.refresh.bind(this);


  }

  ngOnDestroy(){}
ngOnInit() {
  }
  
  refresh() {

    this.getData();
  }

  addDriverCard(){
    let effDate = this.common.dateFormatter(this.date);
  const params = {
    refId:this.refId, 
    cardType:this.is_card, 
    cardNo:this.cardNo, 
    effDate:effDate
  };
  console.log("params",params)
  this.common.loading++;
  this.api.post('CardMapping/saveCardMappingDetails', params)
    .subscribe(res => {
      this.common.loading--;
      console.log('res', res['data']);
      this.common.showToast(res['msg']);
      this.getData();
    }, 
    err => {
      this.common.loading--;
      this.common.showError();
     } );
}

checkdate(event){
  this.date=event;
}

getDriverId(event){
  console.log("event",event)

  this.refId=event.id
  console.log('id',this.refId)
}

getTableColumns() {
  let columns = [];
  console.log("Data=", this.data);
  this.data.map(doc => {
    this.valobj = {};
    for (let i = 0; i < this.headings.length; i++) {
      console.log("doc index value:", doc[this.headings[i]]);
      this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      this.valobj['action'] = { class: '', icons: this.actionIcons(doc) };

    }

    columns.push(this.valobj);
  });
  return columns;
}

actionIcons(details) {
  let icons = [];
  icons.push(
    {
      class: "fa fa-trash",
      action: this.remove.bind(this, details),
    }
  )
  return icons;
}

remove(row) {
  console.log("row", row);


  let params = {
    rowId: row._id,
  }
  if (row._id ) {
    console.log('id', row._id);
    this.common.params = {
      title: 'Delete Route ',
      description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
    }
    const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      if (data.response) {
        console.log("data", data);
        this.common.loading++;
        this.api.post('CardMapping/deleteCardMappingDetail', params)
          .subscribe(res => {
            this.common.loading--;
            this.common.showToast(res['msg']);
            this.refId='';
            this.is_card=0;
            this.cardNo='';
            this.effDate=new Date();
            this.getData();
            
          }, err => {
            this.common.loading--;
            console.log('Error: ', err);
          });
      }
    });
  }
}

getData() {
  this.data = [];
  console.log("ap")
  this.api.get("CardMapping/getCardMappingDetails").subscribe(
    res => {
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
      let action = { title: this.formatTitle('Action'), placeholder: this.formatTitle('Action'), hideSearch: true };
      this.table.data.headings['action'] = action;
      this.table.data.columns = this.getTableColumns();
    }
  );
}

formatTitle(title) {
  return title.charAt(0).toUpperCase() + title.slice(1)
}

}

