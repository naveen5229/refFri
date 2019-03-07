import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { PendingDocumentComponent } from '../../documents/documentation-modals/pending-document/pending-document.component';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';
import { from } from 'rxjs';

@Component({
  selector: 'pending-documents',
  templateUrl: './pending-documents.component.html',
  styleUrls: ['./pending-documents.component.scss', '../../pages/pages.component.css']
})
export class PendingDocumentsComponent implements OnInit {
  data = [];

  modal = {
    active: '',
    first: {
      show: false,
      class: '',
      data: this.setModalData()
    },
    second: {
      show: false,
      class: '',
      data: this.setModalData()
    }
  };

  lastActiveIndex = -1;



  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getPendingDetailsDocuments();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }
  refresh() {
    console.log('Refresh');
    this.getPendingDetailsDocuments();
  }

  getPendingDetailsDocuments() {
    this.common.loading++;
    this.api.post('Vehicles/getPendingDocumentsList', { x_user_id: this.user._customer.id, x_is_admin: 1 })
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.data = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  showDetails(row, index) {
    let rowData = {
      id: row.document_id,
      vehicle_id: row.vehicle_id,
      regno: row.regno,
      document_type: row.name,
      document_type_id: row.document_type_id,
      agent: row.agent,
      agent_id: row.document_agent_id,
      wef_date: row.wef_date,
      expiry_date: row.expiry_date,
      issue_date: row.issue_date,
      remarks: row.remarks,
      img_url: row.img_url,
      doc_no: row.document_number,
      rto: row.rto,
      amount: row.amount,
      img_url2: row.img_url2,
      img_url3: row.img_url3
    };

    this.lastActiveIndex = index;

    // this.common.handleModalSize('class', 'modal-lg', '1200');
    // const activeModal = this.modalService.open(PendingDocumentComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    // activeModal.result.then(mdldata => {
    //   console.log("response:");
    //   console.log(mdldata);
    //   this.getPendingDetailsDocuments();
    // });
    console.log('----------------------------------------------');
    console.log('Data: ', rowData);
    console.log('----------------------------------------------');

    this.modalOpenHandling({ rowData, title: 'Update Document', canUpdate: 1 });
    // if (!this.modal.first.show || !this.modal.second.show) {
    //   setTimeout(() => {
    //     this.showDetails(this.data[index + 1], index + 1);
    //   }, 5000);
    // }
  }

  deleteDocument(row) {
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
          this.api.post('Vehicles/deleteDocumentById', { x_document_id: row.document_id, x_remarks: remark, x_user_id: this.user._customer.id })
            .subscribe(res => {
              this.common.loading--;
              console.log("data", res);
              this.getPendingDetailsDocuments();
              this.common.showToast("Success Delete");
            }, err => {
              this.common.loading--;
              console.log(err);
              this.getPendingDetailsDocuments();
            });
        }
      })
    }
  }

  modalOpenHandling(params) {
    console.log('Handler Start: ', this.modal.active);
    if (!this.modal.active) {
      this.modal.first.class = 'custom-active-modal';
      this.modal.first.show = true;
      this.handleModalData('first', params);
      this.modal.active = 'first';
    } else if (this.modal.active == 'first') {
      this.modal.second.class = 'custom-passive-modal';
      this.modal.second.show = true;
      this.handleModalData('second', params);
      this.modal.active = 'first';
    } else if (this.modal.active == 'second') {
      this.modal.first.class = 'custom-passive-modal';
      this.modal.first.show = true;
      this.handleModalData('first', params);
      this.modal.active = 'second';
    }
    console.log('Handler End: ', this.modal.active);

  }

  handleModalData(modal, params) {

    this.modal[modal].data.title = 'Active Modala: ' + modal;
    this.modal[modal].data.btn1 = params.btn1 || 'Update';
    this.modal[modal].data.btn2 = params.btn2 || 'Discard Image';

    // console.log("user identifation: ", this.user._customer);

    if (!params.canUpdate) {
      this.modal[modal].data.canUpdate = 0;
      this.modal[modal].data.canreadonly = true;
    }

    this.modal[modal].data.document = params.rowData;
    // console.log("pending data:", params.rowData);
    if (this.modal[modal].data.document.issue_date)
      this.modal[modal].data.document.issue_date = this.common.dateFormatter(this.modal[modal].data.document.issue_date, 'ddMMYYYY').split(' ')[0];
    if (this.modal[modal].data.document.wef_date)
      this.modal[modal].data.document.wef_date = this.common.dateFormatter(this.modal[modal].data.document.wef_date, 'ddMMYYYY').split(' ')[0];
    if (this.modal[modal].data.document.expiry_date)
      this.modal[modal].data.document.expiry_date = this.common.dateFormatter(this.modal[modal].data.document.expiry_date, 'ddMMYYYY').split(' ')[0];

    // console.log("doc params rcvd");
    // console.log(this.modal[modal].data.document);
    // console.log("typid:" + this.modal[modal].data.document.document_type_id);
    this.modal[modal].data.vehicleId = this.modal[modal].data.document.vehicle_id;
    // console.log("vehicleid:" + this.modal[modal].data.vehicleId + "=>" + this.modal[modal].data.document.vehicle_id);
    this.modal[modal].data.agentId = this.modal[modal].data.document.agent_id;
    this.getDocumentsData(modal);
    this.getDocumentPending(modal);

    // console.log("doc data:");
    // console.log(this.document);
    if (this.modal[modal].data.document.img_url != "undefined" && this.modal[modal].data.document.img_url) {
      this.modal[modal].data.imgs.push(this.modal[modal].data.document.img_url);
    }
    if (this.modal[modal].data.document.img_url2 != "undefined" && this.modal[modal].data.document.img_url2) {
      this.modal[modal].data.imgs.push(this.modal[modal].data.document.img_url2);
    }
    if (this.modal[modal].data.document.img_url3 != "undefined" && this.modal[modal].data.document.img_url3) {
      this.modal[modal].data.imgs.push(this.modal[modal].data.document.img_url3);
    }
    this.modal[modal].data.images = this.modal[modal].data.imgs;
    // console.log("images:");
    // console.log(this.modal[modal].data.imgs);
  }

  getDocumentPending(modal) {
    const params = {
      x_user_id: this.user._customer.id,
      x_document_id: this.modal[modal].data.document.id,
    }
    this.common.loading++;
    console.log('Params: ', params);
    this.api.post('Vehicles/getPendingDocDetail', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("pending detalis:", res);
        this.modal[modal].data.document.img_url = res["data"][0].img_url;
        this.modal[modal].data.document.img_url2 = res["data"][0].img_url2;
        this.modal[modal].data.document.img_url3 = res["data"][0].img_url3;
        if (this.modal[modal].data.document.img_url != "undefined" && this.modal[modal].data.document.img_url) {
          this.modal[modal].data.images.push(this.modal[modal].data.document.img_url);
        }
        if (this.modal[modal].data.document.img_url2 != "undefined" && this.modal[modal].data.document.img_url2) {
          this.modal[modal].data.images.push(this.modal[modal].data.document.img_url2);
        }
        if (this.modal[modal].data.document.img_url3 != "undefined" && this.modal[modal].data.document.img_url3) {
          this.modal[modal].data.images.push(this.modal[modal].data.document.img_url3);
        }
        // console.log("msg:",res["data"][0].errormsg,);   
        if (res["msg"] != "success") {
          alert(res["msg"]);
          this.closeModal(true, modal);
          console.log("sucess......");
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }


  getDocumentsData(modal) {
    this.common.loading++;
    let response;
    this.api.post('Vehicles/getAddVehicleFormDetails', { x_vehicle_id: this.modal[modal].data.vehicleId })
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.modal[modal].data.agents = res['data'].document_agents_info;
        this.modal[modal].data.docTypes = res['data'].document_types_info;
        console.log("doctypes:");
        console.log(res['data'].document_types_info);

        this.modal[modal].data.document.document_type = this.findDocumentType(this.modal[modal].data.document.document_type_id, modal);
        console.log("doctype:" + this.modal[modal].data.document.document_type);
        console.log("img_url:" + this.modal[modal].data.document.img_url);
        if (this.modal[modal].data.document.img_url) {
          if ((this.modal[modal].data.document.img_url.indexOf('.pdf') > -1) || (this.modal[modal].data.document.img_url.indexOf('.doc') > -1) || (this.modal[modal].data.document.img_url.indexOf('.docx') > -1) || (this.modal[modal].data.document.img_url.indexOf('.xls') > -1) || (this.modal[modal].data.document.img_url.indexOf('.xlsx') > -1) || (this.modal[modal].data.document.img_url.indexOf('.csv') > -1)) {
            this.modal[modal].data.doc_not_img = 1;
          }
          this.modal[modal].data.images.push({ name: "doc-img", image: this.modal[modal].data.document.img_url });
          this.common.params = { title: "Doc Image", images: this.modal[modal].data.images };
        }
        if (this.modal[modal].data.document.img_url2) {
          if ((this.modal[modal].data.document.img_url2.indexOf('.pdf') > -1) || (this.modal[modal].data.document.img_url2.indexOf('.doc') > -1) || (this.modal[modal].data.document.img_url2.indexOf('.docx') > -1) || (this.modal[modal].data.document.img_url2.indexOf('.xls') > -1) || (this.modal[modal].data.document.img_url2.indexOf('.xlsx') > -1) || (this.modal[modal].data.document.img_url2.indexOf('.csv') > -1)) {
            this.modal[modal].data.doc_not_img = 1;
          }
          this.modal[modal].data.images.push({ name: "doc-img", image: this.modal[modal].data.document.img_url2 });
          this.common.params = { title: "Doc Image", images: this.modal[modal].data.images };
        }

        if (this.modal[modal].data.document.img_url3) {
          if ((this.modal[modal].data.document.img_url2.indexOf('.pdf') > -1) || (this.modal[modal].data.document.img_url3.indexOf('.doc') > -1) || (this.modal[modal].data.document.img_url3.indexOf('.docx') > -1) || (this.modal[modal].data.document.img_url3.indexOf('.xls') > -1) || (this.modal[modal].data.document.img_url3.indexOf('.xlsx') > -1) || (this.modal[modal].data.document.img_url3.indexOf('.csv') > -1)) {
            this.modal[modal].data.doc_not_img = 1;
          }
          this.modal[modal].data.images.push({ name: "doc-img", image: this.modal[modal].data.document.img_url3 });
          this.common.params = { title: "Doc Image", images: this.modal[modal].data.images };
        }

        // console.log("doc_not_img:" + this.doc_not_img);
        console.log("in typid:" + this.modal[modal].data.document.document_type_id);
        for (var i = 0; i < this.modal[modal].data.docTypes.length; i++) {
          if (this.modal[modal].data.docTypes[i].id == this.modal[modal].data.document.document_type_id) {
            this.modal[modal].data.document.document_type = this.modal[modal].data.docTypes[i].document_type;
            console.log("dt=" + this.modal[modal].data.document.document_type);
          }
        }
        console.log("agentid:" + this.modal[modal].data.agentId);
        this.markAgentSelected(this.modal[modal].data.agentId);

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  closeModal(option, modal) {
    if (this.modal.first.show && this.modal.second.show) {
      if (modal == 'first') {
        this.modal.first.show = false;
        this.modal.second.class = 'custom-active-modal';
        this.modal.first.data = this.setModalData();
        this.modal.active = 'second';
      } else {
        this.modal.second.show = false;
        this.modal.first.class = 'custom-active-modal';
        this.modal.second.data = this.setModalData();
        this.modal.active = 'first';
      }
    } else {
      this.modal.active = '';
      this.modal[modal].show = false;
      this.modal[modal].class = '';
    }

  }

  markAgentSelected(option_val) {
    var elt = document.getElementById('doc_agent') as HTMLSelectElement;

    console.log("option:" + option_val);
    /*for(var i=0; i < elt.options.length; i++) {
      console.log("i=" + i + ", val:" + elt.options[i].value);
      if(elt.options[i].value == option_val) {
        elt.selectedIndex = i;
        break;
      }
    }*/
  }

  findDocumentType(id, modal) {
    console.log(this.modal[modal].data.docTypes);
    console.log("idpassed:" + id);
    for (var i = 0; i < this.modal[modal].data.docTypes.length; i++) {
      console.log("val:" + this.modal[modal].data.docTypes[i]);
      if (this.modal[modal].data.docTypes[i].id == id) {
        return this.modal[modal].data.docTypes[i].document_type;
      }
    }

  }

  setModalData() {
    return {
      title: '',
      btn1: '',
      btn2: '',
      agents: [],
      docTypes: [],
      vehicleId: 0,
      agentId: '',
      canUpdate: 1,
      canreadonly: false,
      spnexpdt: 0,
      current_date: new Date(),
      images: [],
      imgs: [],
      doc_not_img: 0,
      document: {
        agent: null,
        agent_id: null,
        amount: null,
        doc_no: null,
        document_type: null,
        document_type_id: null,
        expiry_date: null,
        issue_date: null,
        id: null,
        img_url: null,
        regno: null,
        newRegno: null,
        remarks: null,
        rto: null,
        vehicle_id: null,
        wef_date: null,
        img_url2: null,
        img_url3: null
      },
    }
  }

  openNextModal(modal) {
    this.showDetails(this.data[this.lastActiveIndex + 1], this.lastActiveIndex + 1);
  }

}
