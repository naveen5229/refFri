import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../services/pdf/pdf.service';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';

@Component({
  selector: 'financial-account-summary',
  templateUrl: './financial-account-summary.component.html',
  styleUrls: ['./financial-account-summary.component.scss']
})
export class FinancialAccountSummaryComponent implements OnInit {
  dates = {
    currentdate: this.common.dateFormatter1(new Date()),

    start: null,

    end: this.common.dateFormatter1(new Date()),
  };
  fo = {
    id: null,
    name: null,
    mobileNo: null
  }
  result = [];
  data = [];
  openingBalance = 0;
  closingBalance = 0;
  creditAmount = 0;
  debitAmount = 0;
  vehid = this.user._details.vehid;
  mobileno = this.user._details.mobileno;
  foAgents = [];
  constructor(public api: ApiService,
    public pdfService: PdfService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal, ) {
    this.dates.start = this.common.dateFormatter1(new Date(new Date().setDate(new Date().getDate() - 15)));
  }

  ngOnInit() {
  }

  refresh() {
  }

  calculateAmount(arr) {
    let usageStatus = arr[0]['entry_type'];
    let opening_balance_new = arr[0]['balance'];
    let usageAmount = arr[0]['amount'];

    if ((usageStatus).toLowerCase != "usage") {
      this.openingBalance = parseInt(opening_balance_new) + usageAmount;
    }
    else {
      this.openingBalance = parseInt(opening_balance_new) - (usageAmount);
    }
    this.closingBalance = arr[(arr.length - 1)]['balance'];
  }
  getDate(date) {
    this.common.params = { ref_page: "card usage" };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.dates);
    });
  }



  getaddTimeFinancialTollReport() {
    let params = "&startDate=" + this.dates.start + "&endDate=" + this.dates.end + "&mobileno=" + this.fo.mobileNo;
    this.common.loading++;
    this.api.walle8Get('FinancialAccountSummary/getFinancialAccountSummaryAddTime.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res);
        if (res && res['data']) {
          this.result = res['data'];
          this.data = res['data'];
          this.openingBalance = this.data[0]['amount'];
          this.closingBalance = this.data[this.data.length - 1]['amount'];
          this.calculateAmount(this.data);
        }
        else {
          this.common.showError("data not found");
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  selectFo(fo) {
    this.fo.id = fo.foid;
    this.fo.name = fo.name;
    this.fo.mobileNo = fo.mobileno;
  }

  getFoAgents() {
    let search = document.getElementById('agentFo')['value'];
    console.log("searvh ", search)
    this.api.walle8Get('Suggestion/getFoAgents.json?search=' + search)
      .subscribe(res => {
        console.log("res", res);
        this.foAgents = res['data'];
        console.log("-0-0-0", this.foAgents);
      }, err => {
        console.log(err);
      });
  }
  typedKey = '';
  filterData(event) {
    this.data = this.result.filter((ele) => {
      if (!this.typedKey)
        return true;
      else
        return ele.vehid ? ele.vehid.toLowerCase().includes(this.typedKey) : false;
    })
  }

  // multiPagePDF(id = "report", name = "report") {
  //   const scale = 1;
  //   html2canvas(document.getElementById(id), { scale, useCORS: true }).then(canvas => {
  //     let doc = new jsPDF("p", "mm");
  //     let images = this.imageSlicer(
  //       canvas,
  //       Math.ceil(Math.ceil(canvas.height / 1150) / scale),
  //       scale
  //     );
  //     for (let i = 0; i < images.length; i++) {
  //       doc.addImage(images[i], "PNG", 10, 10, 200, 275);
  //       if (i < images.length - 1) doc.addPage();
  //     }
  //     doc.save(name + ".pdf");
  //   });
  // }

  // imageSlicer(image, imageCount, scale = 1) {
  //   console.log(imageCount);
  //   let images = [];
  //   console.log('image.width:', image.width);
  //   const widthOfOnePiece = (image.width + 65) * scale;
  //   const heightOfOnePiece = 1205 * scale;
  //   for (let y = 0; y < imageCount; y++) {
  //     let canvas = document.createElement("canvas");
  //     canvas.width = widthOfOnePiece;
  //     canvas.height = heightOfOnePiece;
  //     let context = canvas.getContext("2d");
  //     context.drawImage(
  //       image,
  //       0,
  //       y * heightOfOnePiece,
  //       widthOfOnePiece,
  //       heightOfOnePiece,
  //       0,
  //       0,
  //       canvas.width,
  //       canvas.height
  //     );
  //     images.push(canvas.toDataURL());
  //   }

  //   return images;
  // }

}
