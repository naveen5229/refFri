import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
import { getUrlScheme } from '@angular/compiler';
import { now } from 'moment';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'toll-discount',
  templateUrl: './toll-discount.component.html',
  styleUrls: ['./toll-discount.component.scss']
})
export class TollDiscountComponent implements OnInit {
  params = null;
  discounts = null;
  discount = null;
  tollDiscount = [];
  dates = {
    start: '',
    end: '',
  }
  foid = this.user._details.id;
  total: number;
  singleValue = [];
  data = [];
  table = null;
  constructor(
    public api: ApiService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {
    let today = new Date();
    this.dates.start = this.common.dateFormatter1(new Date(today.getFullYear(), today.getMonth() - 12, 1, 0, 0, 0)) 
    this.dates.end = this.common.dateFormatter1(today)
    this.getdetails();
    //  this.getdiscountDetails();
    // this.calculateTotal();
    this.getdiscountDetails(0);
    this.gettollDiscount();
    this.common.refresh = this.refresh.bind(this);

    //this.calculateTotal();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    this.getdetails();
    this.getdiscountDetails(0);
    this.gettollDiscount();
  }
  getDate(date) {
    this.common.params = { ref_page: "card usage" };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.dates);
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
  //       let center_heading = "Toll Discount";
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
  //       let center_heading = "Toll Discount";
  //       this.common.getCSVFromTableId(tblEltId, left_heading, center_heading);
  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });
  // }


  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name,'Start Date: '+this.common.dateFormatter1(this.dates.start),'End Date: '+this.common.dateFormatter1(this.dates.end),  'Report: '+'Toll-Discount']
    ];
    this.pdfService.jrxTablesPDF(['tollDiscount'], 'toll-discount', details);
  }

  printCSV(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name,startdate:'Start Date:'+this.common.dateFormatter1(this.dates.start),enddate:'End Date:'+this.common.dateFormatter1(this.dates.end), report:"Report:Toll-Discount"}
    ];
    this.csvService.byMultiIds(['tollDiscount'], 'toll-discount', details);
  }

  sortDiscount(discounts) {
    discounts.sort((a, b) => {
      return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);
    });
    console.log(discounts);
    this.discounts = discounts;
  }
  calculateTotal(discount) {
    for (let i = 0; i < discount.length; i++) {
      let overall
      return overall = parseInt(discount[i].fdisc) + parseInt(discount[i].tdisc);
      //return overall;


    }


    // this.total = 
  }


  gettollDiscount() {
    let foid=this.user._loggedInBy=='admin' ? this.user._customer.foid : this.user._details.foid;
    let params = "mobileno=" + this.user._details.fo_mobileno+"&foid="+foid;
    this.common.loading++;
    let response;
    this.api.walle8Get('DiscountApi/getUserDiscountHistory.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.tollDiscount = res['data'];
        console.log('..........', this.tollDiscount);

        if (res['responsecode'] == 1) {
          this.sortDiscount(this.tollDiscount);
          this.total = this.calculateTotal(this.tollDiscount);


          console.log('total', this.total);
        }


      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }
  getdiscountDetails(detailId) {
    console.log(detailId);
    let today = new Date();
    let start = '';
    let end = '';
    switch (detailId) {
      case 1:
        console.log("Here1");
        start = this.common.dateFormatter1(new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0));
        this.dates.start = start;
        end = this.common.dateFormatter1(new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0));
        this.dates.end = end;
        this.getdetails();
        break;
      case 2:
        start = this.common.dateFormatter1(new Date(today.getFullYear(), today.getMonth() - 2, 1, 0, 0, 0));
        this.dates.start = start;
        end = this.common.dateFormatter1(new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0));
        this.dates.end = end;
        this.getdetails();
        break;
      case 3:
        start = this.common.dateFormatter1(new Date(today.getFullYear(), today.getMonth() - 3, 1, 0, 0, 0));
        this.dates.start = start;
        end = this.common.dateFormatter1(new Date(today.getFullYear(), today.getMonth() - 2, 1, 0, 0, 0));
        this.dates.end = end;
        this.getdetails();
        break;
      case 4:
        start = this.common.dateFormatter1(new Date(today.getFullYear(), today.getMonth() - 6, 1, 0, 0, 0));
        this.dates.start = start;
        end = this.common.dateFormatter1(new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0));
        this.dates.end = end;
        this.getdetails();
        break;
      case 5:
        start = this.common.dateFormatter1(new Date(today.getFullYear(), today.getMonth() - 12, 1, 0, 0, 0));
        this.dates.start = start;
        end = this.common.dateFormatter1(new Date());
        this.dates.end = end;
        this.getdetails();
        break;
    }
    // console.log('start', start, 'end', end);



  }
  getdetails() {

    let today = new Date();

    let params = "mobileNo=" + this.user._details.fo_mobileno + "&startDate=" + this.common.dateFormatter1(new Date(today.getFullYear(), today.getMonth() - 12, 1, 0, 0, 0)) + "&endDate=" + this.common.dateFormatter1(today) ;

    this.common.loading++;
    let response;
    this.api.walle8Get('TollSummary/getTollDiscount.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
        if (this.data == null) {
          this.data = [];
          this.table = null;
          return;
        }
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }
  setTable() {
    let headings = {
      transdate: { title: 'Date', placeholder: 'Date' },
      amount: { title: 'Amount', placeholder: 'Amount' },
      remark: { title: 'Remark', placeholder: 'Remark' },
      disc_type: { title: 'Discount Type', placeholder: 'Discount Type' },
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "auto"
      }
    }
  }
  getTableColumns() {
    let columns = [];
    this.data.map(req => {
      let column = {
        transdate: { value: req.transdate == null ? "-" : this.common.changeDateformat4(req.transdate) },
        amount: { value: req.amount == null ? "-" : req.amount },
        remark: { value: req.remark == null ? "-" : req.remark },
        disc_type: { value: req.disc_type == null ? "-" : req.disc_type },



      };
      columns.push(column);
    });
    return columns;
  }

}
