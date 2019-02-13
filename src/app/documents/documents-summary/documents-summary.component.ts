import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'documents-summary',
  templateUrl: './documents-summary.component.html',
  styleUrls: ['./documents-summary.component.scss', '../../pages/pages.component.css']
})
export class DocumentsSummaryComponent implements OnInit {
  data = {columns: [], vehicle_info: []};
  columns = [];
  vehicle_info = [];

  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService
    ) {
      this.getDocumentMatrixData();
     }

  ngOnInit() {
  }

  getDocumentMatrixData() {
    this.common.loading++;
    this.api.post('Vehicles/getDocumentMatrixData', {})
        .subscribe(res => {
          this.common.loading--;
          console.log("data", res);
          this.data = res['data'];

                
        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
}
