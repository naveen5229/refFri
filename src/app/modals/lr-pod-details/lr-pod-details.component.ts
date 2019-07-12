import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'lr-pod-details',
  templateUrl: './lr-pod-details.component.html',
  styleUrls: ['./lr-pod-details.component.scss']
})
export class LrPodDetailsComponent implements OnInit {

  dropDown = [
    { name: 'Shortage', id: 1 },
    { name: 'Shortage(%) ', id: 2 },
    { name: 'Entry Date', id: 3 },
    { name: 'Exit Date', id: 4 },
    { name: 'Detention', id: 5 },
    { name: 'Damage remark', id: 6 },
    { name: 'Other Remark', id: 7 },
  ];

  data = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  headings = [];
  valobj = {};
  
  Details = [{
    detail_type:1,
    param_value: null,
    param_date: null,
    param_remarks: null,
  }]

  constructor(public activeModal:NgbActiveModal,
    public common:CommonService,
    public api:ApiService) {
      console.log("id",this.common.params)
   // this.common.handleModalSize('class', 'modal-lg', '2000');
   }

  ngOnInit() {
  }

  dismiss() {
    this.activeModal.close();
  }

  addMore() {
    this.Details.push({
      detail_type:1,
      param_value: null,
      param_date: null,
      param_remarks: null,
    });
  }

  saveLrPodDetail(){
    const params={
      lrPodDetails:JSON.stringify(this.Details),
      podId:this.common.params,
    }
    console.log("para", params)
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/saveLrPodDetails',params)
      .subscribe(res => {
        this.common.loading--;
        this.data = [];
        this.table = {
          data: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        this.valobj = {};
        if (!res['data']) return;
        this.data = res['data'];
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
        console.log('Api Response:', res);
        // if (res['data'][0].y_id > 0) {
        //   this.common.showToast(res['data'][0].y_msg);
        //   this.activeModal.close();
        // }
        // else {
        //   this.common.showError(res['data'][0].y_msg)
        // }
      },
        err =>{
          this.common.loading--;
          console.error('Api Error:', err);
        }) ;
  // }
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("Type", this.headings[i]);
        console.log("doc index value:", doc[this.headings[i]]);
       
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    });
    return columns;
  }

}
