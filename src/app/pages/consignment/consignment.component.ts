import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'consignment',
  templateUrl: './consignment.component.html',
  styleUrls: ['./consignment.component.scss']
})
export class ConsignmentComponent implements OnInit {
  Reports:any;
  reporttype='';
  constructor(private api: ApiService, private modalService: NgbModal, private common: CommonService) { }

  ngOnInit(): void {
  }

  getDynamicReports() {
    
    this.common.loading++;
    this.api.get('tmgreport/getConsignmentCols?typename='+this.reporttype)
      .subscribe(res => {
        this.common.loading--;
        console.log('getConsignmentCols:', res);
        this.Reports = res['data'];
       

      }, err => {
        console.log(err);
        this.common.loading--;
      })
  }
}
