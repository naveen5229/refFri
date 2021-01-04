import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';

@Component({
  selector: 'toll-usage-summary',
  templateUrl: './toll-usage-summary.component.html',
  styleUrls: ['./toll-usage-summary.component.scss']
})
export class TollUsageSummaryComponent implements OnInit {
  userId = this.user._details.id;
  mobile=null;
  // dates = {
  //   start: null,
  //   end: null,
  // }
  tollSummary = [];
  data = [];
  total = null;
  table = null;
  startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
  endDate = new Date();
  constructor(
    public api: ApiService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {
    // let today = new Date();
    // this.dates.start = this.common.dateFormatter1(new Date(today.setDate(today.getDate() - 30)));
    // this.dates.end = this.common.dateFormatter1(new Date());

    
    
    // console.log('dates', this.dates.start);
    //this.getDate(0);
    this.gettollUsageSummary();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh(){
    this.gettollUsageSummary();
  }

  // getDate(date) {
  //   this.common.params = { ref_page: "card usage" };
  //   const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
  //     console.log('Date:', this.dates);
  //   });
  // }
  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name,'Start Date: '+this.common.dateFormatter(new Date(this.startDate)),'End Date: '+this.common.dateFormatter(new Date(this.endDate)),  'Report: '+'Toll-Usage-Summary']
    ];
    this.pdfService.jrxTablesPDF(['tollUsageSummary'], 'toll-usage-summary', details);
  }

  printCSV(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name,startdate:'Start Date:'+this.common.dateFormatter(new Date(this.startDate)),enddate:'End Date:'+this.common.dateFormatter(new Date(this.endDate)), report:"Report:Toll-Usage-Summary"}
    ];
    this.csvService.byMultiIds(['tollUsageSummary'], 'toll-usage-summary', details);
  }
  
  gettollUsageSummary() {
    this.mobile=this.user._details.fo_mobileno;
    let foid=this.user._loggedInBy=='admin' ? this.user._customer.foid : this.user._details.foid;
    let params = "startDate=" + this.common.dateFormatter(new Date(this.startDate)) + "&endDate=" + this.common.dateFormatter(new Date(this.endDate))+"&mobileno="+this.mobile +"&foid="+ foid;
    this.common.loading++;
    let response;
    this.api.walle8Get('TollSummary/getTollUsageSummary.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.total=null;
        console.log('Res:', res['data']);
        this.data = res['data'];
        if (this.data == null) {
          this.data = [];
        }
        if(res['data']){
        for (let i = 0; i < this.data.length; i += 1) {
          this.total += Number(this.data[i].tolls);
        }
      }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;
  }
}
