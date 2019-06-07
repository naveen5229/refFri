import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'other-usage',
  templateUrl: './other-usage.component.html',
  styleUrls: ['./other-usage.component.scss']
})
export class OtherUsageComponent implements OnInit {
  data = [];
  dates = {
    start: this.common.dateFormatter(new Date()),
    end: this.common.dateFormatter(new Date())
  };
  total = null;
  // mobileno = 9812929999;
  //userId=946;
  table = null;
  constructor(
    public common: CommonService,
    public api: ApiService,
    public modalService: NgbModal,
    public user: UserService) {
    // this.mobileno=this.user._details.mobile;
    this.getOtherUsageDetail();
  }

  ngOnInit() {
  }
  getOtherUsageDetail() {
    // this.userId=this.user

    let params = "aduserid=" + this.user._details.id + "&mobileno=" + this.user._details.mobile + "&startdate=" + this.dates.start + "&enddate=" + this.dates.end;
    //console.log("api hit");
    this.common.loading++;
    this.api.walle8Get('AccountSummaryApi/ViewOtherUsages.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res);
        this.data = res['data'];
        for (let i = 0; i < this.data.length; i++) {
          this.total = this.total + this.data[i].amt;
        }
        // this.table=this.setTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  getDate(date) {
    this.common.params = { ref_page: 'other-usage' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
        console.log('Date:', this.dates[date]);
      }

    });
  }
  printPDF(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = fodata['name'];
        let center_heading = "Other Usage";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  printCSV(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = fodata['name'];
        let center_heading = "Other Usage";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

}
