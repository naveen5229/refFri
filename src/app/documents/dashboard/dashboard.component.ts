import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Body } from '@angular/http/src/body';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../../pages/pages.component.css']
})
export class DashboardComponent implements OnInit {

  documentData = [];
  constructor( public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
      this.getDocumentData();
     }

  ngOnInit() {
  }

getDocumentData(){
console.log("hii");
//let foAdminId= this.api.;
// console.log("my foid ",foAdminId);
this.common.loading++;
    this.api.post('Vehicles/getDocumentsStatistics', {})
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.documentData = res['data'];
   
        
      }, err => {
        this.common.loading--;
        console.log(err);
      });


}

}
