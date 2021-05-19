import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'longest-onward-halt',
  templateUrl: './longest-onward-halt.component.html',
  styleUrls: ['./longest-onward-halt.component.scss']
})
export class LongestOnwardHaltComponent implements OnInit {
  consignmentLongestOnwardHalt =[];
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getConsignmentLongestOnwardHalt();
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
    getConsignmentLongestOnwardHalt() {
      this.consignmentLongestOnwardHalt = [];
      // this.showLoader(index);
      let startDate = new Date(new Date().setDate(new Date().getDate() - 15));
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
        totalrecord:6
      };
      this.api.post('Tmgreport/GetConsignmentLongestOnwardHalt', params)
        .subscribe(res => {
          console.log('ConsignmentLongestOnwardHalt:', res);
          this.consignmentLongestOnwardHalt = res['data'];
         // this.hideLoader(index);
        }, err => {
          // this.hideLoader(index);
          console.log('Err:', err);
        });
    }
}
