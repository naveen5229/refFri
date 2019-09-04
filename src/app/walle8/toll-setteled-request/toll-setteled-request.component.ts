import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'toll-setteled-request',
  templateUrl: './toll-setteled-request.component.html',
  styleUrls: ['./toll-setteled-request.component.scss']
})
export class TollSetteledRequestComponent implements OnInit {
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
    this.dates.start = this.common.dateFormatter1(today.setDate(today.getDate() - 1));
    this.gettollSetteledReq();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh(){
    this.gettollSetteledReq();
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
        let center_heading = "Toll Setteled Request";
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
        let center_heading = "Toll Setteled Request";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  setTable() {
    let headings = {
      toll_usage_id: { title: 'Toll Id', placeholder: 'Toll Id' },
      toll_plaza: { title: 'TOll Plaza', placeholder: '	Toll Plaza' },
      regno: { title: 'Registration No', placeholder: 'Registration No' },
      transtime: { title: 'transtime', placeholder: 'Transmit Time' },
      amount: { title: 'Amount', placeholder: 'Amount' },
      issueid: { title: 'Issue Type', placeholder: 'Issue Type' },
      issue_remark: { title: 'Issue Remark', placeholder: 'Issue Remark' },
      status: { title: 'status', placeholder: 'status' },
      cashback: { title: 'cashback', placeholder: 'cashback' },
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
        toll_usage_id: { value: req.toll_usage_id },
        toll_plaza: { value: req.toll_plaza },
        regno: { value: req.regno == null ? "-" : req.regno },
        transtime: { value: req.transtime == null ? "-" : req.transtime },
        amount: { value: req.amount == null ? "-" : req.amount },
        issueid: { value: req.issueid == null ? "-" : req.issueid },
        issue_remark: { value: req.issue_remark == null ? "-" : req.issue_remark },
        status: { value: req.status == null ? "-" : req.status },
        cashback: { value: req.cashback == null ? "-" : req.cashback },


      };
      columns.push(column);
    });
    return columns;
  }
  gettollSetteledReq() {
    let params = "startDate=" + this.dates.start + "&endDate=" + this.dates.end;
    //  console.log("api hit");
    this.common.loading++;
    this.api.walle8Get('TollSummary/getTollSettledRequests.json?' + params)
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
