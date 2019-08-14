import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleSearchComponent } from '../../modals/vehicle-search/vehicle-search.component';

@Component({
  selector: 'vehicle-trolly-mapping',
  templateUrl: './vehicle-trolly-mapping.component.html',
  styleUrls: ['./vehicle-trolly-mapping.component.scss', '../../pages/pages.component.css', '../tyres.component.css']
})
export class VehicleTrollyMappingComponent implements OnInit {

  vehTrollyMappings = [];
  vehicleId = null;
  vehicleRegNo = null;
  trolleyId = null;
  refMode = 701;
  date = this.common.dateFormatter(new Date());

  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService) {
    this.getCurrentTrolleyDetails();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh(){
    this.getCurrentTrolleyDetails();
  }

  getCurrentTrolleyDetails() {
    this.api.get('Tyres/getCurrentTrolleyDetails?') // Customer API
      // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
      .subscribe(res => {
        this.vehTrollyMappings = res['data'];
        console.log("Trolley details", this.vehTrollyMappings);

      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  saveMappingDetails() {
    this.common.loading++;
    let params = {
      vehicleId: this.vehicleId,
      refMode: this.refMode,
      date: this.date,
      trollyId: this.trolleyId
    };
    console.log('Params:', params);
    this.api.post('Tyres/saveVehicleTrollyMapping', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("return id ", res['data'][0].rtn_id);
        if (res['data'][0].rtn_id > 0) {
          console.log("sucess");
          this.common.showToast("sucess");
         this.getCurrentTrolleyDetails();
        } else {
          console.log("fail");
          this.common.showToast(res['data'][0].rtn_msg);
        }
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  vehicleChange(trolleyId, vehicleId, vehicleRegNo) {
    this.trolleyId = trolleyId;
    this.common.params = {"vehicleId": vehicleId ,"vehicleRegNo" : vehicleRegNo }
    const activeModal = this.modalService.open(VehicleSearchComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.result.then(data => {
      if (data.response) {
        this.vehicleId = data.response.vehicleId ;
        this.vehicleRegNo = data.response.vehicleRegNo ;
        this.refMode = data.response.refMode;
        let flag = data.response.flag;
        this.date = this.common.dateFormatter(new Date(data.response.date));
        console.log("data.response.vehicleRegNo",flag,this.date);
        if(flag == 'true'){
          this.saveMappingDetails();        
        }

      }
    });
  }
}
