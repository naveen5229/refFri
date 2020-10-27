import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';
import { AddAgentComponent } from '../documentation-modals/add-agent/add-agent.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { DocumentHistoryComponent } from '../documentation-modals/document-history/document-history.component';


@Component({
  selector: 'pending-documents',
  templateUrl: './pending-documents.component.html',
  styleUrls: ['./pending-documents.component.scss', '../../pages/pages.component.css']
})
export class PendingDocumentsComponent implements OnInit {
  data = [];
  userdata = [];
  columns = [];
  columns2 = [];

  listtype = 0;
  modal = {
    active: '',
    first: {
      show: false,
      class: '',
      data: this.setModalData(),
      nextCount: 0
    },
    second: {
      show: false,
      class: '',
      data: this.setModalData(),
      nextCount: 0
    }
  };

  documentTypes = [];



  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getPendingDetailsDocuments();
    this.getAllTypesOfDocuments();
    this.getUserWorkList();
    this.common.refresh = this.refresh.bind(this);
    this.listtype;
  }

  ngOnInit() {
  }

  refresh() {
    this.columns = [];
    this.columns2 = [];
    this.getPendingDetailsDocuments();
    this.getAllTypesOfDocuments();
    this.getUserWorkList();
  }

  getPendingDetailsDocuments() {
    this.common.loading++;
    if (this.listtype == 1) {
      this.api.post('Vehicles/getPendingDocumentsList', { x_user_id: this.user._details.id, x_is_admin: 1, x_advreview: 1 })
        .subscribe(res => {
          this.common.loading--;
          if (this.data == null) {
            this.data = [];
            return;
          }
          if (this.data.length) {
            for (var key in this.data[0]) {
              if (key.charAt(0) != "_")
                this.columns.push(key);
            }

          }
        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
    else {
      this.api.post('Vehicles/getPendingDocumentsList', { x_user_id: this.user._details.id, x_is_admin: 1 })
        .subscribe(res => {
          this.common.loading--;
          this.data = res['data'];
          if (this.data.length) {
            for (var key in this.data[0]) {
              if (key.charAt(0) != "_")
                this.columns.push(key);
            }

          }
        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
  }

  getAllTypesOfDocuments() {
    this.api.get('Vehicles/getAllDocumentTypesList')
      .subscribe(res => {
        this.documentTypes = res['data'];
      }, err => {
        console.log(err);
      });
  }

  showDetails(row) {
    let rowData = {
      id: row._docid,
      vehicle_id: row.vehicle_id,
    };
    this.modalOpenHandling({ rowData, title: 'Update Document', canUpdate: 1 });
  }

  modalOpenHandling(params) {
    if (!this.modal.active) {
      this.modal.first.class = 'custom-active-modal';
      this.modal.first.show = true;
      this.handleModalData('first', params);
      this.modal.active = 'first';
      this.modal.first.nextCount = 0;
      this.handleNextImageClick('first');
    } else if (this.modal.active == 'first') {
      this.modal.second.class = 'custom-passive-modal';
      this.modal.second.show = true;
      this.handleModalData('second', params);
      this.modal.second.nextCount = 0;
      this.handleNextImageClick('second');
      this.modal.active = 'first';
    } else if (this.modal.active == 'second') {
      this.modal.first.class = 'custom-passive-modal';
      this.modal.first.show = true;
      this.handleModalData('first', params);
      this.modal.first.nextCount = 0;
      this.handleNextImageClick('first');
      this.modal.active = 'second';
    }

  }

  handleModalData(modal, params) {
    this.modal[modal].data.title = params.title;
    this.modal[modal].data.btn1 = params.btn1 || 'Update';
    this.modal[modal].data.btn2 = params.btn2 || 'Discard Image';

    if (!params.canUpdate) {
      this.modal[modal].data.canUpdate = 0;
      this.modal[modal].data.canreadonly = true;
    }

    this.modal[modal].data.document = params.rowData;
    if (this.modal[modal].data.document.issue_date)
      this.modal[modal].data.document.issue_date = this.common.dateFormatter(this.modal[modal].data.document.issue_date, 'ddMMYYYY').split(' ')[0];
    if (this.modal[modal].data.document.wef_date)
      this.modal[modal].data.document.wef_date = this.common.dateFormatter(this.modal[modal].data.document.wef_date, 'ddMMYYYY').split(' ')[0];
    if (this.modal[modal].data.document.expiry_date)
      this.modal[modal].data.document.expiry_date = this.common.dateFormatter(this.modal[modal].data.document.expiry_date, 'ddMMYYYY').split(' ')[0];

    this.modal[modal].data.vehicleId = this.modal[modal].data.document.vehicle_id;
    this.modal[modal].data.agentId = this.modal[modal].data.document.agent_id;

    this.modal[modal].data.imgs = [];
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

    this.getDocumentPending(modal);
    this.modal[modal].data.docTypes = this.documentTypes;
  }

  getDocumentPending(modal) {
    const params = {
      x_user_id: this.user._details.id,
      x_document_id: this.modal[modal].data.document.id,
      x_advreview: this.listtype
    }
    this.api.post('Vehicles/getPendingDocDetail', params)
      .subscribe(res => {
        this.modal[modal].data.document.id = res['data'][0].document_id;
        this.modal[modal].data.document.newRegno = res['data'][0].regno;
        this.modal[modal].data.document.img_url = res["data"][0].img_url;
        this.modal[modal].data.document.img_url2 = res["data"][0].img_url2;
        this.modal[modal].data.document.img_url3 = res["data"][0].img_url3;
        this.modal[modal].data.document.rcImage = res["data"][0].rcimage;
        this.modal[modal].data.document.remarks = res["data"][0].remarks;
        this.modal[modal].data.document.review = res["data"][0].reviewcount;
        // add in 11-03-2018 fro check image is null
        this.modal[modal].data.images = [];
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
        }

      }, err => {
        // this.common.loading--;
        console.log(err);
      });

  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }


  deleteDocument(row) {
    let remark;
    let ret = confirm("Are you sure you want to delete this Document?");
    if (ret) {
      this.common.params = { RemarkModalComponent, title: 'Delete Document' };
      const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.response) {
          remark = data.remark;
          this.common.loading++;
          this.api.post('Vehicles/deleteDocumentById', { x_document_id: row._docid, x_remarks: remark, x_user_id: this.user._details.id, x_deldoc: 1 })
            .subscribe(res => {
              this.common.loading--;
              this.columns = [];
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


  selectList(id) {
    this.listtype = parseInt(id);
    this.common.loading++;
    this.api.post('Vehicles/getPendingDocumentsList', { x_user_id: this.user._details.id, x_is_admin: 1, x_advreview: parseInt(id) })
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        this.columns = [];
        if (this.data.length) {
          for (var key in this.data[0]) {
            if (key.charAt(0) != "_")
              this.columns.push(key);
          }
        }
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
      this.modal[modal].data = this.setModalData();
    }

  }

  markAgentSelected(option_val, modal) {
    var elt = document.getElementById('doc_agent-' + modal) as HTMLSelectElement;

  }

  checkDatePattern(strdate) {
    let dateformat = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
    if (dateformat.test(strdate)) {
      return true;
    } else {
      return false;
    }
  }


  checkExpiryDateValidity(modal) {
    let document = this.modal[modal].data.document;
    let issuedt_valid = 1;
    let wefdt_valid = 1;
    if (document.issue_date != "undefined" && document.expiry_date != "undefined") {
      if (document.issue_date && document.expiry_date)
        issuedt_valid = this.checkExpiryDateValidityByValue(document.issue_date, document.expiry_date, modal);
    }
    if (document.wef_date != "undefined" && document.expiry_date != "undefined") {
      if (document.wef_date && document.expiry_date)
        wefdt_valid = this.checkExpiryDateValidityByValue(document.wef_date, document.expiry_date, modal);
    }
    if (!issuedt_valid || !wefdt_valid) {
      this.common.showError("Please check the Expiry Date validity");
    }
  }

  customerByUpdate(modal) {
    let document = this.modal[modal].data.document;
    const params = {
      x_user_id: this.user._details.id,
      x_document_id: document.id,
      x_document_agent_id: document.agent_id,
      x_document_number: document.doc_no,
      x_rto: document.rto,
      x_amount: document.amount,
    }
    this.common.loading++;
    let response;
    this.api.post('Vehicles/updateVehicleDocumentByCustomer', params)
      .subscribe(res => {
        this.common.loading--;
        alert(res['msg']);
        this.closeModal(true, modal);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;
  }

  updateDocument(modal, status?, confirm?) {
    console.log("this.modal.first.nextCount", this.modal[modal].nextCount, "this.modal.first.data.images.length - 1", this.modal[modal].data.images.length - 1)
    if (this.modal[modal].nextCount < this.modal[modal].data.images.length - 1) {
      this.common.showError('Please Review All Images');
      return;
    }

    if (this.user._loggedInBy == 'admin' && this.modal[modal].data.canUpdate == 1) {
      let document = this.modal[modal].data.document;
      const params = {
        x_vehicleno: document.newRegno,
        x_vehicle_id: 0,
        x_user_id: this.user._details.id,
        x_document_id: document.id,
        x_document_type_id: document.document_type_id,
        x_document_type: this.findDocumentType(document.document_type_id, modal),
        x_issue_date: document.issue_date,
        x_wef_date: document.wef_date,
        x_expiry_date: document.expiry_date,
        x_remarks: document.remarks,
        x_advreview: status || 0,
        x_isconfirmed: confirm || 0

      };

      if (params.x_advreview == 0) {
        if (!document.document_type_id) {
          this.common.showError("Please enter Document Type");
          return false;
        }
      }

      if (document.issue_date) {
        let valid = this.checkDatePattern(document.issue_date);
        if (!valid) {
          this.common.showError("Invalid Issue Date. Date must be in DD/MM/YYYY format");
          return false;
        }
      }
      if (document.wef_date) {
        let valid = this.checkDatePattern(document.wef_date);
        if (!valid) {
          this.common.showError("Invalid Wef Date. Date must be in DD/MM/YYYY format");
          return false;
        }
      }
      if (document.expiry_date) {
        let valid = this.checkDatePattern(document.expiry_date);
        if (!valid) {
          this.common.showError("Invalid Expiry Date. Date must be in DD/MM/YYYY format");
          return false;
        }
      }

      let issuedt_valid = 1;
      let wefdt_valid = 1;
      if (document.issue_date != "undefined" && document.expiry_date != "undefined") {
        if (document.issue_date && document.expiry_date)
          issuedt_valid = this.checkExpiryDateValidityByValue(document.issue_date, document.expiry_date, modal);
      }
      if (document.wef_date != "undefined" && document.expiry_date != "undefined") {
        if (document.wef_date && document.expiry_date)
          wefdt_valid = this.checkExpiryDateValidityByValue(document.wef_date, document.expiry_date, modal);
      }
      if (issuedt_valid && wefdt_valid) {
        this.modal[modal].data.spnexpdt = 0;
      } else {
        this.modal[modal].data.spnexpdt = 1;
      }

      if (this.modal[modal].data.spnexpdt) {
        this.common.showError("Please check the Expiry Date validity");
        return false;
      }

      if (document.issue_date) {
        params.x_issue_date = document.issue_date.split("/").reverse().join("-");
        let strdt = new Date(params.x_issue_date);
        if (isNaN(strdt.getTime())) {
          this.common.showError("Invalid Issue Date. Date formats should be DD/MM/YYYY");
          return false;
        }
      }
      if (document.wef_date) {
        params.x_wef_date = document.wef_date.split("/").reverse().join("-");
        let strdt = new Date(params.x_wef_date);
        if (isNaN(strdt.getTime())) {
          this.common.showError("Invalid Wef Date. Date formats should be DD/MM/YYYY");
          return false;
        }
      }
      if (document.expiry_date) {
        params.x_expiry_date = document.expiry_date.split("/").reverse().join("-");
        let strdt = new Date(params.x_expiry_date);
        if (isNaN(strdt.getTime())) {
          this.common.showError("Invalid Expiry Date. Date formats should be DD/MM/YYYY");
          return false;
        }
      }

      this.common.loading++;
      let response;
      this.api.post('Vehicles/updateVehicleDocumentByAdmin', params)
        .subscribe(res => {
          this.common.loading--;
          let result = (res['msg']);
          if (result == "success") {
            alert("Success");
            this.closeModal(true, modal);
          }
          else if (res['code'] != -2) {

            alert(result);

          }
          if (res['code'] == -2) {
            this.openConrirmationAlert(res, params.x_advreview);

          }
        }, err => {
          this.common.loading--;
          console.log(err);
        });
      return response;
    }
  }

  openConrirmationAlert(data, review) {

    this.common.params = {
      title: 'Confirmation ',
      description: data['msg'],
    }
    const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        let confirm = 1;
        this.updateDocument(this.modal.active, review, confirm);
      }
    });
  }



  getDate(date, modal) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.modal[modal].data.document[date] = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
      }
    });
  }

  setDate(date, modal) {
    this.modal[modal].data.document[date] = this.common.dateFormatter(this.modal[modal].data.document.issue_date, 'ddMMYYYY').split(' ')[0];
  }

  checkExpiryDateValidityByValue(flddate, expdate, modal) {
    let strdt1 = flddate.split("/").reverse().join("-");
    let strdt2 = expdate.split("/").reverse().join("-");
    flddate = this.common.dateFormatter(strdt1).split(' ')[0];
    expdate = this.common.dateFormatter(strdt2).split(' ')[0];
    let d1 = new Date(flddate);
    let d2 = new Date(expdate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      this.common.showError("Invalid Date. Date formats should be dd/mm/yyyy");
      return 0;
    }
    if (d1 > d2) {
      this.modal[modal].data.spnexpdt = 1;
      return 0;
    }
    return 1;
  }

  addAgent(modal) {
    this.common.params = { title: 'Add Agent' };
    const activeModal = this.modalService.open(AddAgentComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(agtdata => {
      if (agtdata.response) {
        this.common.loading++;
        this.api.post('Vehicles/getAddVehicleFormDetails', { x_vehicle_id: this.modal[modal].data.vehicleId })
          .subscribe(res => {
            this.common.loading--;
            this.modal.first.data.agents = res['data'].document_agents_info;
            this.modal.second.data.agents = res['data'].document_agents_info;
            if (this.modal[modal].data.agents.length) {
              this.modal[modal].document.agent_id = this.modal[modal].agents[this.modal[modal].agents.length - 1].id;
              this.modal[modal].document.agent = this.modal[modal].agents[this.modal[modal].agents.length - 1].name;
            }

          }, err => {
            this.common.loading--;
            console.log(err);
          });
      }
    });

  }

  findDocumentType(id, modal) {
    for (var i = 0; i < this.modal[modal].data.docTypes.length; i++) {
      if (this.modal[modal].data.docTypes[i].id == id) {
        return this.modal[modal].data.docTypes[i].document_type;
      }
    }
  }

  selectDocType(docType, modal) {
    this.modal[modal].data.document.document_type_id = docType.id;
  }


  isValidDocument(event, modal) {
    let selected_doctype = event.target.value;
    if (selected_doctype == "") {
      this.modal[modal].data.document.document_type = "";
      this.modal[modal].data.document.document_type_id = "";
    }
  }

  getDateInDisplayFormat(strdate) {
    if (strdate)
      return strdate.split("-").reverse().join("/");
    else
      return strdate;
  }

  deleteImage(id, modal) {
    let remark;
    let ret = confirm("Are you sure you want to delete this Document?");
    if (ret) {
      this.common.params = { RemarkModalComponent, title: 'Delete Document' };
      const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.response) {
          remark = data.remark;
          this.common.loading++;
          this.api.post('Vehicles/deleteDocumentById', { x_document_id: id, x_remarks: remark, x_user_id: this.user._details.id, x_deldoc: 0 })
            .subscribe(res => {
              this.common.loading--;
              this.closeModal(true, modal);
              this.common.showToast("Success Delete");
            }, err => {
              this.common.loading--;
              console.log(err);

            });
        }
      })
    }
  }

  setModalData() {
    return {
      title: '',
      btn1: '',
      btn2: '',
      imageViewerId: (new Date()).getTime(),
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
    this.showDetails({ _docid: 0, vehicle_id: 0 });
  }

  checkDateFormat(modal, dateType) {
    let dateValue = this.modal[modal].data.document[dateType];
    if (dateValue.length < 8) return;
    let date = dateValue[0] + dateValue[1];
    let month = dateValue[2] + dateValue[3];
    let year = dateValue.substring(4, 8);
    this.modal[modal].data.document[dateType] = date + '/' + month + '/' + year;
  }


  getUserWorkList() {
    this.common.loading++;
    this.api.get('Vehicles/getDocumentsUserWorkSummary')
      .subscribe(res => {
        this.common.loading--;
        this.userdata = res['data'];
        if (this.userdata.length) {
          for (var key in this.userdata[0]) {
            if (key.charAt(0) != "_")
              this.columns2.push(key);
          }
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  History(doc_id) {
    this.common.params = { doc_id, title: 'Document Change History' };
    const activeModal = this.modalService.open(DocumentHistoryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
      }
    });
  }

  handleNextImageClick(modal) {
    setTimeout(() => {
      console.log('Modal:', modal);
      let modalElement = document.getElementsByClassName(modal == 'first' ? 'custom-modal-1' : 'custom-modal-2')[0];
      console.log('modalElement:', modalElement);
      if (modalElement) {
        let nextElement = modalElement.getElementsByClassName('next')[0];
        console.log('nextElement:', nextElement);
        if (nextElement) {
          nextElement['onclick'] = () => {
            console.log('click-next', modal, this.modal[modal].nextCount);
            this.modal[modal].nextCount++;
          }
        }
      }
    }, 5000);
  }

}
