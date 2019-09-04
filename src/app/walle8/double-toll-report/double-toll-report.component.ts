import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'double-toll-report',
  templateUrl: './double-toll-report.component.html',
  styleUrls: ['./double-toll-report.component.scss']
})
export class DoubleTollReportComponent implements OnInit {
  dates = {
    start: null,

    end: this.common.dateFormatter(new Date()),
  };
  table = null;
  data = [];
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {
    let today = new Date();
    let start = '';
    let end = '';
    start = this.common.dateFormatter1(today.setDate(today.getDate() - 30));
    this.dates.start = start;
    // end = this.common.dateFormatter1(new Date(today.getDate()));
    this.getdoubleTollReport();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh(){
    this.getdoubleTollReport();
  }

  getDate(date) {
    this.common.params = { ref_page: "card usage" };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.dates);
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
        let center_heading = "Double Toll Report";
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
        let center_heading = "Double Toll Report";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  setTable() {
    let headings = {
      vehreg: { title: 'Vehicle', placeholder: 'Vehicle' },
      remark: { title: 'TOll Plaza', placeholder: '	Toll Plaza' },
      transtime: { title: 'Transac Time', placeholder: 'Transac Time' },
      amount: { title: 'Amount', placeholder: 'Amount' },

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
        vehreg: { value: req.vehreg },
        remark: { value: req.remark },
        regno: { value: req.regno == null ? "-" : req.regno },
        transtime: { value: req.transtime == null ? "-" : req.transtime },
        amount: { value: req.amount == null ? "-" : req.amount },


      };
      columns.push(column);
    });
    return columns;
  }
  getdoubleTollReport() {
    let params = "startDate=" + this.dates.start + "&endDate=" + this.dates.end;
    // console.log("api hit");
    this.common.loading++;
    this.api.walle8Get('TollSummary/getDoubleTollReport.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res);
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
  }
}
