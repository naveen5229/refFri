import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'state-logs',
  templateUrl: './state-logs.component.html',
  styleUrls: ['./state-logs.component.scss']
})
export class StateLogsComponent implements OnInit {
  dataState=[];
  dataWareHouse=[];
  stateId=2;
  wareHouseId=20;
  stateData=[]
  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 10));
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
  constructor( public api:ApiService,
    public common:CommonService) {
    this.getWareData();
    this.getData();
    this.common.refresh = this.refresh.bind(this);
   }

  ngOnInit() {
  }
  refresh(){
    this.getWareData();
    this.getData();
  }

  getWareData(){
    this.api.get("Suggestion/getWarehouseList").subscribe(
      res => {
        this.dataWareHouse = res['data']
        console.log("autosugg", this.dataState);

      }
    )
  }

  getData() {
    const params=`id=${62}`
    this.api.get("Suggestion/getTypeMasterList?" + params)
    .subscribe(
      res => {
        this.dataState = res['data']
        console.log("autosugg1", this.dataState);

      }
    )
  }


  getState(){
    let startDate = this.startDate != null ? this.common.dateFormatter(this.startDate) : null;
    let endDate = this.endDate != null ? this.common.dateFormatter(this.endDate) : null;
    if (startDate == null)
    {
       return this.common.showError("Start Date is Missing");
      
    }
    else if(endDate == null){
     return this.common.showError("End Date is Missing");

    }
    const params=`whId=${this.wareHouseId}&stateId=${this.stateId}&startDate=${startDate}&endDate=${endDate}`
    console.log(params);
   
    this.common.loading++;
    this.api.get("WareHouse/getStateLogsWrtWh?" + params).subscribe(
      res => {
        this.stateData = [];
        this.common.loading--;
        this.stateData = res['data'];
     
        console.log("result", res);

        let first_rec = this.stateData[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      },);

  }
    
  getTableColumns() {
    let columns = [];
    console.log("Data=", this.stateData);
    this.stateData.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }

      columns.push(this.valobj);
    });
    return columns;
  }

 formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
}
