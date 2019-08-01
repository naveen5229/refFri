import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'modal-wise-fuel-average',
  templateUrl: './modal-wise-fuel-average.component.html',
  styleUrls: ['./modal-wise-fuel-average.component.scss']
})
export class ModalWiseFuelAverageComponent implements OnInit {
  vehicleList=[];
  itemId=null;
  load=null;
  unLoad=null;
  rowId=null;
  vehicleName=null
  loadData=[]
  constructor(public common:CommonService,
    public api:ApiService,
    public activeModal:NgbActiveModal) { 
    this.getVehicle();
    console.log("this",this.common.params)
    this.rowId = this.common.params.row
    this.load =  this.common.params.load
    this.unLoad =  this.common.params.unLoad
    this.vehicleName = this.common.params.name
    this.itemId = this.common.params.vehicle


  }

  ngOnInit() {
  }
  
closeModal(data){
  this.activeModal.close();
}
  
  getVehicle() {
  
    this.common.loading++;
    this.api.get('Suggestion/getVehicleModelList')
      .subscribe(res => {
        this.common.loading--;
        console.log("items",res);
        this.vehicleList = res['data'];

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  changeRefernceType(type) {
    console.log('Type: ', type);
    this.itemId = this.vehicleList.find((element) => {
      console.log(element.name == type);
     
      return element.id == type.id;
    }).id;
}



addFuelModal() {
  if(this.itemId == null){
    return this.common.showError("Company Id is missing")

  }
  else if(this.load == null)
  {
    return this.common.showError("Load is missing")
  }
  else  if(this.unLoad == null)
  {
    return this.common.showError("UnLoad is missing")
  }
  else if(this.load < 0 )
  {
    return this.common.showError("Load  should not be negative")
  }
  else if(this.load >= 20)
  {
    return this.common.showError("Load  should  be less than  equal to 20")
  }
  else  if(this.unLoad < 0)
  {
    return this.common.showError("UnLoad  should not be negative")
  }
 else  if(this.unLoad >= 20)
  {
    return this.common.showError("UnLoad  should  be less than  equal to 20")
  }
 
 
const params = {
  vehModel: this.itemId,
  loadAvg: this.load,
  unloadAvg: this.unLoad,
  rowId:this.rowId

}
this.common.loading++;
this.api.post('Fuel/addModelWiseFuelAvgWrtFo ',params)
  .subscribe(res => {
    this.common.loading--;
    this.loadData = res['data'];
    console.log('type', this.load);
  
    if (res['msg'] == 'Success') {

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
}
