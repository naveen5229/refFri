import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'driver-document',
  templateUrl: './driver-document.component.html',
  styleUrls: ['./driver-document.component.scss','../../pages/pages.component.css']
})
export class DriverDocumentComponent implements OnInit {
  data = { result: [] };
  docdata = [];
  columns = [];
  vehicle_info = [];
  total_recs = 0;
  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
     
    this.getDocumentData();
  }

  ngOnInit() {
  }

  getDocumentData() {
    this.common.loading++;
    this.api.get('Drivers/getDriverDocs')
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.data = res['data'];
        this.total_recs = this.data.result.length;
        if (this.data.result.length) {
          for (var key in this.data.result[0]) {
            if (key.charAt(0) != "_")
              this.columns.push(key);
          }
          console.log("columns");
          console.log(this.columns);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if(pos > 0) {
      return strval.toLowerCase().split('_').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }
  

}
