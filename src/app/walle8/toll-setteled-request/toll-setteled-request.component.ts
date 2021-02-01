import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'toll-setteled-request',
  templateUrl: './toll-setteled-request.component.html',
  styleUrls: ['./toll-setteled-request.component.scss']
})
export class TollSetteledRequestComponent implements OnInit {
  
  startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
  endDate = new Date();
  table = null;
  data = [];
  constructor(
    public api: ApiService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {
    this.gettollSetteledReq();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    this.gettollSetteledReq();
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
    let foid=this.user._loggedInBy=='admin' ? this.user._customer.foid : this.user._details.foid;
    let params ="&startDate=" + this.common.dateFormatter(new Date(this.startDate)) + "&endDate=" + this.common.dateFormatter(new Date(this.endDate))+"&mobileno=" + this.user._details.fo_mobileno+"&foid="+ foid;
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

  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name,'Start Date: '+this.common.dateFormatter(new Date(this.startDate)),'End Date: '+this.common.dateFormatter(new Date(this.endDate)),  'Report: '+'Toll-Setteled']
    ];
    this.pdfService.jrxTablesPDF(['tollsettel'], 'toll-setteled', details);
  }

  printCSV(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name,startdate:'Start Date:'+this.common.dateFormatter(new Date(this.startDate)),enddate:'End Date:'+this.common.dateFormatter(new Date(this.endDate)), report:"Report:Toll-Setteled"}
    ];
    this.csvService.byMultiIds(['tollsettel'], 'toll-setteled', details);
  }

}
