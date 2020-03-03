import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'toll-usage',
  templateUrl: './toll-usage.component.html',
  styleUrls: ['./toll-usage.component.scss']
})
export class TollUsageComponent implements OnInit {
  data = [];
  tollUsage = [];
  userId = this.user._details.id;
  cardType = 1;
  table = null;
  dates = {
    start: null,
    end: this.common.dateFormatter(new Date()),
  }
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {
    let today = new Date();
    this.dates.start = this.common.dateFormatter1(new Date(today.setDate(today.getDate() - 1)));
    this.gettollUsage();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh(){
    this.gettollUsage();
  }
  getDate(date) {
    this.common.params = { ref_page: "toll Usage" };
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
        let center_heading = "Toll Usage";
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
        let center_heading = "Toll Usage";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  setTable() {
    let headings = {
      cardno: { title: 'Vehicle', placeholder: 'Vehicle' },
      trtime: { title: 'Transaction Time', placeholder: 'Transaction Time' },
      deal: { title: 'Plaza Name', placeholder: 'Plaza Name' },
      amt: { title: 'Amount', placeholder: 'Amount' },
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
    this.data.map(doc => {
      let column = {
        cardno: { value: doc.cardno },
        trtime: { value: this.common.changeDateformat4(doc.trtime) },
        deal: { value: doc.deal == null ? "-" : doc.deal },
        amt: { value: doc.amt == null ? "-" : parseInt(doc.amt) },
        //HPCL: { value: doc.hpcl == null ? "-" : doc.hpcl },
      };
      columns.push(column);
    });
    return columns;
  }
  gettollUsage() {


    let params = "startDate=" + this.dates.start + "&endDate=" + this.dates.end;

    // console.log('.......,', params);
    this.common.loading++;
    let response;
    this.api.walle8Get('TollSummary/getEntireTollUsage.json?' + params)
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

}
