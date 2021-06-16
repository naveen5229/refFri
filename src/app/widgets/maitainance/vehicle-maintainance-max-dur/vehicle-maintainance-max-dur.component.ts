import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'vehicle-maintainance-max-dur',
  templateUrl: './vehicle-maintainance-max-dur.component.html',
  styleUrls: ['./vehicle-maintainance-max-dur.component.scss']
})
export class VehicleMaintainanceMaxDurComponent implements OnInit {
  challansLatest = [];
  chart2 = {
    type: '',
    data: {},
    options: {},
  };

  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getChallansLatest();
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
    getChallansLatest() {
      this.challansLatest = [];
      let startDate = new Date(new Date().setDate(new Date().getDate() - 180));
      let endDate = new Date();
      let params = { totalrecord: 3 ,
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
      };
     //  this.showLoader(index);
      this.api.post('Tmgreport/GetVehicleMaintainancelongperiod', params)
        .subscribe(res => {
          console.log('challansLatest:', res);
          this.challansLatest = res['data'];
         // this.hideLoader(index);
        }, err => {
          // this.hideLoader(index);
          console.log('Err:', err);
        });
    }
}
