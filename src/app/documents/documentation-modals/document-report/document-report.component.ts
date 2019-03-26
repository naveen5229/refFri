import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../../modals/image-view/image-view.component';
import { AddDocumentComponent} from '../add-document/add-document.component';
import { EditDocumentComponent } from '../../documentation-modals/edit-document/edit-document.component';
import { normalize } from 'path';
import { from } from 'rxjs';
import { NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import html2canvas from 'html2canvas';

@Component({
  selector: 'document-report',
  templateUrl: './document-report.component.html',
  styleUrls: ['./document-report.component.scss', '../../../pages/pages.component.css'],
  providers: [DatePipe]
})


export class DocumentReportComponent implements OnInit {
  table = null;
  title = '';
  data = [];
  fodata = [];
  // reportResult = [];
  reportData = {
    id: null,
    status: '',
  };
  

  // currentdate = new Date;
  // nextMthDate = null;
  // exp_date = null;
  // curr = null;
  selectedVehicle = null;


  constructor(public api: ApiService,
    private datePipe: DatePipe,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '1200');
    this.title = this.common.params.title;
    this.reportData.status = this.common.params.status;
    console.info("report data", this.reportData);
    this.getReport();
    // /this.getTableColumns();

  }

  ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  getPDFFromHtml() {

  }

  exportPDF() {
    this.common.loading++;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: this.user._customer.id})
      .subscribe(res => {
        this.fodata = res['data'];
        this.common.loading--;
        
        console.log("data=>");
        console.log(this.data);

        let rowHeading = [['SNo', 'DocumentID', 'Vehicle', 'Type', 'Wef Date', 'Expiry Date']];
        let keyHeading = ['sno', 'id', 'regno', 'document_type', 'wef_date', 'expiry_date'];
        let pageOrientation = "l"; //l or p
        //let address = ["elogist Solutions Pvt. Ltd.", "Address: 605-21, Jaipur Electronic Market", "Riddhi Siddhi Circle, Gopalpura Bypass, Jaipur, Rajasthan - 302018", "Support: 8081604455", "Website: www.walle8.com"];
        let address = [this.fodata['name'].toUpperCase()];
        let strstatus = this.reportData.status.toUpperCase();
        switch(strstatus) {
          case 'VERIFIED' : strstatus = 'VERIFIED DOCUMENTS'; break;
          case 'UNVERIFIED' : strstatus = 'UNVERIFIED DOCUMENTS'; break;
          case 'PENDINGIMAGE' : strstatus = 'PENDING IMAGES'; break;
          case 'EXPIRING30DAYS' : strstatus = 'DOCUMENTS EXPIRING IN 30 DAYS'; break;
          case 'EXPIRED' : strstatus = 'EXPIRED DOCUMENTS'; break;
          case 'PENDINGDOC' : strstatus = 'PENDING DOCUMENTS'; break;
          default: break;
        }
        //let centerheading = ["Customer: " + this.fodata['name'].toUpperCase(), "Mobile: " + this.fodata['mobileno'], strstatus];
        let centerheading = [strstatus];
        this.getPDFFromTable(rowHeading, keyHeading, this.data, pageOrientation, document.getElementById('img-logo'), address, centerheading);
      }, err => {
        this.common.loading--;
        console.log(err);
      });    
      
  }

  specialElementHandlers() {

  }

  getPDFFromTable(rowHeading, keyHeading, data, pageOrientation, eltLogoImage, address, centerheading) {
    let doc = new jsPDF({
      orientation: pageOrientation,
      unit: 'px',
      format: 'a4'
    });
    
    this.processPDF(doc, rowHeading, keyHeading, data, address, eltLogoImage, centerheading);
    doc.save('report.pdf');
  }
  
  processPDF(doc, rowHeading,keyHeading, tabledata,address, eltLogoImage, centerheading) {
    var pageContent = function (data) {
      //header
      let x = 35;
      //let y = 25;
      let y = 40;

      //doc.setFontSize(10);
      doc.setFontSize(14);
      for(let i=0; i<address.length; i++) {
        if(i== 0)
          doc.setFont("times", "bold");
        else
          doc.setFont("times", "normal");
        doc.text(address[i], x, y);
        //y=y+10;
        y=y+14;
      }
      let max_y = y;
      let pageWidth= parseInt(doc.internal.pageSize.width);
      x=pageWidth / 2;
      //y=25;
      y=40;
      doc.setFontSize(14);
      for(let i=0; i<centerheading.length; i++) {
        //doc.text(centerheading[i], x - 30, y);
        doc.text(centerheading[i], x - 50, y);
        //y=y+12;
        y=y+14;
      }
      max_y = max_y < y? y: max_y;
      y= 15;
      doc.addImage(eltLogoImage, 'JPEG', (pageWidth - 110), 15, 50, 50, 'logo', 'NONE', 0);
      max_y = max_y < 70? 70: max_y;
      doc.setFontSize(12);

      doc.line(20, 70, pageWidth - 20, 70);

      // FOOTER
      var str = "Page " + data.pageCount;
      
      doc.setFontSize(10);
      doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
    };
    let rowsdata = [];
    for(let i=0; i<tabledata.length; i++) {
      let datarow = [];
      for(let j=0; j<keyHeading.length; j++) {
        if(keyHeading[j] == "sno") {
          let sno = i+1;
          datarow.push('' + sno);
        }else if(tabledata[i][keyHeading[j]] === true)
          datarow.push("Yes");
        else if(tabledata[i][keyHeading[j]] === false)
          datarow.push("No");
        else {
          if(isNaN(tabledata[i][keyHeading[j]])) {
            let dt = new Date(tabledata[i][keyHeading[j]]);
            if(!isNaN(dt.getTime())) {
              datarow.push(this.datePipe.transform(tabledata[i][keyHeading[j]], 'dd MMM yyyy'));
            } else {
              datarow.push(tabledata[i][keyHeading[j]]);
            }
          } else {
            datarow.push(tabledata[i][keyHeading[j]]);
          }
        }
      }
      rowsdata.push(datarow);
    }
    let tempLineBreak={fontSize: 10, cellPadding: 3, minCellHeight: 11, minCellWidth : 10, cellWidth: 40 };
    doc.autoTable( {
      head: rowHeading,
      body: rowsdata,
      theme: 'grid',
      didDrawPage: pageContent,
      margin: {top: 80},
      headStyles: {
        fillColor: [98, 98, 98],
        fontSize: 10
      },
      styles: tempLineBreak,
      columnStyles: {text: {cellWidth: 40 }},
      
      /*,
        bodyStyles: {
        fillColor: [52, 73, 94],
        textColor: 240
      }*/
    });
  }

  exportCSV() {
    
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: this.user._customer.id})
      .subscribe(res => {
        this.fodata = res['data'];
        //this.common.loading--;
        
        let info = [];
        let client = {"Customer" : "Name: " + this.fodata['name'].toUpperCase()};
        let mobileno = {"Mobile" : "Mobile: " + this.fodata['mobileno']};
        let status = {"Status" : "Status: " + this.reportData.status.toUpperCase()};
        let organization = {"elogist Solutions  Pvt. Ltd.": "elogist Solutions  Pvt. Ltd."}; 
        let website = {"Website: www.walle8.com" : "Website: www.walle8.com"}; 
        let address = {"Address: 605-21 ": "Address: 605-21", " Jaipur Electronic Market ": " Jaipur Electronic Market "};
        let address_sec = {"Riddhi Siddhi Circle": "Riddhi Siddhi Circle", " Gopalpura Bypass " : " Gopalpura Bypass ", " Jaipur ": " Jaipur ", " Rajasthan - 302018 ": " Rajasthan - 302018 " }; 
        let support = {"Support:  8081604455": "Support:  8081604455"};
        let temp = {
          "SN" : "SN",
          "DocumentID": "DocumentID",
          "VehicleNo": "VehicleNo",
          "IssueDate": "IssueDate",
          "WefDate": "WefDate",
          "ExpiryDate": "ExpiryDate",
          "DocumentNo": "DocumentNo",
          "RTO": "RTO",
          "Amount": "Amount",
          "Verified": "Verified",
          "Remark": "Remark"
        };
        info.push(organization);
        info.push(website);
        info.push(address);
        info.push(address_sec);
        info.push(support);
        
        info.push(client);
        info.push(mobileno);
        info.push(status);
        
        info.push(temp);
        
        this.data.map((doc, index) => {
          let docdata = {
            "SN": (index + 1),
            "DocumentID": doc.id,
            "VehicleNo": doc.regno,
            "IssueDate": doc.issue_date == null? '': doc.issue_date,
            "WefDate": doc.wef_date == null? '': doc.wef_date,
            "ExpiryDate": doc.expiry_date == null? '': doc.expiry_date,
            "DocumentNo": doc.document_number == null? '': doc.document_number,
            "RTO": doc.rto == null? '': doc.rto,
            "Amount": doc.amount == null? '': doc.amount,
            "Verified": doc.verified? 'Yes': 'No',
            "Remark": doc.remarks == null? '': doc.remarks
          };
          info.push(docdata);
        });
        console.log(info);
        new Angular5Csv(info, (new Date()).getTime() + '');
            
      }, err => {
        this.common.loading--;
        console.log(err);
      });    
  
  }

  setTable() {
    let headings = {
      docId: { title: 'Doc Id', placeholder: 'Doc Id' },
      vehicleNumber: { title: 'vehicle Number ', placeholder: 'vehicle Number' },
      docType: { title: 'Document Type', placeholder: 'Document Type' },
      issueDate: { title: 'Issue Date', placeholder: 'Issue Date' },
      wefDate: { title: 'Wef Date', placeholder: 'Wef Date' },
      expiryDate: { title: 'Expiry Date', placeholder: 'Expiry Date' },
      documentNumber: { title: 'Document Number', placeholder: 'Document No' },
      agentName: { title: 'Agent Name', placeholder: 'Agent Name' },
      rto: { title: 'Rto', placeholder: 'Rto' },
      amount: { title: 'Amount', placeholder: 'Amount' },
      verified: { title: 'Verified', placeholder: 'Verified' },
      remark: { title: 'Remark', placeholder: 'Remak' },
      image: { title: 'Image', placeholder: 'Image', hideSearch: true },
      // edit: { title: 'Edit', placeholder: 'Edit', hideSearch: true },
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true
      }
    }
  }


  getTableColumns() {
    let columns = [];
    this.data.map(doc => {

      let exp_date = this.common.dateFormatter(doc.expiry_date).split(' ')[0];
      let curr = this.common.dateFormatter1(new Date()).split(' ')[0];
      let nextMthDate = this.common.getDate(30, 'yyyy-mm-dd');

      // for comapring
      let exp_date2 = new Date(exp_date.split('/').join('-'));
      exp_date2 = exp_date2.getFullYear()==1970?null:exp_date2;
      
      let nxtmth2 = new Date(this.common.dateFormatter1(nextMthDate).split(' ')[0]);
      let currdt2 = new Date(curr);


      let column = {
        docId: { value: doc.id },
        vehicleNumber: { value: doc.regno },
        docType: { value: doc.document_type },
        issueDate: { value: this.datePipe.transform(doc.issue_date, 'dd MMM yyyy') },
        wefDate: { value: this.datePipe.transform(doc.wef_date, 'dd MMM yyyy') },
        expiryDate: { value: this.datePipe.transform(doc.expiry_date, 'dd MMM yyyy'), class: exp_date2==null ? 'default' : currdt2 >= exp_date2 ? 'red' : (exp_date2 <= nxtmth2 && exp_date2 > currdt2 ? 'pink' : 'green') },
        documentNumber: { value: doc.document_number },
        agentName: { value: doc.agent },
        rto: { value: doc.rto },
        amount: { value: doc.amount },
        verified: { value: doc.verified ? 'Yes': 'No' },
        remark: { value: doc.remarks },
        image: { value: `${doc.img_url ? '<i class="fa fa-image"></i>' : '<i class="fa fa-pencil-square"></i>'}`, isHTML: true, action: doc.img_url ? this.imageView.bind(this, doc) : this.add.bind(this, doc,), class: 'image text-center' },
        rowActions: {}
      };
      columns.push(column);
    });
    return columns;
  }
  add(row){
    console.log("row Data:",row);
    this.common.params = { row, title: 'Upload Image' };
    const activeModal = this.modalService.open(AddDocumentComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
          if (data.response) {
            this.closeModal(true);
            this.getReport();
        
          }
        });
  }
    
  




  getReport() {
    let params = {
      id: this.common.params.docReoprt.document_type_id,
      status: this.reportData.status
    };
    this.common.loading++;
    this.api.post('Vehicles/getDocumentsStatisticsnew', { x_status: params.status, x_document_type_id: params.id })
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        // console.log(" get api result", this.data);
        // this.curr = this.common.dateFormatter(this.currentdate);
        // this.nextMthDate = this.common.getDate(30, 'yyyy-mm-dd');
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  // totalReport() {
  //   let params = {
  //     status: this.reportData.status,
  //     id: 0
  //   }
  //   this.common.loading++;
  //   this.api.post('Vehicles/getDocumentsStatistics', { x_status: params.status, x_document_type_id: params.id })
  //     .subscribe(res => {
  //       this.common.loading--;
  //       this.data = res['data'];
  //       console.log("total api result", this.reportResult);
  //       this.curr = this.common.dateFormatter(this.currentdate);
  //       this.nextMthDate = this.common.getDate(30, 'yyyy-mm-dd');
  //       this.getReport();
  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });

  // }

  imageView(doc) {
    console.log("image data", doc);
    let images = [{
      name: "image",
      image: doc.img_url
    },
     {
      name: "image",
      image: doc.img_url2
    },
     {
      name: "image",
      image: doc.img_url3
    }
    ];
    console.log("images:", images);
    if (this.checkForPdf(images[0].image)) {
      window.open(images[0].image);
      return;
    }
    this.common.params = { images, title: 'Image' };
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

  checkForPdf(imgUrl) {
    var split = imgUrl.split(".");
    return split[split.length - 1] == 'pdf' ? true : false;
  }
  

  // editData(doc) {
  //   let documentData = [{
  //     regNumber: doc.regno,
  //     id: doc.id,
  //     docId: doc.document_id,
  //     vehicleId: doc.vehicle_id,
  //     documentType: doc.document_type,
  //     documentId: doc.document_type_id,
  //     issueDate: doc.issue_date,
  //     wefDate: doc.wef_date,
  //     expiryDate: doc.expiry_date,
  //     agentId: doc.document_agent_id,
  //     agentName: doc.agent,
  //     documentNumber: doc.document_number,
  //     docUpload: doc.img_url,
  //     remark: doc.remarks,
  //     rto: doc.rto,
  //     amount: doc.amount,
  //   }];
  //   this.selectedVehicle = documentData[0].vehicleId;
  //   console.log("Doc id:", documentData[0].id);
  //   setTimeout(() => {
  //     console.log('Test');
  //     this.common.handleModalSize('class', 'modal-lg', '1200', 'px', 1);
  //   }, 200);
  //   this.common.params = { documentData, title: 'Update Document', vehicleId: documentData[0].vehicleId };
  //   const activeModal = this.modalService.open(EditDocumentComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     if (data.response) {
  //       this.closeModal(true);
  //       this.documentUpdate();
  //       // this.getReport();
  //     }
  //   });
  // }

  // documentUpdate() {
  //   this.common.loading++;
  //   this.api.post('Vehicles/getVehicleDocumentsById', { x_vehicle_id: this.selectedVehicle })
  //     .subscribe(res => {
  //       this.common.loading--;
  //       this.reportResult = res['data'];
  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });
  // }
}