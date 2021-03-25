import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { MapService } from "../../services/map.service";
import { isArray } from 'rxjs/internal/util/isArray';

@Component({
  selector: 'placement-optimisation-on-map',
  templateUrl: './placement-optimisation-on-map.component.html',
  styleUrls: ['./placement-optimisation-on-map.component.scss']
})
export class PlacementOptimisationOnMapComponent implements OnInit {

  allPlacementData=[];
  filterData=[];
  filterDataOjt=[];
  singleData=[];
  allHeadingData=[];
  markers=[];
  cominedArray=[];
  newArray=[];
  constructor(
    public mapService: MapService,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal
  ) { 
    this.allPlacementData=this.common.params.data;
    console.log("allPlacementData:",this.allPlacementData);
    this.showData();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.mapService.mapIntialize("placement-map");
  }
  showData(){
      console.log("test:",this.allPlacementData['siteVehicleCostPackets']);
      this.allPlacementData['siteVehicleCostPackets'].forEach((element, index) => {
      this.cominedArray.push(element.vehicleCostPacket);
    }); 
    console.log('element123',this.cominedArray);
    this.mapService.clearAll();
    setTimeout(() => {
      this.mapService.setMapType(0);
      console.log("combinedArray:",this.cominedArray);
      for(let i=0; i<this.cominedArray.length;i++){
        console.log("condition:",Array. isArray(this.cominedArray[i]))
        if(Array. isArray(this.cominedArray[i])){
         
         this.cominedArray[i].forEach(element => {
           this.newArray.push(element);
         });
          console.log("newArray:",this.newArray);
        }else{
          this.newArray.push(this.cominedArray[i])
        }
      }
      this.newArray[0].map(e=>{return e.title = e.truckRegno;});
      this.markers = this.mapService.createMarkers(this.newArray[0]);
      console.log("markers:",this.markers);
    }, 1000);
  }

  closeModal(response){
    this.activeModal.close({ response:response});
  }

}
