import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { CommonService } from '../../services/common.service';
import { ReceiveItemsComponent } from '../modal/receive-items/receive-items.component';
import { ManualItemsComponent } from '../modal/manual-items/manual-items.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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
  endDate=new Date();
  startDate =new Date(new Date().setDate(new Date(this.endDate).getDate() - 10));;
 
  headings = [];
  valobj = {};
  constructor( public api: ApiService,
    public user: UserService,
    public common: CommonService,
    public modalService:NgbModal) {
    this.getWareData();
    this.common.refresh=this.refresh.bind(this);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    this.getWareData(); 
  }
    getTableColumns() {
      let columns = [];
      console.log("Data=", this.data);
      this.data.map(doc => {
        this.valobj = {};
        for (let i = 0; i < this.headings.length; i++) {
          console.log("doc index value:", doc[this.headings[i]]);
          if(this.headings[i]=="Action"){
            this.valobj['Action'] = { class: 'fa fa-edit', action: this.showAction.bind(this, doc) }
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
      if(this.startDate<this.endDate){
        if(this.wareHouseId!=null){
          let startDate = this.common.dateFormatter(this.startDate);
          let endDate = this.common.dateFormatter(this.endDate);
          const params={
            startDate:startDate,
            endDate:endDate,
            whId:this.wareHouseId
          }
          console.log("ap");
          this.common.loading++;
          this.api.post("WareHouse/getManifestPendingList" ,params).subscribe(
            res => {
              this.common.loading--;
              if(res['data']==null){
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
                this.common.showToast("No data Found")
              }else{
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
            }
          );
        }else{
          this.common.showToast("Please Select WareHouse");
        }
      }else{
        this.common.showToast("Start Date should be less then EndDate")
      }
      
    
    }
  
    showAction(doc) {
      console.log("doc",doc);
      if(this.wareHouseId!=null){
        this.common.params = {
          warehouseId : this.wareHouseId,
          manifestId:doc._manifest_id,
          item_name:doc['Challan No']
        };
        console.log("id",this.common.params);
        const activeModal = this.modalService.open(ReceiveItemsComponent, {
          size: "lg",
          container: "nb-layout"
        });
        activeModal.result.then(data => {
          if (data.response) {
            this.getdata();
          }
        });
       
      }else{
        this.common.showToast("please select WareHouse")
      }    
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

    Manual(){
      if(this.wareHouseId!=null){
        this.common.params = {
          warehouseId : this.wareHouseId,
        };
        const activeModal = this.modalService.open(ManualItemsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      }else{
        this.common.showToast("please select wareHouse")
      }
     
    }
  }


