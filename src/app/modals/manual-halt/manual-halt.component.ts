import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var google: any;

@Component({
  selector: 'manual-halt',
  templateUrl: './manual-halt.component.html',
  styleUrls: ['./manual-halt.component.scss']
})
export class ManualHaltComponent implements OnInit {

  halt_type="11";
  location={
    haltlocation:'',
    lat:'',
    long:''
  };
  locationType='city';
  haltSite=null;
  vid='';
  startTime;
  endTime;

  preselectedVehId = "";
  preselectedVehRegNo = "";
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) { 
      this.preselectedVehId =  this.common.params.vehicleId;
      this.preselectedVehRegNo=  this.common.params.vehicleRegNo;
      console.log(this.preselectedVehId , this.preselectedVehRegNo);
      this.vid = this.preselectedVehId;
    }

  ngOnInit() {
  }

  searchVehicle(vehicleList){
   this.vid=vehicleList.id;
  }

  selecteCity(){
    console.log("city selected");
    setTimeout(this.autoSuggestion.bind(this, 'place',false), 3000);
  }

  ngAfterViewInit(): void {
    setTimeout(this.autoSuggestion.bind(this, 'place'), 3000);
    
  } 

  autoSuggestion(elementId) {
    var options = {
      types: ['(cities)'],
      componentRestrictions: { country: "in" }
    };
    let ref = document.getElementById(elementId);//.getElementsByTagName('input')[0];
    let autocomplete = new google.maps.places.Autocomplete(ref, options);
    google.maps.event.addListener(autocomplete, 'place_changed', this.updateLocation.bind(this, elementId, autocomplete));
  }

  updateLocation(elementId, autocomplete) {
    console.log('tets');
    let place = autocomplete.getPlace();
    let lat = place.geometry.location.lat();
    let lng = place.geometry.location.lng();
    place = autocomplete.getPlace().formatted_address;

    this.setLocations(elementId, place, lat, lng);
  }

  setLocations(elementId, place, lat, lng) {
    console.log("elementId", elementId, "place", place, "lat", lat, "lng", lng);
    if (elementId == 'place') {
      this.location.haltlocation=place;
      this.location.lat = lat;
      this.location.long = lng;
    } 
    }

    saveHalt(){
      this.startTime=this.common.dateFormatter(this.startTime);
      this.endTime=this.common.dateFormatter(this.endTime);
      let params={
        startTime:this.startTime,
        endTime:this.endTime,
        vehicleId:this.vid,
        lat:this.location.lat,
        long:this.location.long,
        haltTypeId:this.halt_type,
        siteId:this.haltSite
       };
       console.log('params to insert', params);
       this.common.loading++;
       this.api.post('HaltOperations/insertSingleHalt',params)
               .subscribe(res=>{
                 this.common.loading--; 
                  console.log('res: ',res['data']);
                  if(res['code']=='1')
                  this.common.showToast('Success!!');
                  else
                   this.common.showToast('Not Success!!');
                  
               },err=>{
                 this.common.loading--;
                 this.common.showError();
               })  
    }

    closeModal() {
      this.activeModal.close();
    }

    haltTypeChange(type){
      
    }
  }


