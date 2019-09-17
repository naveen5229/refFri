import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../../modals/image-view/image-view.component';
import { AddDocumentComponent } from '../add-document/add-document.component';
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
  title = '';
  data = [];
  fodata = [];
  reportData = {
    id: null,
    status: '',
  };
  selectedVehicle = null;
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};


  constructor(public api: ApiService,
    private datePipe: DatePipe,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '1200');
    this.title = this.common.params.title;
    this.reportData.status = this.common.params.status;
    this.getReport();

  }

  ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  printPDF(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        this.fodata = res['data'];
        let left_heading = this.fodata['name'];
        let strstatus = this.reportData.status.toUpperCase();
        switch (strstatus) {
          case 'VERIFIED': strstatus = 'VERIFIED DOCUMENTS'; break;
          case 'UNVERIFIED': strstatus = 'UNVERIFIED DOCUMENTS'; break;
          case 'PENDINGIMAGE': strstatus = 'PENDING IMAGES'; break;
          case 'EXPIRING30DAYS': strstatus = 'DOCUMENTS EXPIRING IN 30 DAYS'; break;
          case 'EXPIRED': strstatus = 'EXPIRED DOCUMENTS'; break;
          case 'PENDINGDOC': strstatus = 'PENDING DOCUMENTS'; break;
          default: break;
        }
        let center_heading = strstatus;
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, null, '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  // setTable() {
  //   let headings = {
  //     docId: { title: 'Document Id', placeholder: 'Document Id' },
  //     vehicleNumber: { title: 'Vehicle Number ', placeholder: 'Vehicle Number' },
  //     docType: { title: 'Document Type', placeholder: 'Document Type' },
  //     issueDate: { title: 'Issue Date', placeholder: 'Issue Date', class: 'del' },
  //     wefDate: { title: 'Wef Date', placeholder: 'Wef Date' },
  //     expiryDate: { title: 'Expiry Date', placeholder: 'Expiry Date' },
  //     documentNumber: { title: 'Document Number', placeholder: 'Document Number' },
  //     agentName: { title: 'Agent Name', placeholder: 'Agent Name', class: 'del' },
  //     rto: { title: 'Rto', placeholder: 'RTO' , class: 'del'},
  //     amount: { title: 'Amount', placeholder: 'Amount' , class: 'del'},
  //     verified: { title: 'Verified', placeholder: 'Verified', class: 'del' },
  //     remark: { title: 'Remark', placeholder: 'Remark', class: 'del' },
  //     image: { title: 'Image', placeholder: 'Image', hideSearch: true, class:'tag' },
  //     // edit: { title: 'Edit', placeholder: 'Edit', hideSearch: true },
  //   };
  //   return {
  //     data: {
  //       headings: headings,
  //       columns: this.getTableColumns()
  //     },
  //     settings: {
  //       hideHeader: true
  //     }
  //   }
  // }


  // getTableColumns() {
  //   let columns = [];
  //   this.data.map(doc => {

  //     let exp_date = this.common.dateFormatter(doc.expiry_date).split(' ')[0];
  //     let curr = this.common.dateFormatter1(new Date()).split(' ')[0];
  //     let nextMthDate = this.common.getDate(30, 'yyyy-mm-dd');

  //     // for comapring
  //     let exp_date2 = new Date(exp_date.split('/').join('-'));
  //     exp_date2 = exp_date2.getFullYear()==1970?null:exp_date2;

  //     let nxtmth2 = new Date(this.common.dateFormatter1(nextMthDate).split(' ')[0]);
  //     let currdt2 = new Date(curr);


  //     let column = {
  //       docId: { value: doc.id },
  //       vehicleNumber: { value: doc.regno },
  //       docType: { value: doc.document_type },
  //       issueDate: { value: this.datePipe.transform(doc.issue_date, 'dd MMM yyyy') , class: 'del'},
  //       wefDate: { value: this.datePipe.transform(doc.wef_date, 'dd MMM yyyy') },
  //       expiryDate: { value: this.datePipe.transform(doc.expiry_date, 'dd MMM yyyy'), class: exp_date2==null ? 'default' : currdt2 >= exp_date2 ? 'red' : (exp_date2 <= nxtmth2 && exp_date2 > currdt2 ? 'pink' : 'green') },
  //       documentNumber: { value: doc.document_number },
  //       agentName: { value: doc.agent , class: 'del'},
  //       rto: { value: doc.rto , class: 'del'},
  //       amount: { value: doc.amount , class: 'del'},
  //       verified: { value: doc.verified ? 'Yes': 'No' , class: 'del'},
  //       remark: { value: doc.remarks, class: 'del' },
  //       image: { value: `${doc.img_url ? '<i class="fa fa-image"></i>' : '<i class="fa fa-pencil-square"></i>'}`, isHTML: true, action: doc.img_url ? this.imageView.bind(this, doc) : this.add.bind(this, doc,), class: 'image text-center del' },
  //       rowActions: {}
  //     };
  //     columns.push(column);
  //   });
  //   return columns;
  // }

  getTableColumns() {
    let columns = [];
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        this.valobj['image'] = { value: `${doc._imgurl1 ? '<i class="fa fa-image"></i>' : '<i class="fa fa-pencil-square"></i>'}`, isHTML: true, action: doc._imgurl1 ? this.imageView.bind(this, doc) : this.add.bind(this, doc), class: 'image text-center del' }
      }
      columns.push(this.valobj);
    });
    return columns;
  }


  add(row) {
    this.common.params = { row, title: 'Upload Image' };
    const activeModal = this.modalService.open(AddDocumentComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
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
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('Vehicles/getDocumentsStatisticsnew', { x_status: params.status, x_document_type_id: params.id, x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        if (this.data == null) {
          this.data = [];
          return;
        }
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        let image = { title: this.formatTitle('Image'), placeholder: this.formatTitle('Image') };
        this.table.data.headings['image'] = image;
        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }


  imageView(doc) {
    let images = [{
      name: "image",
      image: doc._imgurl1
    },
    {
      name: "image",
      image: doc._imgurl2
    },
    {
      name: "image",
      image: doc._imgurl3
    }
    ];
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

}