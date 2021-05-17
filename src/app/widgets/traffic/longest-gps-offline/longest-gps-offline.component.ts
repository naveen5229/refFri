import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'longest-gps-offline',
  templateUrl: './longest-gps-offline.component.html',
  styleUrls: ['./longest-gps-offline.component.scss']
})
export class LongestGpsOfflineComponent implements OnInit {
  trafficLongestVehicleGpsIssue =[];
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getTrafficLongestVehicleGpsIssue();
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
    getTrafficLongestVehicleGpsIssue() {
      this.trafficLongestVehicleGpsIssue = [];
     // this.showLoader(index);
      let params = {
        totalrecord: 5
      };
      this.api.post('Tmgreport/GetTrafficLongestVehicleGpsIssue', params)
        .subscribe(res => {
          console.log('trafficLongestVehicleGpsIssue:', res['data']);
          this.trafficLongestVehicleGpsIssue = res['data'];
        //  this.hideLoader(index);
        }, err => {
          //this.hideLoader(index);
          console.log('Err:', err);
        });
    }

}
