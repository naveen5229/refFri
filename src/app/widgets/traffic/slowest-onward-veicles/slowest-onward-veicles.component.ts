import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'slowest-onward-veicles',
  templateUrl: './slowest-onward-veicles.component.html',
  styleUrls: ['./slowest-onward-veicles.component.scss']
})
export class SlowestOnwardVeiclesComponent implements OnInit {
  trafficSlowestOnwardVehicles = [];
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getTrafficSlowestOnwardVehicles();
    }
    getDetials(url, params, value = 0, type = 'days') {
      let dataparams = {
        view: {
          api: url,
          param: params,
          type: 'post'
        },
  
        title: 'Details'
      }
      if (value) {
        let startDate = type == 'months' ? new Date(new Date().setMonth(new Date().getMonth() - value)) : new Date(new Date().setDate(new Date().getDate() - value));
        let endDate = new Date();
        dataparams.view.param['fromdate'] = this.common.dateFormatter(startDate);
        dataparams.view.param['todate'] = this.common.dateFormatter(endDate);
      }
      console.log("dataparams=", dataparams);
      this.common.handleModalSize('class', 'modal-lg', '1100');
      this.common.params = { data: dataparams };
      const activeModal = this.modalService.open(GenericModelComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    }
    getTrafficSlowestOnwardVehicles() {
      this.trafficSlowestOnwardVehicles = [];
      //this.showLoader(index);
      let params = {
        totalrecord: 3
      };
      this.api.post('Tmgreport/GetTrafficSlowestOnwardVehicles', params)
        .subscribe(res => {
          console.log('trafficSlowestOnwardVehicles:', res['data']);
          this.trafficSlowestOnwardVehicles = res['data'];
         // this.hideLoader(index);
        }, err => {
        //  this.hideLoader(index);
          console.log('Err:', err);
        });
    }

}
