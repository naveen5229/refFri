import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { MapService } from "../../services/map.service";

@Component({
  selector: 'placement-constraints',
  templateUrl: './placement-constraints.component.html',
  styleUrls: ['./placement-constraints.component.scss']
})
export class PlacementConstraintsComponent implements OnInit {

  plantStatus=false;
  vehicleStatus=false;
  select=0;
  sltVehicle=0;
  activeTab='plant';
  plantIdForSave=null;
  vehicleIdForSave=null;

  vehicleIdRegnoPairs = [
    {
      vehicleId: 0,
      regno: null,
    }
  ];
  
  siteIdNamePairs=[
    {
      siteId:0,
      siteName:null
    }
];

  constructor(public mapService: MapService,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  refreshPlant(){
    this.plantStatus=false;
    this.vehicleIdRegnoPairs = [
      {
        vehicleId: 0,
        regno: null,
      }
    ];
  }

  refreshVehicle(){
    this.vehicleStatus=false;
    this.siteIdNamePairs=[
      {
        siteId:0,
        siteName:null
      }
  ];
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  selectplnt(event,index){
    this.plantIdForSave=event['id'];
    this.plantStatus=true;
    this.getPreviousDataUsingPlant(event['id']);
    console.log("Plant:",event); 
  }

  getPreviousDataUsingPlant(pltId){
    let siteId=pltId;
    let constraintType=this.select
    this.common.loading++;
    this.api.getJavaPortDost(8084, 'getPreviousConstraintDataUsingPlant/' + siteId+'/'+constraintType)
      .subscribe(res => {
        this.common.loading--;
        if (res['vehicleIdRegnoPairs'] && res['vehicleIdRegnoPairs'].length > 0) {
          this.vehicleIdRegnoPairs = res['vehicleIdRegnoPairs'];
        } else {
          console.log("test");
          this.vehicleIdRegnoPairs = [];
          this.vehicleIdRegnoPairs.push({
              vehicleId: 0,
              regno: null,
          });
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getVehicleForPlant(event,index){
    this.vehicleIdRegnoPairs[index]['vehicleId'] = event['id'];
    this.vehicleIdRegnoPairs[index]['regno'] = event['regno'];
  }

  addMoreItems(i) {
    this.vehicleIdRegnoPairs.push({
      vehicleId:0,
      regno:null
    });
    console.log("items:",this.vehicleIdRegnoPairs)
  }

  savePlantData(){
    console.log("jsonData:", JSON.stringify(this.vehicleIdRegnoPairs))
    let params = {
      constraintType: this.select,
      siteId: this.plantIdForSave,
      vehicleIdRegnoPairs:this.vehicleIdRegnoPairs
    }
    console.log("savePlantParam:", params);
    this.common.loading++;
    this.api.postJavaPortDost(8084, 'saveConstraintSite', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success']) {
          this.common.showToast(res['msg']);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

// Vehicle placement Constraints

selectVehicle(event){
this.vehicleIdForSave=event['id'];
this.vehicleStatus=true;
this.getPreviousDataUsingVehicle(event['id']);
}

getPreviousDataUsingVehicle(id){
  let vehId=id;
  let vehConstraints=this.sltVehicle;
    this.common.loading++;
    this.api.getJavaPortDost(8084, 'getPreviousConstraintDataUsingVehicle/' + vehId+'/'+vehConstraints)
      .subscribe(res => {
        this.common.loading--;
        if (res['siteIdNamePairs'] && res['siteIdNamePairs'].length > 0) {
          this.siteIdNamePairs = res['siteIdNamePairs'];
        } else {
          console.log("test");
          this.siteIdNamePairs = []; 
          this.siteIdNamePairs.push({
              siteId: 0,
              siteName: null,
          });
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
}

selectPlantForVehicle(event,index){
  console.log("plantEvent:",event);
  this.siteIdNamePairs[index]['siteId']=event['id'];
  this.siteIdNamePairs[index]['siteName']=event['name'];
}

addItemsForVehicle(){
  this.siteIdNamePairs.push({
    siteId:0,
    siteName:null
  });
}

saveVehicleData(){
  console.log("jsonData:", JSON.stringify(this.vehicleIdRegnoPairs))
    let params = {
      constraintType: this.sltVehicle,
      vehicleId: this.vehicleIdForSave,
      siteIdNamePairs:this.siteIdNamePairs
    }
    console.log("saveVehicleParams:", params);
    this.common.loading++;
    this.api.postJavaPortDost(8084, 'saveConstraintVehicle', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success']) {
          this.common.showToast(res['msg']);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
}

}
