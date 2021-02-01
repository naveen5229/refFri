import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicles-view',
  templateUrl: './vehicles-view.component.html',
  styleUrls: ['./vehicles-view.component.scss']
})
export class VehiclesViewComponent implements OnInit {

  foid = '';
  vehicleViewDetails = [];
  showtable = false;
  is_ncv = [];

  constructor(public api: ApiService, public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal) {
      this.common.refresh = this.refresh.bind(this);


  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    console.log('refresh');
  }


  getFoList(details) {
    this.foid = details.id;
    this.getVehiclesView();
  }

  getVehiclesView() {
    let params = 'foid=' + this.foid;
    console.log('params', params);
    this.common.loading++;
    this.api.getToTranstruckNew('Vehicles/getVehicleWrtFo.json', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ' + res['data']);
        this.vehicleViewDetails = res['data'];
        this.vehicleViewDetails.forEach((element) => {
          if (element.is_ncv == "0" ) {
            this.is_ncv.push(0);
          } 
         else if (element.is_ncv == "1" ) {
            this.is_ncv.push(1);
          }
          else if (element.is_ncv == "2" ) {
            this.is_ncv.push(2);
          }
          else  {
            this.is_ncv.push(0);
          }
          this.showtable = true;
        });
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  changeNcvValue(vid, index) {
    let ncv = this.is_ncv[index];
    let params = {
      id: vid,
      is_ncv: ncv
    };
    this.common.loading++;
    this.api.postToTranstrucknew('Vehicles/updateVehicleCvStatus.json', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('responsecode: ', res['responsecode']);
        if (res['responsecode'] == '1')
          this.common.showToast('Success!!');
        else
          this.common.showToast('Not Success!!');
        this.getVehiclesView();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  closeModal() {
    this.activeModal.close();
  }

}
