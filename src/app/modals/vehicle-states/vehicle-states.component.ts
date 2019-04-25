import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, NumberFormatStyle } from '@angular/common';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { MapService } from '../../services/map.service';

declare var google: any;
@Component({
  selector: 'vehicle-states',
  templateUrl: './vehicle-states.component.html',
  styleUrls: ['./vehicle-states.component.scss']
})
export class VehicleStatesComponent implements OnInit {

  stateType;
  changeCategory="halts";
  flag='halts';
  location;
  lat;
  long;
  date;
  siteid=0;
  startDate;
  endDate;
  vid;

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService,
    public mapService: MapService,
    public datepipe: DatePipe,
    private modalService: NgbModal) {
      this.vid = this.common.params.vehicleId;
         this.getVehicleEvent();
     }

  ngOnInit() {
  }
   
  changeStateType(){
    
  }
  changeType(str){
    this.flag=str;
    console.log('changeType call', str);
  }

  ngAfterViewInit(): void {
    this.mapService.autoSuggestion("location", (place, lat, long) => {
      console.log("place---",place);
      // this.location = place;
      // this.lat = lat;
      // this.long = long;
    });

  }
 

  getDate() {
    this.common.params={ref_page:'vehicle states'};
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.date = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        console.log('lrdate: by getDate ' + this.date);
        console.log('siteid',this.siteid);

      }

    });
  }

  getVehicleEvent(){

    let today, start;
    today = new Date();
    this.endDate = this.common.dateFormatter(today);
    start = new Date(today.setDate(today.getDate() - 3))
    this.startDate = this.common.dateFormatter(start);
    let params = {
      vehicleId: this.vid,
      startDate: this.startDate,
      endDate: this.endDate
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('HaltOperations/getVehicleEvents', params)
            .subscribe(res=>{
              this.common.loading--;
              console.log(res['data'])
            },err=>{
              this.common.loading--;
              this.common.showError();
            })


  }

  closeModal() {
    this.activeModal.close();
  }
  saveDetails(){
    
  }


}
