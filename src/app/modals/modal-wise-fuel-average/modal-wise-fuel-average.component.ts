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
  constructor(public common:CommonService,
    public api:ApiService,
    public activeModal:NgbActiveModal) { 
    this.getVehicle();
  }

  ngOnInit() {
  }
  
closeModal(){
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
const params = {
  vehModel: this.itemId,
  loadAvg: this.load,
  unloadAvg: this.unLoad,

}
this.common.loading++;
this.api.post('Fuel/addModelWiseFuelAvgWrtFo ',params)
  .subscribe(res => {
    this.common.loading--;
    this.load = res['data'];
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
