import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'worst-loading-sites-days',
  templateUrl: './worst-loading-sites-days.component.html',
  styleUrls: ['./worst-loading-sites-days.component.scss']
})
export class WorstLoadingSitesDaysComponent implements OnInit {
  loadingSlowest7days = [];
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
   this.getLoadingSlowest7days();
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
    getLoadingSlowest7days() {
      this.loadingSlowest7days = [];
      let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
        totalrecord: 3,
        stepno: 0,
        jsonparam: null
      };
      // this.showLoader(index);
      this.api.post('Tmgreport/getLoadingSlowest', params)
        .subscribe(res => {
          console.log('LoadingSlowest7days:', res);
          this.loadingSlowest7days = res['data'];
         // this.hideLoader(index);
        }, err => {
         //  this.hideLoader(index);
          console.log('Err:', err);
        });
    }
}
