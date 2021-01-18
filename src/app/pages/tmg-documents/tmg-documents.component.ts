import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'tmg-documents',
  templateUrl: './tmg-documents.component.html',
  styleUrls: ['./tmg-documents.component.scss']
})
export class TmgDocumentsComponent implements OnInit {
currentStatus = [];
  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal) {
    this.getCurrentStatus();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.getCurrentStatus();
  
  }

  getCurrentStatus(){
    this.currentStatus = [];
    ++this.common.loading;
    let params = { totalrecord: 3 };
    this.api.post('Tmgreport/GetDocsDetails', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('currentStatus:', res);
        this.currentStatus = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }
  getDetials(url, params, value = 0,type='days') {
    let dataparams = {
      view: {
        api: url,
        param: params,
        type: 'post'
      },
  
      title: 'Details'
    }
    if (value) {
      let startDate = type == 'months'? new Date(new Date().setMonth(new Date().getMonth() - value)): new Date(new Date().setDate(new Date().getDate() - value));
      let endDate = new Date();
      dataparams.view.param['fromdate'] = this.common.dateFormatter(startDate);
      dataparams.view.param['todate'] = this.common.dateFormatter(endDate);
    }
    console.log("dataparams=", dataparams);
    this.common.handleModalSize('class', 'modal-lg', '1100');
    this.common.params = { data: dataparams };
    const activeModal = this.modalService.open(GenericModelComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
}
