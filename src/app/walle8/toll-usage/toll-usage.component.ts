import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
@Component({
  selector: 'toll-usage',
  templateUrl: './toll-usage.component.html',
  styleUrls: ['./toll-usage.component.scss']
})
export class TollUsageComponent implements OnInit {
  data = [];
  total=0;
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
    private pdfService: PdfService,
    private csvService: CsvService,
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

  gettollUsage() {
    this.total=0;
    let params = "startDate=" + this.dates.start + "&endDate=" + this.dates.end;
    this.common.loading++;
    let response;
    this.api.walle8Get('TollSummary/getEntireTollUsage.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
        if(res['data']){
          for (let i = 0; i < this.data.length; i += 1) {
            this.total += Number(this.data[i].amt);
          }
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;
  }

  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name,'Start Date: '+this.common.dateFormatter1(this.dates.start),'End Date: '+this.common.dateFormatter1(this.dates.end),  'Report: '+'Toll-Usage']
    ];
    this.pdfService.jrxTablesPDF(['tollUsage'], 'toll-usage', details);
  }

  printCSV(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name,startdate:'Start Date:'+this.common.dateFormatter1(this.dates.start),enddate:'End Date:'+this.common.dateFormatter1(this.dates.end), report:"Report:Toll-Usage"}
    ];
    this.csvService.byMultiIds(['tollUsage'], 'toll-usage', details);
  }
}
