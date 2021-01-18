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
  selector: 'payments-made',
  templateUrl: './payments-made.component.html',
  styleUrls: ['./payments-made.component.scss']
})
export class PaymentsMadeComponent implements OnInit {
  data = [];
  total = 0;
  userId = this.user._details.id;
  startTime = new Date(new Date().setMonth(new Date().getMonth() - 1));
  endTime = new Date();
  table = null;
  constructor(
    public api: ApiService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {
    this.getPaymentMade();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    this.getPaymentMade();
  }
  getDate(date) {
    this.common.params = { ref_page: "card usage" };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (date == 'start') {
        this.startTime=this.common.dateFormatter(data.date).split(' ')[0];
      }
      if (date == 'end') {
        this.endTime=this.common.dateFormatter(data.date).split(' ')[0];
      }
    });
  }
  getPaymentMade() {
    this.total=0;
    let foid=this.user._loggedInBy=='admin' ? this.user._customer.foid : this.user._details.foid;
    let params = "aduserid=" + this.user._details.id + "&mobileno=" + this.user._details.fo_mobileno + "&startdate=" + this.common.dateFormatter(new Date(this.startTime)) + "&enddate=" + this.common.dateFormatter(new Date(this.endTime))+"&foid="+foid ;
    this.common.loading++;
    let response;
    this.api.walle8Get('PaymentApi/FoPaymentsView.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
        for (let i = 0; i < this.data.length; i += 1) {
          this.total += Number(this.data[i].amt);
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
      ['Name: ' + name,'Start Date: '+this.common.dateFormatter1(this.startTime),'End Date: '+this.common.dateFormatter1(this.endTime),  'Report: '+'Payment-Made']
    ];
    this.pdfService.jrxTablesPDF(['paymentsMade'], 'pqyment-made', details);
  }

  printCSV(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name,startdate:'Start Date:'+this.common.dateFormatter1(this.startTime),enddate:'End Date:'+this.common.dateFormatter1(this.endTime), report:"Report:Payment-Made"}
    ];
    this.csvService.byMultiIds(['paymentsMade'], 'payment-made', details);
  }
}
