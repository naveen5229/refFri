import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../../modals/date-picker/date-picker.component';
import { ApiService } from '../../../services/api.service';
import { ConfirmComponent } from '../../../modals/confirm/confirm.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'got-pass',
  templateUrl: './got-pass.component.html',
  styleUrls: ['./got-pass.component.scss']
})
export class GotPassComponent implements OnInit {
  itemList = [];
  Test = null;
  dataItems = []
  itemId = null;
  quantityId = null;
  unitTypeId = null;
  unitList = [];
  Date = new Date();
  remark = '';
  itemsId = null;


  selectOption = "In";
  stateData = [];
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
  stateType = [{
    id: null,
    name: null
  }];
  stateType1 = [{
    id: null,
    name: null
  }];
  userInput = '';
  StateId = null;
  boolean = 0;
  stateFind = null;
  

  constructor(public common: CommonService,
    public modalService: NgbModal,
    private api: ApiService,
    public activeModal: NgbActiveModal) {
    this.getUnitList();
    this.getItems();
    this.getStateData();
    console.log("para", this.common.params)
    this.quantityId = this.common.params.quantity
    this.stateFind = this.common.params.quantity

    this.itemId = this.common.params.itemId;
    this.StateId = this.common.params.stateId;
    this.selectOption = this.StateId > 0 ? 'In' : 'Out';
    console.log("items1", this.itemId)
    this.common.handleModalSize('class', 'modal-lg', '550');

    this.stateType = [{
      name: 'Transhipment',
      id: 2
    }, {
      name: 'Out for Delivery',
      id: 4
    }, {
      name: 'Damage',
      id: 5
    },
    {
      name: 'Missing/theft',
      id: 6
    }, {
      name: ' Delivered',
      id: 1
    }];
    this.stateType1 = [{
      name: 'Receive Manifest',
      id: -1
    }, {
      name: 'Received By GP',
      id: -2
    },
    {
      name: 'Received Lr',
      id: -3
    }, {
      name: 'Returned Back',
      id: -4
    },
    {
      name: 'Increase In Count',
      id: -6
    }];
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  getItems() {
    this.api.get("WareHouse/getWhStockItem").subscribe(
      res => {
        this.dataItems = res['data']
        console.log("autosugg", this.dataItems);

      }
    )
  }

  getUnitList() {
    let params = {
      search: ''
    }
    this.common.loading++;
    this.api.post('Suggestion/getUnit', params)
      .subscribe(res => {
        this.common.loading--;
        this.unitList = res['data'];
        console.log('type', this.unitList);
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }


  closeModal() {
    this.activeModal.close();
  }

  cancelRequest() {
    this.activeModal.close();
  }

  onSet(type) {
    this.selectOption = null;
    this.selectOption = type;
    console.log('select type:', this.selectOption);
     if(this.selectOption =='Out')
    {   
      console.log("stateFind", this.selectOption);
          return this.stateType;
      }
      else{
         return this.stateType1;
      }
  }




  getAdvice() {
    console.log(this.selectOption);
    if(!this.StateId){
      this.common.showError("State Type Missing");
      return;
    }
   else if(this.quantityId < 0){
      return this.common.showError("Quantity should not  be in nagative ");
  
     }
   else  if (this.selectOption == 'Out') {
      console.log("stateFind", this.selectOption);
      if(this.quantityId== 0)
      {
        return this.common.showError("You have no items in stock ");

      }
      else  if (this.quantityId === this.stateFind) {
        this.common.params = {
          title: 'Closing Stock',
          description: 'Are you sure you want close this stock?',
          btn2:"No",
          btn1:'Yes'
        };
        console.log("Inside confirm model")
        const activeModal = this.modalService.open(ConfirmComponent, { size: "sm", container: "nb-layout" });
        activeModal.result.then(data => {
          console.log('res', data);
          if (data.response) {
            this.boolean = 1;
            this.saveStock();
          }
          else if(data.apiHit==0){
            this.boolean = 0;
            this.saveStock();
          }
      
        });
        
      }
      else if (this.quantityId > this.stateFind) {
        console.log("out1")
        return this.common.showError("Quantity should be less  than  and equal  your stock ");
      }
      else if(this.quantityId < this.stateFind){
      this.saveStock();
      }

     
  
    } 
    else if( this.selectOption == 'In'){
      this.saveStock();
    //  if(this.quantityId<0)
    // {
    //   return this.common.showError("Quantity should not be nagative ");

    }
  

  
 

    
    
    
  }
  
  saveStock(){
    let TDate = this.common.dateFormatter(this.Date);
  const params = {
    stateId: this.StateId,
    itemId: this.itemId,
    qty: this.quantityId,
    dttime: TDate,
    remarks: this.remark,
    perDetail: this.userInput,
    isClose: this.boolean

  }
 if( this.userInput== null){
    return this.common.showError("Detail is required ");

   }

  console.log("result", params)
  this.common.loading++;
  this.api.post('WareHouse/saveWhStockItemState', params)
    .subscribe(res => {
      this.common.loading--;
      this.unitList = res['data'];
      console.log('type', this.unitList);
      if (this.quantityId < res['data'].qty) {
        this.common.showError(res['msg']);

      }

 
      if (res['data'][0].y_id > 0) {

        this.common.showToast("Sucessfully insert");

        this.activeModal.close({ data: true });
      }
      else {
        this.common.showError(res['msg']);

      }
    }, err => {
      this.common.showError();
      // console.log('Error: ', err);
    });
}
    


  getTableColumns() {
    let columns = [];
    console.log("Data=", this.stateData);
    this.stateData.map(stateDoc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", stateDoc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: stateDoc[this.headings[i]], class: 'black', action: '' };
      }

      columns.push(this.valobj);
    });
    return columns;
  }

  getStateData() {
    console.log("ap")
    const params = "itemId=" + this.common.params.itemId;
    this.api.get("wareHouse/getAllStatesWrtItem?" + params).subscribe(
      res => {
        this.stateData = [];
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
      }
    );
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

}

