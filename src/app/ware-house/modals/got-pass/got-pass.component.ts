import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../../modals/date-picker/date-picker.component';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'got-pass',
  templateUrl: './got-pass.component.html',
  styleUrls: ['./got-pass.component.scss']
})
export class GotPassComponent implements OnInit {
  itemList = [];
  Test=null;
  dataItems=[]
  itemId = null;
  quantityId = null;
  unitTypeId = null;
  unitList = [];
  Date = null;
  remark=''; 
   itemsId=null;


  selectOption="In";
  quantity = [{
    name: '5',
    id: '5'
  },
  {
    name: '10',
    id: '10'
  },
  {
    name: '15',
    id: '15'
  }, {
    name: '20',
    id: '20'
  },
  {
    name: '25',
    id: '25'
  },
  {
    name: '30',
    id: '30'
  }];

  stateType = [{
    id:null,
    name:null
  }];
  stateType1=[{
    id:null,
    name:null
  }];
  userInput='';
StateId = null;
  constructor(public common: CommonService,
    public modalService: NgbModal,
    private api: ApiService,
    public activeModal: NgbActiveModal) {
    this.getUnitList();
    this.getItems();
    this.stateType=[{
 
      name: 'Transhipment',
      id: 2
    }, {
      name: 'out for delivery',
      id: 4
    }, {
      name: 'Damage',
      id: 5
    },
    {
      name: 'Missing/theft',
      id: 6
    }, {
      name: 'delivered',
      id: 1 
    }];
    this.stateType1=[ {
      name: 'receive Manifest',
      id: -1
    }, {
      name: 'Received By GP',
      id: -2
    },
      {
     name: 'received lr',
      id: -3
    }, {
      name: 'returned Back',
      id: -4
    },
    {
    name: 'Increase In Count',
    id: -6
  }];
  }

  ngOnInit() {
  }

  getItems(){
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

  onSet(type){
    this.selectOption='';
    this.selectOption = type;
    if(this.selectOption =='In')
    {
      console.log("test", this.selectOption);
        console.log("data",this.stateType);
        
          return this.stateType;
      }
      else{
         return this.stateType1;
      }
    }

 


  getAdvice(){
    let TDate = this.common.dateFormatter(this.Date);

    const  params = {
    stateId:this.StateId,
    unitType:this.unitTypeId,
    itemId:this.itemsId,
    qty:this.quantityId,
    dttime:TDate,
    remarks:this.remark,
    perDetail:this.userInput,
      
    }
    console.log("result",params)
    this.common.loading++;
    this.api.post('WareHouse/saveWhStockItemState', params)
      .subscribe(res => {
        this.common.loading--;
        this.unitList = res['data'];
        console.log('type', this.unitList);
        if (res['data'][0].y_id > 0) {

          this.common.showToast("Sucessfully insert");

          this.activeModal.close({ data: true });
        }
        else
        {
          this.common.showError("item_id,date or other detail is missing ");

        }
      }, err => {
        this.common.showError("item_id,date or other detail is missing" );
        console.log('Error: ', err);
      });
  }


  
  }

