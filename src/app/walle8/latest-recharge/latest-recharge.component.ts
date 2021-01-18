import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
import { getUrlScheme } from '@angular/compiler';
@Component({
  selector: 'latest-recharge',
  templateUrl: './latest-recharge.component.html',
  styleUrls: ['./latest-recharge.component.scss']
})
export class LatestRechargeComponent implements OnInit {
  data = [];
  mobileno = this.user._details.fo_mobileno;
  userId = this.user._details.id;
  dates = {
    start: null,
    end: null
  }
  table = null;
  total = null;
  constructor(
    public api: ApiService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {
    let today = new Date();
    this.dates.start = this.common.dateFormatter1(new Date(today.setDate(today.getDate() - 1)));

    this.dates.end = this.common.dateFormatter1(new Date());
    //this.getPaymentMade();
    this.getLatestRecharge();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh(){
    this.getLatestRecharge();
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
  //       let center_heading = "Latest Recharge";
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
  //       let center_heading = "Latest Recharge";
  //       this.common.getCSVFromTableId(tblEltId, left_heading, center_heading);
  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });
  // }
  getLatestRecharge() {
    let foid=this.user._loggedInBy=='admin' ? this.user._customer.foid : this.user._details.foid;
    let params = "mobileno=" + this.user._details.fo_mobileno + "&startdate=" + this.dates.start + "&enddate=" + this.dates.end+"&foid="+foid;
    this.common.loading++;
    let response;
    this.api.walle8Get('CardRechargeApi/FoCardRechargeView.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
        for (let i = 0; i < this.data.length; i += 1) {
          this.total += Number(this.data[i].nbal);
        }
        if (this.data == null) {
          this.common.showToast('NO DATA FOUND');
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;
  }
  // setTable() {
  //   let headings = {
  //     vehicle: { title: 'vehicle', placeholder: 'vehicle' },
  //     cardno: { title: 'card Number', placeholder: 'card Number' },
  //     dttime: { title: 'Date', placeholder: 'Date' },
  //     nbal: { title: 'Recharge', placeholder: 'Recharge' },
  //     rema: { title: 'Remark', placeholder: 'Remark' },
  //     // HPCL: { title: 'HPCL', placeholder: 'HPCL' },
  //   };
  //   return {
  //     data: {
  //       headings: headings,
  //       columns: this.getTableColumns()
  //     },
  //     settings: {
  //       hideHeader: true,
  //       tableHeight: "auto"
  //     }
  //   }
  // }
  // getTableColumns() {
  //   let columns = [];
  //   this.data.map(req => {
  //     let column = {
  //       vehicle: { value: req.vehicle },
  //       cardno: { value: req.cardno },
  //       dttime: { value: req.dttime },
  //       nbal: { value: req.nbal == null ? "-" : req.nbal },
  //       rema: { value: req.rema == null ? "-" : req.rema },

  //     };
  //     columns.push(column);
  //   });
  //   return columns;
  // }

  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name,  'Report: '+'Latest-Recharge']
    ];
    this.pdfService.jrxTablesPDF(['latestrecharge'], 'latest-recharge', details);
  }

  printCSV(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name, report:"Report:Latest-Recharge"}
    ];
    this.csvService.byMultiIds(['latestrecharge'], 'latest-recharge', details);
  }
}
