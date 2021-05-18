import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'longest-pending-vsc-tat',
  templateUrl: './longest-pending-vsc-tat.component.html',
  styleUrls: ['./longest-pending-vsc-tat.component.scss']
})
export class LongestPendingVscTatComponent implements OnInit {
  alertVscPending =[];
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getAlertVscPending();
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
    getAlertVscPending(){
      this.alertVscPending = [];
      // this.showLoader(index);
      let startDate =new Date(new Date().setDate(new Date().getDate() - 30));
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
        totalrecord:3
      };
      this.api.post('Tmgreport/GetAlertVscPending', params)
        .subscribe(res => {
          console.log('alertVscPending:', res['data']);
          this.alertVscPending = res['data'];
         // this.hideLoader(index);
        }, err => {
         //  this.hideLoader(index);
          console.log('Err:', err);
        });
    }
}
