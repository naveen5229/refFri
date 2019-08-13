import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getUrlScheme } from '@angular/compiler';
@Component({
  selector: 'card-usage',
  templateUrl: './card-usage.component.html',
  styleUrls: ['./card-usage.component.scss', '../../pages/pages.component.css']
  // './../../pages/pages.component.css'
})
export class CardUsageComponent implements OnInit {
  cardUsage = [];
  total = 0;

  iocl = 0;
  bpcl = 0;
  atm = 0;
  hpcl = 0;
  tolls = 0;

  dates = {
    start: null,
    end: this.common.dateFormatter(new Date()),
  }
  // userId = '946';
  // mobileno = 9812929999;
  // startdate = '1/5/2019';
  // enddate = '31/5/201'
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {
    let today = new Date();
    this.dates.start = this.common.dateFormatter1(new Date(today.setDate(today.getDate() - 30)));
    this.getcardUsage();
    this.calculateTotal();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh(){
    this.getcardUsage();
    this.calculateTotal();
  }
  ngAfterViewInit() {


  }

  getDate(date) {
    this.common.params = { ref_page: "card usage" };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (date == 'start') {
        this.dates.start = this.common.dateFormatter(data.date).split(' ')[0];
      }
      if (date == 'end') {
        this.dates.end = this.common.dateFormatter(data.date).split(' ')[0];
      }

    });
  }
  getcardUsage() {


    let params = "aduserid=" + this.user._details.id + "&mobileno=" + this.user._details.fo_mobileno + "&startdate=" + this.dates.start + "&enddate=" + this.dates.end;

    this.common.loading++;
    let response;
    this.api.walle8Get('AccountSummaryApi/ViewCardUsages.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.cardUsage = res['data'];
        for (let i = 0; i < this.cardUsage.length; i += 1) {

          this.iocl += Number(this.cardUsage[i].iocl);
          this.bpcl += Number(this.cardUsage[i].bpcl);
          this.hpcl += Number(this.cardUsage[i].hpcl);
          this.atm += Number(this.cardUsage[i].atm);
          this.tolls += Number(this.cardUsage[i].tolls);
          console.log('............', this.tolls);
        }

        this.total = Number(this.total) + Number(this.tolls) + Number(this.iocl) + Number(this.bpcl) + Number(this.hpcl) + Number(this.atm);
        console.log('card', this.total);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }

  calculateTotal() {


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
        let center_heading = "Card Usage";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, null, '');
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
        let center_heading = "Card Usage";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
