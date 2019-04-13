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
    console.log("user::");
    console.log(this.user);
    this.getReport();
    // /this.getTableColumns();

  }

  ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  printPDF(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if(this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid})
      .subscribe(res => {
        this.common.loading--;
        this.fodata = res['data'];
        let left_heading = this.fodata['name'];
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
        let center_heading = strstatus;
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  
  
  setTable() {
    let headings = {
      docId: { title: 'Document Id', placeholder: 'Document Id' },
      vehicleNumber: { title: 'Vehicle Number ', placeholder: 'Vehicle Number' },
      docType: { title: 'Document Type', placeholder: 'Document Type' },
      issueDate: { title: 'Issue Date', placeholder: 'Issue Date', class: 'del' },
      wefDate: { title: 'Wef Date', placeholder: 'Wef Date' },
      expiryDate: { title: 'Expiry Date', placeholder: 'Expiry Date' },
      documentNumber: { title: 'Document Number', placeholder: 'Document Number' },
      agentName: { title: 'Agent Name', placeholder: 'Agent Name', class: 'del' },
      rto: { title: 'Rto', placeholder: 'RTO' , class: 'del'},
      amount: { title: 'Amount', placeholder: 'Amount' , class: 'del'},
      verified: { title: 'Verified', placeholder: 'Verified', class: 'del' },
      remark: { title: 'Remark', placeholder: 'Remark', class: 'del' },
      image: { title: 'Image', placeholder: 'Image', hideSearch: true, class:'tag' },
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
        issueDate: { value: this.datePipe.transform(doc.issue_date, 'dd MMM yyyy') , class: 'del'},
        wefDate: { value: this.datePipe.transform(doc.wef_date, 'dd MMM yyyy') },
        expiryDate: { value: this.datePipe.transform(doc.expiry_date, 'dd MMM yyyy'), class: exp_date2==null ? 'default' : currdt2 >= exp_date2 ? 'red' : (exp_date2 <= nxtmth2 && exp_date2 > currdt2 ? 'pink' : 'green') },
        documentNumber: { value: doc.document_number },
        agentName: { value: doc.agent , class: 'del'},
        rto: { value: doc.rto , class: 'del'},
        amount: { value: doc.amount , class: 'del'},
        verified: { value: doc.verified ? 'Yes': 'No' , class: 'del'},
        remark: { value: doc.remarks, class: 'del' },
        image: { value: `${doc.img_url ? '<i class="fa fa-image"></i>' : '<i class="fa fa-pencil-square"></i>'}`, isHTML: true, action: doc.img_url ? this.imageView.bind(this, doc) : this.add.bind(this, doc,), class: 'image text-center del' },
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
    let userid = this.user._customer.id;
    if(this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('Vehicles/getDocumentsStatisticsnew', { x_status: params.status, x_document_type_id: params.id, x_user_id: userid })
    // this.api.post('Vehicles/getDocumentsStatisticsnew', { x_status: params.status, x_document_type_id: params.id })
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