import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'tripshared',
  templateUrl: './tripshared.component.html',
  styleUrls: ['./tripshared.component.scss']
})
export class TripsharedComponent implements OnInit {
  tripData :any;
  hourdata = [];
  activehour=6;
  sharedname='Shared : 2021-07-27';
  sharedvehicledata :any;
  vehicledata = [];
  searchText = '';
  finaldata = [];
  message='';
  constructor(public api: ApiService,
    public common: CommonService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    public user: UserService) {
      this.getVehicleFowise();
      this.getSharedVehicles();
      for(let i=1; i<=6;i++){
        if(i == 1){
          this.hourdata.push(6);
        }
        this.hourdata.push(12*i);
      }
      console.log('hourdata',this.hourdata);
  }
  ngOnInit(): void {
  }
  getVehicleFowise() {
    this.tripData = [];
  
    this.common.loading++;
    this.api.get('Vehicles/getVehicleFowise')
      .subscribe(res => {
        this.common.loading--;
        this.tripData = res['data'];
        this.tripData.map((dd,index)=>{
          this.tripData[index].status=false;
        }); 
        this.vehicledata = this.tripData;
        console.log('res: ',this.tripData);
        

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  searchVehicle(value) {
    value.status = true;
    this.vehicledata.push(value); 
  }
  saveTripStatus(){
    let xrefids='';
    console.log('tripData',this.tripData,this.finaldata);
    this.finaldata.map((xdata)=>{
      if(xdata.status){
        xrefids += xdata.r_vid+',';
      }
    });
    let params= {
      name: this.sharedname,
      expiryhrs: this.activehour,
      xrefids: (xrefids)?(xrefids.substring(0,xrefids.length-1)):'',
      xid:0
    };
    this.common.loading++;
    this.api.post('Vehicles/savesharedvehicles',params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
         this.message= res['data'][0]['url_token'];
        this.getSharedVehicles();

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  getsearchSuggestions() {
    this.vehicledata = [];
    console.log('searchText',this.searchText);
    // this.onChange.emit(this.searchText);
    // this.apiHitLimit = this.apiHitLimit ? this.apiHitLimit : 3;

    // this.showSuggestions = true;
    if (this.tripData) {
      this.vehicledata = this.tripData.filter(suggestion => {
        //if (this.searchText === 'string') {
          console.log('tru condition');
          return (suggestion['r_regno'] || '').toLowerCase().includes(this.searchText.toLowerCase())
        // } 
        // else{
        //   console.log('fall condition');
        // }
        // else {
        //   return this.generateString(suggestion).toLowerCase().includes(this.searchText.toLowerCase());
        // }
      });
      this.vehicledata.splice(10, this.vehicledata.length - 1);
      //this.cdr.detectChanges();
      return;
    }
    // if (this.searchText.length < this.apiHitLimit) return;

    // clearTimeout(this.suggestionApiHitTimer);
    // this.suggestionApiHitTimer = setTimeout(this.getSuggestionsFromApi.bind(this), 400);
  }
  selectchecked(data){
    data.status = true;
    this.finaldata.push(data);
  }
  getSharedVehicles() {
    this.sharedvehicledata = [];
  
    this.common.loading++;
    this.api.get('Vehicles/getSharedVehicles')
      .subscribe(res => {
        this.common.loading--;
        if(res['data']){
        this.sharedvehicledata = res['data'];
        
        console.log('res shared vehicle: ',this.sharedvehicledata);
        }else{
          this.common.showToast('Data Are Not Available');
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
}
