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
  data = [];

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
    this.api.post('Vehicles/getDocumentMatrixData', { x_foid: 687 })
        .subscribe(res => {
          this.common.loading--;
          console.log("data", res);
          this.data = res['data'];

          var strheader = "";
          if(typeof this.data.columns != "undefined") {
            var num_columns = this.data.columns.length;
            for(var i = 0; i < this.data.columns.length; i++) {
              strheader = strheader + "<th>" + this.data.columns[i] + "</th>";
            }
            document.getElementById('doc-th').innerHTML = strheader;

            
            if(typeof this.data.vehicle_info == "undefined") {
              document.getElementById('doc-tb').innerHTML = "<tr><td colspan=" + num_columns + ">No records</td></tr>";
            } else {
              var strbody = "";
              var num_rows = this.data.vehicle_info.length;
              for(var i = 0; i < num_rows; i++) {
                strbody = strbody + "<tr>";
                
                for(var j = 0; j < this.data.columns.length; j++) {
                  var colname = this.data.columns[j];
                  if(this.data.vehicle_info[i][colname]) {
                    if(colname.toLowerCase() == "vehicle no")
                      strbody = strbody + "<td>" + this.data.vehicle_info[i][colname] + "</td>";
                    else
                      strbody = strbody + "<td><a target='_blank' href='" + this.data.vehicle_info[i][colname]  + "'>View</a></td>";
                  } else {
                    strbody = strbody + "<td><a target='_blank' href='javascript: void(0);'>No</a></td>";
                  }
                }
                strbody = strbody + "</tr>";
              }
              document.getElementById("doc-tb").innerHTML = strbody;
            }
          }
                
        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
}
