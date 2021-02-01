import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'freight-rate-summary',
  templateUrl: './freight-rate-summary.component.html',
  styleUrls: ['./freight-rate-summary.component.scss']
})
export class FreightRateSummaryComponent implements OnInit {

  rateType='wt';
  lrFo=[];
  param="";
  patternId=null;
  frightSummary=[];


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
    constructor(public modalService: NgbModal,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService
  ) {
    console.log("paramId:",this.common.params.id);
    this.lrFoDetail();
   }

  ngOnDestroy(){}
ngOnInit() {

  }

  lrFoDetail()
  {
    this.api.get('Suggestion/lrFoFields?sugId=0&reportType=lr')
      .subscribe(res => {
        console.log("lrfo:", res['data']);
        this.lrFo=res['data'];

        
        console.log("lrFoData:",this.lrFo);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  FreightRateSummary()
  {
    let params = {
      patternId:this.common.params.id,
      param:this.param,
      rateType:this.rateType,
    };
    ++this.common.loading;
    this.api.post("FrieghtRate/getFrieghtRateSummary", params)
      .subscribe(res => {
        --this.common.loading;
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
      }, err => {
        --this.common.loading;
        console.log('Error: ', err);
      });
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

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  closeModal() {
    this.activeModal.close();
  }

}
