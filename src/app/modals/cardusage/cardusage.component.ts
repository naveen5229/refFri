import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IssueReportComponent } from '../issue-report/issue-report.component';
import { CsvService } from '../../services/csv/csv.service';
import { PdfService } from '../../services/pdf/pdf.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'cardusage',
  templateUrl: './cardusage.component.html',
  styleUrls: ['./cardusage.component.scss']
})
export class CardusageComponent implements OnInit {
  totalAmount=0;
  cardUsage = [];
  total = 0;
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService, private pdfService: PdfService,
    private activeModal: NgbActiveModal, private csvService: CsvService,
    public modalService: NgbModal) {
    this.getcardUsage();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  getcardUsage() {
    let params = "vehid=" + this.common.params.vehicleid + "&startdate=" + this.common.params.startdate + "&enddate=" + this.common.params.enddate;
    this.common.loading++;
    this.api.walle8Get('AccountSummaryApi/ViewSingleVehicleReport.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.cardUsage = res['data'];
        if(this.cardUsage){
          this.totalAmount=this.cardUsage.reduce((a, b) => +a + +b.amount, 0);
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  closeModal() {
    this.activeModal.close();
  }

  openImageUploadModal(cardDetail) {
    let cardUsage = {
      id: cardDetail.id,
      vehId: this.common.params.vehicleid
    }
    this.common.params = { cardUsage: cardUsage }
    const activeModal = this.modalService.open(IssueReportComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
    });
  }

  downloadCSV() {
    let details = [
      { name: 'Name:' + this.common.params.name,vehicle:'Vehicle:'+this.common.params.vehicleName ,report:"Report:Card-Usage",
       startDate: 'Start Date: ' + this.common.params.startdate, endDate: 'End Date: ' + this.common.params.enddate }
    ];
    this.csvService.byMultiIds(['card-usage-details'], 'card-usages', details);
  }

  downloadPDF() {
    let details = [
      ['Name: ' + this.common.params.name,'Vehicle: '+this.common.params.vehicleName,  'Report: '+'Card-Usage'],
      ['Start Date: ' + this.common.params.startdate, 'End Date: ' + this.common.params.enddate]
    ];
    this.pdfService.jrxTablesPDF(['card-usage-details'], 'card-usages', details);
  }

}
