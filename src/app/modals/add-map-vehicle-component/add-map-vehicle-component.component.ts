import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'add-map-vehicle-component',
  templateUrl: './add-map-vehicle-component.component.html',
  styleUrls: ['./add-map-vehicle-component.component.scss']
})
export class AddMapVehicleComponentComponent implements OnInit {

  addMapDropDownData: boolean = false;
  type = 1;
  listOfFoAdmins = [];
  showFoDrop: boolean = false;
  isMap:boolean;
  gpsData = [];
  transFoid = null;
  vType = 1;
  
  

  constructor(
    public activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService
  ) {
    this.gpsData = this.common.params.data;
    this.isMap = this.common.params.isMap;
    console.log('gps data: ', this.gpsData, this.isMap)
    this.getAllTransporterWrtFo();
  }

  ngOnInit(): void {
  }

  closeModal() {
    console.log("testing");
    this.activeModal.close(false);
  }

  getAllTransporterWrtFo() {
    this.common.loading++;
    this.api.get('Suggestion/getAllTransporterWrtFo')
      .subscribe((res) => {
        this.common.loading--;
        console.log('res: ', res);
        if (res['data'].length > 0) {
          this.addMapDropDownData = true;
          this.listOfFoAdmins = res['data']
        } else {
          this.addMapDropDownData = false;
        }
      }, err => {
        this.common.loading--;
        console.log('err: ', err)
      })
  }

  selectType(event) {
    let type = event['target']['options']['selectedIndex'] + 1;
    this.marketTypeSelection(type);
  }

  marketTypeSelection(type) {
    console.log('type is: ', type)
    if (type === 1) {
      this.showFoDrop = false
      this.transFoid = null;
      this.vType = 1
    } 
    else if (type === 2) {
      this.showFoDrop = false;
      this.transFoid = null;
      this.vType = 2
    } 
    else if (type === 3) {
      this.showFoDrop = true
      this.vType = 3
    } 
    else if (type === 4) {
      this.showFoDrop = true
      this.vType = 4
    }
  }

  searchFoAdmins(event) {
    this.transFoid = event['id'];
    console.log('searchFos :', this.transFoid)
  }

  submitVehicle(){
    let params ={
      regno: this.gpsData['vehicleName'],
      type: this.vType,
      transFoid: this.transFoid,
      isAdd: this.isMap,
      vehId: this.gpsData['vid']
    }

    console.log('params is: ', params)
    this.common.loading ++;
    this.api.post('mapVehicleWithTransporter', params)
      .subscribe((res) => {
        this.common.loading -- ;
        console.log('res is: ', res);
      }, err => {
        this.common.loading -- ;
        console.log('err is: ', err)
      })
  }


}
