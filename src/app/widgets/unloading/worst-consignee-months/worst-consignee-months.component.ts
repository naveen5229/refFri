import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'worst-consignee-months',
  templateUrl: './worst-consignee-months.component.html',
  styleUrls: ['./worst-consignee-months.component.scss']
})
export class WorstConsigneeMonthsComponent implements OnInit {
  unLoadingWorstConsignee = [];
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getUnLoadingWorstConsignee();

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

    getUnLoadingWorstConsignee() {
      this.unLoadingWorstConsignee = [];
      //this.showLoader(index);
      let startDate = new Date(new Date().setDate(new Date().getDate() - 180));
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
        totalrecord: 3
      };
      this.api.post('Tmgreport/GetUnLoadingWorstConsignee', params)
        .subscribe(res => {
          console.log('UnLoadingWorstConsignee:', res['data']);
          this.unLoadingWorstConsignee = res['data'];
         //this.hideLoader(index);
        }, err => {
         // this.hideLoader(index);
          console.log('Err:', err);
        });
    }
}
