import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'card-balance',
  templateUrl: './card-balance.component.html',
  styleUrls: ['./card-balance.component.scss']
})
export class CardBalanceComponent implements OnInit {
  data = [];
  total = 0;
  tollTotal=0;
  sum = {
    bpcl: 0,
    hpcl: 0,
    atm: 0,
  }
  vehicle = [{}];

  mobileno = this.user._details.mobileno;
  userId = this.user._details.id;
  dates = {
    start: this.common.dateFormatter(new Date()),
    end: this.common.dateFormatter(new Date()),
  }
  table = null;
  constructor(
    public common: CommonService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public api: ApiService,
    public modalService: NgbModal,
    public user: UserService) {
     this.common.refresh = this.refresh.bind(this);
     console.log("Detailsssss:",this.user._details);
    this.getCardBalance()
    //  let today = new Date();
    //  this.dates.start = today.setDate(today.getDate() - 1);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    this.getCardBalance();
  }
  getDate(date) {
    this.common.params = { ref_page: "card usage" };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.dates);
    });
  }
  getCardBalance() {
    let params = "aduserid=" + this.user._details.id + "&mobileno=" + this.user._details.fo_mobileno + "&startdate=" + this.dates.start + "&enddate=" + this.dates.end;
    console.log("api hit");
    this.common.loading++;
    this.api.walle8Get('AccountSummaryApi/ViewCardBalance.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res);
        this.data = res['data'];
        for (let i = 0; i < this.data.length; i++) {
          // console.log('.........', this.cardUsage[i].iocl);
          //console.log('tolls', this.cardUsage[i].tolls)

          //  this.sum.vehicle = this.sum.iocl + this.cardUsage[i].iocl;
          this.sum.bpcl = this.sum.bpcl + this.data[i].bpcl;
          this.sum.hpcl = this.sum.hpcl + this.data[i].hpcl;
          this.sum.atm = this.sum.atm + this.data[i].atm;
          console.log('............', this.sum);




        }
        this.tollTotal=0;
       this.tollTotal= this.data.reduce((a, b) => +a + +b.tolls, 0);
        this.total = this.total + this.sum.bpcl + this.sum.hpcl + this.sum.atm;
        console.log('card', this.total);
        // this.table=this.setTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  // printPDF(tblEltId) {
  //   this.common.loading++;
  //   let userid = this.user._customer.id;
  //   if (this.user._loggedInBy == "customer")
  //     userid = this.user._details.id;
  //   this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
  //     .subscribe(res => {
  //       this.common.loading--;
  //       let fodata = res['data'];
  //       let left_heading = fodata['name'];
  //       let center_heading = "Card Balance";
  //       this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, null, '');
  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });
  // }

  // printCSV(tblEltId) {
  //   this.common.loading++;
  //   let userid = this.user._customer.id;
  //   if (this.user._loggedInBy == "customer")
  //     userid = this.user._details.id;
  //   this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
  //     .subscribe(res => {
  //       this.common.loading--;
  //       let fodata = res['data'];
  //       let left_heading = fodata['name'];
  //       let center_heading = "Card Balance";
  //       this.common.getCSVFromTableId(tblEltId, left_heading, center_heading,["Action"],'');
  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });
  // }

  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.foName;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name,  'Report: '+'Card-Balance']
    ];
    this.pdfService.jrxTablesPDF(['cardBalance'], 'card-balance', details);
  }

  printCSV(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.foName;
    let details = [
      { name: 'Name:' + name,report:"Report:Card-Balance"}
    ];
    this.csvService.byMultiIds(['cardBalance'], 'card-balance', details);
  }

}
