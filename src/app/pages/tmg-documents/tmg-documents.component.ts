import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
}
