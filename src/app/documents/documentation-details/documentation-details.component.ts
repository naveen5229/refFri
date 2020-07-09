import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { AddDocumentComponent } from '../../documents/documentation-modals/add-document/add-document.component';
import { ImportDocumentComponent } from '../../documents/documentation-modals/import-document/import-document.component';
import { EditDocumentComponent } from '../../documents/documentation-modals/edit-document/edit-document.component';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';
import { DocumentHistoryComponent } from '../documentation-modals/document-history/document-history.component';
import { from } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'documentation-details',
  templateUrl: './documentation-details.component.html',
  styleUrls: ['./documentation-details.component.scss', '../../pages/pages.component.css'],
  providers: [DatePipe]
})
export class DocumentationDetailsComponent implements OnInit {
  title: '';
  data = [];
  selectedVehicle = null;
  dates = {
    expiryForm: '',
    expiryEnd: '',
  };
  table = null;

  constructor(
    private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.selectedVehicle && this.getvehicleData({ id: this.selectedVehicle });
  }

  getvehicleData(vehicle) {
    this.selectedVehicle = vehicle.id;
    this.common.loading++;
    this.api.post('Vehicles/getVehicleDocumentsById', { x_vehicle_id: vehicle.id })
      .subscribe(res => {
        this.common.loading--;
        this.documentUpdate();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  setTable() {
    let headings = {
      docId: { title: 'DocId', placeholder: 'DocId' },
      vehicleNumber: { title: 'Vehicle Number', placeholder: 'Vehicle No' },
      docType: { title: 'Document Type', placeholder: 'Document Type' },
      agentName: { title: 'Agent Name', placeholder: 'Agent Name' },
      issueDate: { title: 'Issue Date', placeholder: 'Issue Date' },
      wefDate: { title: 'Wef Date', placeholder: 'Wef Date' },
      expiryDate: { title: 'Expiry Date', placeholder: 'Expiry Date' },
      documentNumber: { title: 'Document Number', placeholder: 'Document No' },
      rto: { title: 'RTO', placeholder: 'RTO' },
      amount: { title: 'Amount', placeholder: 'Amount' },
      verified: { title: 'Verified', placeholder: 'Verified' },
      remark: { title: 'Remark', placeholder: 'Remark' },
      image: { title: 'Image', placeholder: 'Image', hideSearch: true, class: 'del' },
      edit: { title: 'Edit', placeholder: 'Edit', hideSearch: true, class: 'del' },
    };

    if (this.user._loggedInBy == 'admin') {
      headings['delete'] = { title: 'Delete', placeholder: 'Delete', hideSearch: true, class: 'del' };
    }
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
    this.data.map(doc => {
      let exp_date = this.common.dateFormatter(doc.expiry_date).split(' ')[0];
      let curr = this.common.dateFormatter(new Date()).split(' ')[0];
      let nextMthDate = this.common.getDate(30, 'yyyy-mm-dd');
      let column = {
        docId: { value: doc.id, class: this.user._loggedInBy == 'admin' ? 'blue' : 'black', action: this.openHistory.bind(this, doc.id) },
        vehicleNumber: { value: doc.regno },
        docType: { value: doc.document_type },
        agentName: { value: doc.agent },
        issueDate: { value: this.datePipe.transform(doc.issue_date, 'dd MMM yyyy') },
        wefDate: { value: this.datePipe.transform(doc.wef_date, 'dd MMM yyyy') },
        expiryDate: { value: this.datePipe.transform(doc.expiry_date, 'dd MMM yyyy'), class: exp_date == null && curr >= exp_date ? 'red' : (exp_date == null && exp_date < nextMthDate ? 'pink' : (doc.expiry_date == null ? 'default' : 'green')) },
        documentNumber: { value: doc.document_number },
        rto: { value: doc.rto },
        amount: { value: doc.amount },
        verified: { value: doc.is_verified ? 'Yes' : 'No' },
        remark: { value: doc.remarks },
        image: { value: `${doc.img_url ? '<i class="fa fa-image"></i>' : ''}`, isHTML: true, action: doc.img_url ? this.imageView.bind(this, doc) : '', class: 'image text-center del' },
        edit: this.user.permission.edit && { value: `<i class="fa fa-pencil-alt"></i>`, isHTML: true, action: this.editData.bind(this, doc), class: 'icon text-center del' },
        rowActions: { class: 'del' }
      };
      if (this.user._loggedInBy == 'admin') {
        column['delete'] = { value: `<i class="fa fa-trash"></i>`, isHTML: true, action: this.deleteData.bind(this, doc), class: 'icon text-center' };
      }
      columns.push(column);
    });

    return columns;
  }

  openHistory(doc_id) {
    this.common.params = { doc_id, title: 'Document Change History' };
    const activeModal = this.modalService.open(DocumentHistoryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
      }
    });
  }

  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
      }
    });
  }

  imageView(doc) {
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
    },
    ];
    // if (this.checkForPdf(images[0].image)) {
    //   window.open(images[0].image);
    //   return;
    // }
    this.common.params = { images, title: 'Image' };
    this.common.handleModalSize('class', 'modal-lg', '1024');
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

  checkForPdf(imgUrl) {
    var split = imgUrl.split(".");
    return split[split.length - 1] == 'pdf' ? true : false;
  }

  addDocument() {
    if (!this.selectedVehicle) {
      this.common.showError("Please select Vehicle Number");
      return false;
    }

    this.common.params = { title: 'Add Document', vehicleId: this.selectedVehicle };
    const activeModal = this.modalService.open(AddDocumentComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.documentUpdate();
      }
    });
  }

  documentUpdate() {
    this.common.loading++;
    this.api.post('Vehicles/getVehicleDocumentsById', { x_vehicle_id: this.selectedVehicle })
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  importVehicleDocument() {
    this.common.params = { title: 'Bulk Import Document', vehicleId: this.selectedVehicle };
    const activeModal = this.modalService.open(ImportDocumentComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  }

  editData(doc) {
    let documentData = [{
      regNumber: doc.regno,
      id: doc.id,
      vehicleId: doc.vehicle_id,
      documentType: doc.document_type,
      documentId: doc.document_type_id,
      issueDate: doc.issue_date,
      wefDate: doc.wef_date,
      expiryDate: doc.expiry_date,
      agentId: doc.document_agent_id,
      agentName: doc.agent,
      documentNumber: doc.document_number,
      docUpload: doc.img_url,
      docUpload2: doc.img_url2,
      docUpload3: doc.img_url3,
      remark: doc.remarks,
      rto: doc.rto,
      amount: doc.amount,
    }];

    this.common.params = { documentData, title: 'Update Document', vehicleId: doc.vehicle_id, };
    console.log("this.common.params",this.common.params);
    this.common.handleModalSize('class', 'modal-lg', '1200');
    const activeModal = this.modalService.open(EditDocumentComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.documentUpdate();
      }
    });
  }

  deleteData(doc) {
    let remark;
    let ret = confirm("Are you sure you want to delete this Document?");
    if (ret) {
      this.common.params = { RemarkModalComponent, title: 'Delete Document' };
      const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.response) {
          remark = data.remark;
          this.common.loading++;
          this.api.post('Vehicles/deleteDocumentById', { x_document_id: doc.id, x_remarks: remark, x_user_id: this.user._details.id, x_deldoc: 1 })
            .subscribe(res => {
              this.common.loading--;
              alert(res["msg"]);
              this.documentUpdate();

            }, err => {
              this.common.loading--;
              console.log(err);
              this.documentUpdate();

            });
        }
      })
    }
  }















}