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

  items = [
    {
      vehicleId: 0,
      regno: null,
    }
  ];

  vehicleItems=[
    {
      plantId:0,
      name:null
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
    this.items = [
      {
        vehicleId: 0,
        regno: null,
      }
    ];
  }

  refreshVehicle(){
    this.vehicleStatus=false;
    this.vehicleItems=[
      {
        plantId:0,
        name:null
      }
  ];
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  selectplnt(event,index){
    this.plantStatus=true;
    console.log("Plant:",event); 
  }

  getVehicleForPlant(event,index){
    console.log("vehicle:",event);
    this.items[index]['vehicleId'] = event['id'];
    this.items[index]['regno'] = event['regno'];
  }

  addMoreItems(i) {
    this.items.push({
      vehicleId:0,
      regno:null
    });
    console.log("items:",this.items)
  }

  savePlantData(){
    console.log("data:",this.items);
  }

// Vehicle placement Constraints

selectVehicle(event){
this.vehicleStatus=true;
}

selectPlantForVehicle(event,index){
  console.log("plantEvent:",event);
  this.vehicleItems[index]['plantId']=event['id'];
  this.vehicleItems[index]['name']=event['name'];
}

addItemsForVehicle(){
  this.vehicleItems.push({
    plantId:0,
    name:null
  });
}

saveVehicleData(){
  console.log("items:",this.vehicleItems)
}


}
