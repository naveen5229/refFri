import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {
  title = '';
  voucherCode = '';
  Detail = [];
  constructor(
    private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {

    // this.voucherCode = this.common.params.vchcode; 

    this.getDayBookDetailList();
    this.common.handleModalSize('class', 'modal-lg', '1250');
  }
  ngOnDestroy(){}
ngOnInit() {
  }

  getDayBookDetailList() {
    let params = {
      vouchertype: this.common.params.vouchertype
    };
    // console.log('vcid', this.common.params);

    this.api.post('Voucher/GetLastRecordData', params)
      .subscribe(res => {
        // this.common.loading--;
        let i = 0;
        (res['data']).map((records, index) => {
          console.log('Res:', records);
          let blanarray = [];
          for (let key in records) {
            // console.log('res data',records[key]);
            if (key == 'y_details') {
              console.log("records[key]", records[key].replace(/{/g,'[').replace(/}/g,']').replace(/\t/g,' '));
              blanarray[key] = JSON.parse(records[key].replace(/{/g,'[').replace(/}/g,']').replace(/\t/g,' '));
            } else {
              blanarray[key] = (records[key]);
            }
           // console.log('blanarray', blanarray);
          }
          i++;

          this.Detail.push(blanarray);

         // console.log('blanarray11', this.Detail);

        })
        console.log('json data', this.Detail);
        //this.Detail = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  filterCostDetails(unFilterData) {
    let costFilter = [];
    console.log('Unfilter:', unFilterData);
    if (unFilterData) {
      let costStr = unFilterData.replace(/'/g, '');
      costStr = costStr.substring(1, costStr.length - 1).replace(/{/g, '').replace(/}/g, '').replace(/"/g, '');
      console.log('Cost STR:', costStr);
      let costArray = costStr.split(',');
      console.log('Cost Array:', costArray);
      costArray.map(cost => {
        costFilter.push(cost)
      })
    }

    return costFilter;


  }
  dismiss(response) {
    //console.log('Accounts:', this.Branches);
    this.activeModal.close({ response: response, test: this.Detail });
  }

}
