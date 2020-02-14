import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../services/pdf/pdf.service';

import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import "jspdf-autotable";
@Component({
  selector: 'financial-toll-summary-addtime',
  templateUrl: './financial-toll-summary-addtime.component.html',
  styleUrls: ['./financial-toll-summary-addtime.component.scss']
})
export class FinancialTollSummaryAddtimeComponent implements OnInit {
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
  regno = null;
  typedKey = '';
  vehId = '';
  result = [];
  data = [];
  openingBalance = 0;
  closingBalance = 0;
  creditAmount = 0;
  debitAmount = 0;
  vehid = this.user._details.vehid;
  mobileno = this.user._details.fo_mobileno;
  foAgents = [];
  constructor(public api: ApiService,
    public pdfService: PdfService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal, ) {
      console.log("this.user._details.",this.user._details);
      this.fo.id = this.user._details.id;
      this.fo.mobileNo = this.user._details.fo_mobileno;
      this.fo.name = this.user._details.name;
      this.common.refresh = this.refresh.bind(this);
    this.dates.start = this.common.dateFormatter1(new Date(new Date().setDate(new Date().getDate() - 15)));
  }

 
  ngOnInit() {
  }
  selectVehicle(vehData) {
    this.vehId = vehData.id;
    this.regno = vehData.regno;
    this.data = this.result.filter((ele) => {
      if (!this.regno){
        return true;}
      else{
        console.log("ele",ele);
        return ele.vehid == this.regno ? true : false;
      }
    })
    console.log(this.data);
  }


  refresh() {
    this.getaddTimeFinancialTollReport();
  }

  calculateAmount(arr) {
    let usageStatus = arr[0]['entry_type'];
    let opening_balance_new = arr[0]['balance'];
    let usageAmount = arr[0]['amount'];

    console.log("usageStatus",(usageStatus).toLowerCase,"opening_balance_new",opening_balance_new,"usageAmount",usageAmount)
    if ((usageStatus).toLowerCase() == "usage" || (usageStatus).toLowerCase() == "balance recharge") {
      
      this.openingBalance = parseInt(opening_balance_new) - usageAmount;
    }
   
    else {
      this.openingBalance = parseInt(opening_balance_new) + (usageAmount);
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
    this.openingBalance = 0;
    this.closingBalance = 0;
    this.data = [];
    console.log("mobile no",this.mobileno);
    if(this.mobileno){
    let params = "&startDate=" + this.dates.start + "&endDate=" + this.dates.end + "&mobileno=" + this.mobileno + "&vehid=" + this.vehId;
    this.common.loading++;
    this.api.walle8Get('FinancialAccountSummary/getFinancialAccountSummaryAddTime.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res);
        if (res && res['data'] && res['data'].length>0) {
          this.result = res['data'];
          this.data = res['data'];
          // this.openingBalance = this.data[0]['amount'];
          // this.closingBalance = this.data[this.data.length - 1]['amount'];
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

  filterData(event) {
    console.log('typedKey',this.typedKey)
    this.data = this.result.filter((ele) => {
      if (!this.typedKey){
        return true;}
      else{
        console.log("ele",ele);
        return ele.vehid ? ele.vehid.toLowerCase().includes(this.typedKey) : false;
      }
    })
    console.log("data",this.data);
  }

  async getPDFFromTableId(imgId, tblEltId, left_heading?, center_heading?, doNotIncludes?, time?, lower_left_heading?) {
    // console.log("Action Data:", doNotIncludes); return;
    //remove table cols with del class
    let tblelt = document.getElementById(tblEltId);
    console.log(tblelt);
    if (tblelt.nodeName != "TABLE") {
      tblelt = document.querySelector("#" + tblEltId + " table");
    }

    let hdg_coll = [];
    let hdgs = [];
    let hdgCols = tblelt.querySelectorAll("th");
    console.log("hdgcols:", hdgCols);
    // console.log(hdgCols.length);
    if (hdgCols.length >= 1) {
      for (let i = 0; i < hdgCols.length; i++) {
        let isBreak = false;
        for (const donotInclude in doNotIncludes) {
          if (doNotIncludes.hasOwnProperty(donotInclude)) {
            const thisNotInclude = doNotIncludes[donotInclude];
            if (hdgCols[i].innerHTML.toLowerCase().includes("title=\"" + thisNotInclude.toLowerCase() + "\"")) {
              isBreak = true;
              break;
            }
          }
        }
        if (isBreak)
          continue;
        if (hdgCols[i].innerHTML.toLowerCase().includes(">image<"))
          continue;
        if (hdgCols[i].classList.contains('del'))
          continue;
        let elthtml = hdgCols[i].innerHTML;
        if (elthtml.indexOf('<input') > -1) {
          let eltinput = hdgCols[i].querySelector("input");
          let attrval = eltinput.getAttribute("placeholder");
          hdgs.push(attrval);

        } else if (elthtml.indexOf('<img') > -1) {
          let eltinput = hdgCols[i].querySelector("img");
          let attrval = eltinput.getAttribute("title");


          hdgs.push(attrval);
        } else if (elthtml.indexOf('href') > -1) {
          let strval = hdgCols[i].innerHTML;
          hdgs.push(strval);
        } else {
          let plainText = elthtml.replace(/<[^>]*>/g, "");
          console.log("hdgval:" + plainText);
          hdgs.push(plainText);
        }
      }
    }

    hdg_coll.push(hdgs);
    let rows = [];
    let tblrows = tblelt.querySelectorAll('tbody tr');
    if (tblrows.length >= 1) {
      for (let i = 0; i < tblrows.length; i++) {
        if (tblrows[i].classList.contains('cls-hide'))
          continue;
        let rowCols = tblrows[i].querySelectorAll('td');
        let rowdata = [];
        for (let j = 0; j < rowCols.length; j++) {
          if (rowCols[j].classList.contains('del'))
            continue;
          let colhtml = rowCols[j].innerHTML;
          if (colhtml.indexOf('input') > -1) {
            let eltinput = rowCols[j].querySelector("input");
            let attrval = eltinput.getAttribute("placeholder");
            rowdata.push(attrval);

          } else if (colhtml.indexOf('img') > -1) {
            let eltinput = rowCols[j].querySelector("img");
            let attrval = eltinput && eltinput.getAttribute("title");
            rowdata.push(attrval);
          } else if (colhtml.indexOf('href') > -1) {
            let strval = rowCols[j].innerHTML;
            rowdata.push(strval);
          } else if (colhtml.indexOf('</i>') > -1) {
            let pattern = /<i.* title="([^"]+)/g;
            let match = pattern.exec(colhtml);
            if (match != null && match.length)
              rowdata.push(match[1]);
          } else {
            let plainText = colhtml.replace(/<[^>]*>/g, "");
            rowdata.push(plainText);
          }
        }
        rows.push(rowdata);
      }
    }

    let eltimg = document.createElement("img");
    eltimg.src = "assets/images/elogist.png";
    eltimg.alt = "logo";

    let pageOrientation = "Portrait";
    if (hdgCols.length > 7) {
      pageOrientation = "Landscape";
    }

    let doc = new jsPDF({
      orientation: pageOrientation,
      unit: "px",
      format: "a4"
    });

    // @@@@@----------------
    var data = document.getElementById(imgId);
    console.log("data", data);
    let cv = await html2canvas(data, {
      useCORS: true,
       scale: 0.8
    });
    var imgData = cv.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 30, 15, 570, 350);
    // doc.save("report1.pdf");
    // html2canvas(data, {
    //   useCORS: true,
    //   scale: 2
    // }).then(canvas => {
    //   var imgData = canvas.toDataURL('image/png');
    //   doc.addImage(imgData, 'PNG', 0, 15, 700, 150);
    //   doc.save("report1.pdf");
    // });


    // @@@@@@@@@@@@


    var pageContent = function (data) {
      //header
      let x = 35;
      let y = 40;

      //if(left_heading != "undefined" &&  center_heading != null && center_heading != '') {

      doc.setFontSize(14);
      doc.setFont("times", "bold");

      // doc.text("elogist Solutions ", x, y);

      //}
      let pageWidth = parseInt(doc.internal.pageSize.width);
      if (left_heading != "undefined" && left_heading != null && left_heading != '') {
        x = pageWidth / 2;
        let hdglen = left_heading.length / 2;
        let xpos = x - hdglen - 50;
        y = 40;
        doc.setFont("times", "bold", "text-center");
        doc.text(left_heading, xpos, y);
      }
      if (center_heading != "undefined" && center_heading != null && center_heading != '') {
        x = pageWidth / 2;
        y = 50;
        let hdglen = center_heading.length / 2;
        doc.setFontSize(14);
        doc.setFont("times", "bold", "text-center");
        doc.text(center_heading, x - hdglen - 50, y);
      }
      if (lower_left_heading != "undefined" && lower_left_heading != null && lower_left_heading != '') {
        let xpos = 35;
        y = 65;
        doc.setFont("times", "bold", "text-center");
        doc.text(lower_left_heading, xpos, y);
      }
      // doc.text(time, 30, 60);
      y = 15;
      // doc.addImage(eltimg, 'JPEG', (pageWidth - 150), 15, 50, 50, 'logo', 'NONE', 0);
      doc.setFontSize(12);

      // doc.line(20, 105, pageWidth - 20, 105);

      // FOOTER
      var str = "Page " + data.pageCount;

      doc.setFontSize(10);
      doc.text(
        str,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
      /******** Page Top Margin *********** */
      data.settings.margin.top = 20; 
    };


    let tempLineBreak = { fontSize: 10, cellPadding: 3, minCellHeight: 11, minCellWidth: 10, cellWidth: 40, valign: 'middle', halign: 'center' };
    doc.autoTable({
      head: hdg_coll,
      body: rows,
      theme: 'grid',
      didDrawPage: pageContent,
      margin: { top: 500 },
      rowPageBreak: 'avoid',
      headStyles: {
        fillColor: [98, 98, 98],
        fontSize: 10,
        halign: 'center',
        valign: 'middle'

      },
      styles: tempLineBreak,
      columnStyles: { text: { cellWidth: 40, halign: 'center', valign: 'middle' } },

    });


    doc.save("report.pdf");
  }


}
