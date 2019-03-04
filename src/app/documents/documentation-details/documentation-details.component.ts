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


  // table = {
  //   data: {
  //     headings: {
  //       vehicleNumber: { title: 'Vehicle Number', placeholder: 'Vehicle No' },
  //       docType: { title: 'Document Type', placeholder: 'Document Type' },
  //       agentName: { title: 'Agent Name', placeholder: 'Agent Name' },
  //       issueDate: { title: 'Issue Date', placeholder: 'Issue Date' },
  //       wefDate: { title: 'Wef Date', placeholder: 'Wef Date' },
  //       expiryDate: { title: 'Expiry Date', placeholder: 'Expiry Date' },
  //       documentNumber: { title: 'Document Number', placeholder: 'Document No' },
  //       amount: { title: 'Amount', placeholder: 'Amount' },
  //       remark: { title: 'Remark', placeholder: 'Remak' },
  //       image: { title: 'Image', placeholder: 'Image', hideSearch: true },
  //       edit: { title: 'Edit', placeholder: 'Edit', hideSearch: true },
  //     },
  //     columns: []
  //   },
  //   settings: {
  //     hideHeader: true
  //   }
  // };



  constructor(
    private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    console.log("All Api:", api)

    // this.loginType = this.user._loggedInBy;
    // this.checkAdmin();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.getTableColumns();
  }

  // checkAdmin() {
  //   if (this.loginType == "admin") {
  //     return this.loginid = 1;
  //   }
  // }

  getvehicleData(vehicle) {
    console.log('Vehicle Data: ', vehicle);
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
      vehicleNumber: { title: 'Vehicle Number', placeholder: 'Vehicle No' },
      docType: { title: 'Document Type', placeholder: 'Document Type' },
      agentName: { title: 'Agent Name', placeholder: 'Agent Name' },
      issueDate: { title: 'Issue Date', placeholder: 'Issue Date' },
      wefDate: { title: 'Wef Date', placeholder: 'Wef Date' },
      expiryDate: { title: 'Expiry Date', placeholder: 'Expiry Date' },
      documentNumber: { title: 'Document Number', placeholder: 'Document No' },
      amount: { title: 'Amount', placeholder: 'Amount' },
      remark: { title: 'Remark', placeholder: 'Remak' },
      image: { title: 'Image', placeholder: 'Image', hideSearch: true },
      edit: { title: 'Edit', placeholder: 'Edit', hideSearch: true },
    };

    if (this.user._loggedInBy == 'admin') {
      headings['delete'] = { title: 'Delete', placeholder: 'Delete', hideSearch: true, };
    }
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
      let curr = this.common.dateFormatter(new Date()).split(' ')[0];
      let nextMthDate = this.common.getDate(30, 'yyyy-mm-dd');
      console.log("expiry date:", exp_date);
      let column = {
        vehicleNumber: { value: doc.regno },
        docType: { value: doc.document_type },
        agentName: { value: doc.agent },
        issueDate: { value: this.datePipe.transform(doc.issue_date, 'dd MMM yyyy') },
        wefDate: { value: this.datePipe.transform(doc.wef_date, 'dd MMM yyyy') },
        expiryDate: { value: this.datePipe.transform(doc.expiry_date, 'dd MMM yyyy'), class: curr >= exp_date ? 'red' : (exp_date < nextMthDate ? 'pink' : (exp_date ? 'green' : '')) },
        documentNumber: { value: doc.document_number },
        amount: { value: doc.amount },
        remark: { value: doc.remarks },
        image: { value: `${doc.img_url ? '<i class="fa fa-image"></i>' : ''}`, isHTML: true, action: doc.img_url ? this.imageView.bind(this, doc) : '', class: 'image text-center' },
        edit: { value: `<i class="fa fa-pencil"></i>`, isHTML: true, action: this.editData.bind(this, doc), class: 'icon text-center' },
        rowActions: {}
      };
      if (this.user._loggedInBy == 'admin') {
        column['delete'] = { value: `<i class="fa fa-trash"></i>`, isHTML: true, action: this.deleteData.bind(this, doc), class: 'icon text-center' };
      }

      columns.push(column);
    });
    return columns;
  }



  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
        console.log('new Date:', this.dates[date]);
      }
    });
  }

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
    },
    ];
    console.log("images:", images);
    if (this.checkForPdf(images[0].image)) {
      window.open(images[0].image);
      return;
    }
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
    const activeModal = this.modalService.open(AddDocumentComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
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
    const activeModal = this.modalService.open(ImportDocumentComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
  }

  editData(doc) {
    console.log("Doc data", doc);
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
      remark: doc.remarks,
      rto: doc.rto,
      amount: doc.amount,
    }];

    this.common.params = { documentData, title: 'Update Document', vehicleId: doc.vehicle_id };
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
          console.log("reason For delete: ", data.remark);
          remark = data.remark;
          this.common.loading++;
          this.api.post('Vehicles/deleteDocumentById', { x_document_id: doc.id, x_remarks: remark })
            .subscribe(res => {
              this.common.loading--;
              console.log("data", res);
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