import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'most-aged',
  templateUrl: './most-aged.component.html',
  styleUrls: ['./most-aged.component.scss']
})
export class MostAgedComponent implements OnInit {
  challansMostAged = [];
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getChallansMostAged();
  }

  getChallansMostAged() {
    this.challansMostAged = [];
    this.showLoader();
    let params = { totalrecord: 3 };
    this.api.post('Tmgreport/GetChallansMostAged', params)
      .subscribe(res => {
        console.log('challansMostAged:', res);
        this.challansMostAged = res['data'];
        this.hideLoader();
      }, err => {
         this.hideLoader();
        console.log('Err:', err);
      });
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
  showLoader(index = 0) {
    setTimeout(() => {
      let outers = document.getElementsByClassName("challan-2");
      let loader = document.createElement('div');
      loader.className = 'loader';
      console.log('show loader', index, outers[index]);
      outers[index].appendChild(loader);
    }, 50);
  }

  hideLoader(index = 0) {
    try {
      let outers = document.getElementsByClassName("challan-2");
      let ele = outers[index].getElementsByClassName('loader')[0];
      outers[index].removeChild(ele);
    } catch (e) {
      console.log('Exception', e);
    }
  }
}
