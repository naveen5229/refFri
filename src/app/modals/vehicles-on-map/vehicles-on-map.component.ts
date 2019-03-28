import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { NumberFormatStyle } from '@angular/common';

declare var google: any;

@Component({
  selector: 'vehicles-on-map',
  templateUrl: './vehicles-on-map.component.html',
  styleUrls: ['./vehicles-on-map.component.scss']
})
export class VehiclesOnMapComponent implements OnInit {
  show=false;
  map: any;
  count=0;
  flag=false;
  Lat=[];
  Lng=[]; 
  details=[];
  markers=[];
   Location = {
    lat:0,
    lng:0,
    zoom: 0
  };
 
  constructor(public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService,
    private zone: NgZone) {
   this.getVehicleInfo();
   }

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log('ionViewDidLoad MarkerLocationPage');
   // this.location = this.common.params['location'];
  }

  

  closeModal() {
    this.activeModal.close();
  }


  getVehicleInfo(){

    let params="vId="+27093+
      "&fromTime=2019/01/10"+
      "&toTime=2019/03/10";
    
    console.log('params to insert',params);
    this.common.loading++;
    this.api.get('HaltOperations/getHaltHistory?'+params)
            .subscribe(res=>{
              this.common.loading--;
              console.log('res: ',res['data']);
              this.details=res['data'];
              this.showOnMap();  
            }, err=>{
              this.common.loading--;
              this.common.showError();
          })
          
           
   }
       showOnMap(){
       this.Location.lat= 26.9124336,
       this.Location.lng=75.78727090000007,
       this.Location.zoom=8
       
       this.details.forEach((element) => {
        if(!this.flag){
        this.markers.push({
          lat: parseFloat(element.lat),
          long: parseFloat(element.long),
          label: element.loc
        })
        this.count++;
        console.log('count: ',this.count);
        if(this.count==10)
            this.flag=true;
          }   
              
      });
    
        console.log('markers: ',this.markers);
        

       } 

       onMapReady(map){
         this.initDrawingManager(map)
       }

       initDrawingManager(map: any) {
        const options = {
          drawingControl: true,
          drawingControlOptions: {
            drawingModes: ["polygon"]
          },
          polygonOptions: {
            draggable: true,
            editable: true
          },
          drawingMode: google.maps.drawing.OverlayType.POLYGON
        };
    
        const drawingManager = new google.maps.drawing.DrawingManager(options);
        drawingManager.setMap(map);
      }

      showInfo(info){
        this.show = true;
        console.log(this.show);
      }

      hideInfo(info){
        this.show = false;
        console.log(this.show);
      }

      
}
