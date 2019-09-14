import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAgentComponent } from '../add-agent/add-agent.component';
import { DatePickerComponent } from '../../../modals/date-picker/date-picker.component';
import { ImageViewComponent } from '../../../modals/image-view/image-view.component';
import { RemarkModalComponent } from '../../../modals/remark-modal/remark-modal.component';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'pending-document',
  templateUrl: './pending-document.component.html',
  styleUrls: ['./pending-document.component.scss', '../../../pages/pages.component.css']
})
export class PendingDocumentComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';
  agents = [];
  docTypes = [];
  vehicleId = 0;
  agentId = '';
  canUpdate = 1;
  canreadonly = false;
  spnexpdt = 0;
  current_date = new Date();
  images = [];
  imgs = [];
  doc_not_img = 0;

  document = {
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
    img_url3: null,
    verify: null,
  };


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '1200');
    this.title = this.common.params.title;
    this.btn1 = this.common.params.btn1 || 'Update';
    this.btn2 = this.common.params.btn2 || 'Discard Image';

    if (!this.common.params.canUpdate) {
      this.canUpdate = 0;
      this.canreadonly = true;
    }


    this.document = this.common.params.rowData;
    if (this.document.issue_date)
      this.document.issue_date = this.common.dateFormatter(this.document.issue_date, 'ddMMMYYYY').split(' ')[0];
    if (this.document.wef_date)
      this.document.wef_date = this.common.dateFormatter(this.document.wef_date, 'ddMMMYYYY').split(' ')[0];
    if (this.document.expiry_date)
      this.document.expiry_date = this.common.dateFormatter(this.document.expiry_date, 'ddMMMYYYY').split(' ')[0];

    this.vehicleId = this.document.vehicle_id;
    this.agentId = this.document.agent_id;
    this.getDocumentsData();

    this.imgs = [];
    if (this.document.img_url != "undefined" && this.document.img_url) {
      this.imgs.push(this.document.img_url);
    }
    if (this.document.img_url2 != "undefined" && this.document.img_url2) {
      this.imgs.push(this.document.img_url2);
    }
    if (this.document.img_url3 != "undefined" && this.document.img_url3) {
      this.imgs.push(this.document.img_url3);
    }
    this.images = this.imgs;

  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  ngOnInit() {
  }

  getDocumentPending() {
    const params = {
      x_user_id: this.user._details.id,
      x_document_id: this.document.id,
    }
    this.common.loading++;
    this.api.post('Vehicles/getPendingDocDetail', params)
      .subscribe(res => {
        this.common.loading--;
        this.document.img_url = res["data"][0].img_url;
        this.document.img_url2 = res["data"][0].img_url2;
        this.document.img_url3 = res["data"][0].img_url3;
        this.images = [];
        if (this.document.img_url != "undefined" && this.document.img_url) {
          this.images.push(this.document.img_url);
        }
        if (this.document.img_url2 != "undefined" && this.document.img_url2) {
          this.images.push(this.document.img_url2);
        }
        if (this.document.img_url3 != "undefined" && this.document.img_url3) {
          this.images.push(this.document.img_url3);
        }
        if (res["msg"] != "success") {
          alert(res["msg"]);
          this.closeModal(true);
          console.log("sucess......");
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }


  getDocumentsData() {
    this.common.loading++;
    this.api.post('Vehicles/getAddVehicleFormDetails', { x_vehicle_id: this.vehicleId })
      .subscribe(res => {
        this.common.loading--;
        this.agents = res['data'].document_agents_info;
        this.docTypes = res['data'].document_types_info;
        this.document.document_type = this.findDocumentType(this.document.document_type_id);

        if (this.document.img_url) {
          if ((this.document.img_url.indexOf('.pdf') > -1) || (this.document.img_url.indexOf('.doc') > -1) || (this.document.img_url.indexOf('.docx') > -1) || (this.document.img_url.indexOf('.xls') > -1) || (this.document.img_url.indexOf('.xlsx') > -1) || (this.document.img_url.indexOf('.csv') > -1)) {
            this.doc_not_img = 1;
          }
          this.images.push({ name: "doc-img", image: this.document.img_url });
          this.common.params = { title: "Doc Image", images: this.images };
        }
        if (this.document.img_url2) {
          if ((this.document.img_url2.indexOf('.pdf') > -1) || (this.document.img_url2.indexOf('.doc') > -1) || (this.document.img_url2.indexOf('.docx') > -1) || (this.document.img_url2.indexOf('.xls') > -1) || (this.document.img_url2.indexOf('.xlsx') > -1) || (this.document.img_url2.indexOf('.csv') > -1)) {
            this.doc_not_img = 1;
          }
          this.images.push({ name: "doc-img", image: this.document.img_url2 });
          this.common.params = { title: "Doc Image", images: this.images };
        }

        if (this.document.img_url3) {
          if ((this.document.img_url2.indexOf('.pdf') > -1) || (this.document.img_url3.indexOf('.doc') > -1) || (this.document.img_url3.indexOf('.docx') > -1) || (this.document.img_url3.indexOf('.xls') > -1) || (this.document.img_url3.indexOf('.xlsx') > -1) || (this.document.img_url3.indexOf('.csv') > -1)) {
            this.doc_not_img = 1;
          }
          this.images.push({ name: "doc-img", image: this.document.img_url3 });
          this.common.params = { title: "Doc Image", images: this.images };
        }

        for (var i = 0; i < this.docTypes.length; i++) {
          if (this.docTypes[i].id == this.document.document_type_id) {
            this.document.document_type = this.docTypes[i].document_type;
          }
        }
        this.markAgentSelected(this.agentId);

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  markAgentSelected(option_val) {
    var elt = document.getElementById('doc_agent') as HTMLSelectElement;
  }

  validateRegno() {
    this.document.newRegno = (this.document.newRegno).toUpperCase();
  }

  updateDateFormat(strdate) {
    strdate = strdate.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1/$2/$3');
    return strdate;
  }


  checkExpiryDateValidity() {
    let issuedt_valid = 1;
    let wefdt_valid = 1;
    if (this.document.issue_date != "undefined" && this.document.expiry_date != "undefined") {
      if (this.document.issue_date.indexOf('/') == -1)
        this.document.issue_date = this.updateDateFormat(this.document.issue_date);

      if (this.document.expiry_date.indexOf('/') == -1)
        this.document.expiry_date = this.updateDateFormat(this.document.expiry_date);
      if (this.document.issue_date && this.document.expiry_date)

        issuedt_valid = this.checkExpiryDateValidityByValue(this.document.issue_date, this.document.expiry_date);
    }

    if (this.document.wef_date != "undefined") {
      if (this.document.wef_date.indexOf('/') == -1)
        this.document.wef_date = this.updateDateFormat(this.document.wef_date);
    }

    if (this.document.wef_date != "undefined" && this.document.expiry_date != "undefined") {
      if (this.document.wef_date.indexOf('/') == -1)
        this.document.wef_date = this.updateDateFormat(this.document.wef_date);
      if (this.document.expiry_date.indexOf('/') == -1)
        this.document.expiry_date = this.updateDateFormat(this.document.expiry_date);
      if (this.document.wef_date && this.document.expiry_date)
        wefdt_valid = this.checkExpiryDateValidityByValue(this.document.wef_date, this.document.expiry_date);
    }

    if (!issuedt_valid || !wefdt_valid) {
      this.common.showError("Please check the Expiry Date validity");
    }
  }



  checkDatePattern(strdate) {
    let dateformat = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
    if (dateformat.test(strdate)) {
      return true;
    } else {
      return false;
    }
  }

  customerByUpdate() {
    const params = {
      x_user_id: this.user._details.id,
      x_document_id: this.document.id,
      x_document_agent_id: this.document.agent_id,
      x_document_number: this.document.doc_no,
      x_rto: this.document.rto,
      x_amount: this.document.amount,
    }

    this.common.loading++;
    let response;
    this.api.post('Vehicles/updateVehicleDocumentByCustomer', params)
      .subscribe(res => {
        this.common.loading--;
        alert(res['msg']);
        this.closeModal(true);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;
  }



  updateDocument(status) {
    if (this.user._loggedInBy == 'admin' && this.canUpdate == 1) {
      const params = {
        x_vehicleno: this.document.newRegno,
        x_vehicle_id: 0,
        x_user_id: this.user._details.id,
        x_document_id: this.document.id,
        x_document_type_id: this.document.document_type_id,
        x_document_type: this.findDocumentType(this.document.document_type_id),
        x_issue_date: this.document.issue_date,
        x_wef_date: this.document.wef_date,
        x_expiry_date: this.document.expiry_date,
        x_remarks: this.document.remarks,
        x_advreview: status
      };

      if (!this.document.document_type_id) {
        this.common.showError("Please enter Document Type");
        return false;
      }

      if (this.document.issue_date) {
        let valid = this.checkDatePattern(this.document.issue_date);
        if (!valid) {
          this.common.showError("Invalid Issue Date. Date must be in DD/MM/YYYY format");
          return false;
        }
      }
      if (this.document.wef_date) {
        let valid = this.checkDatePattern(this.document.wef_date);
        if (!valid) {
          this.common.showError("Invalid Wef Date. Date must be in DD/MM/YYYY format");
          return false;
        }
      }
      if (this.document.expiry_date) {
        let valid = this.checkDatePattern(this.document.expiry_date);
        if (!valid) {
          this.common.showError("Invalid Expiry Date. Date must be in DD/MM/YYYY format");
          return false;
        }
      }

      let issuedt_valid = 1;
      let wefdt_valid = 1;
      if (this.document.issue_date != "undefined" && this.document.expiry_date != "undefined") {
        if (this.document.issue_date && this.document.expiry_date)
          issuedt_valid = this.checkExpiryDateValidityByValue(this.document.issue_date, this.document.expiry_date);
      }
      if (this.document.wef_date != "undefined" && this.document.expiry_date != "undefined") {
        if (this.document.wef_date && this.document.expiry_date)
          wefdt_valid = this.checkExpiryDateValidityByValue(this.document.wef_date, this.document.expiry_date);
      }
      if (issuedt_valid && wefdt_valid) {
        this.spnexpdt = 0;
      } else {
        this.spnexpdt = 1;
      }

      if (this.spnexpdt) {
        this.common.showError("Please check the Expiry Date validity");
        return false;
      }

      if (this.document.issue_date) {
        params.x_issue_date = this.document.issue_date.split("/").reverse().join("-");
        let strdt = new Date(params.x_issue_date);
        if (isNaN(strdt.getTime())) {
          this.common.showError("Invalid Issue Date. Date formats should be DD/MM/YYYY");
          return false;
        }
      }
      if (this.document.wef_date) {
        params.x_wef_date = this.document.wef_date.split("/").reverse().join("-");
        let strdt = new Date(params.x_wef_date);
        if (isNaN(strdt.getTime())) {
          this.common.showError("Invalid Wef Date. Date formats should be DD/MM/YYYY");
          return false;
        }
      }
      if (this.document.expiry_date) {
        params.x_expiry_date = this.document.expiry_date.split("/").reverse().join("-");
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
            this.closeModal(true);
          }
          else {
            alert(result);
          }

        }, err => {
          this.common.loading--;
          console.log(err);
        });

      return response;

    }
  }

  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.document[date] = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
      }
    });
  }

  setDate(date) {
    this.document[date] = this.common.dateFormatter(this.document.issue_date, 'ddMMYYYY').split(' ')[0];
  }

  checkExpiryDateValidityByValue(flddate, expdate) {
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
      this.spnexpdt = 1;
      return 0;
    }
    return 1;
  }

  addAgent() {
    this.common.params = { title: 'Add Agent' };
    const activeModal = this.modalService.open(AddAgentComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(agtdata => {
      if (agtdata.response) {
        this.common.loading++;
        this.api.post('Vehicles/getAddVehicleFormDetails', { x_vehicle_id: this.vehicleId })
          .subscribe(res => {
            this.common.loading--;
            this.agents = res['data'].document_agents_info;
            if (this.agents.length) {
              this.document.agent_id = this.agents[this.agents.length - 1].id;
              this.document.agent = this.agents[this.agents.length - 1].name;
            }

          }, err => {
            this.common.loading--;
            console.log(err);
          });
      }
    });

  }

  findDocumentType(id) {

    for (var i = 0; i < this.docTypes.length; i++) {
      if (this.docTypes[i].id == id) {
        return this.docTypes[i].document_type;
      }
    }

  }

  selectDocType(docType) {
    this.document.document_type_id = docType.id;
  }


  getvehicleData(vehicle) {
    this.document.vehicle_id = vehicle.id;
  }


  isValidDocument(event) {
    let selected_doctype = event.target.value;
    if (selected_doctype == "") {
      this.document.document_type = "";
      this.document.document_type_id = "";
    }
  }

  getDateInDisplayFormat(strdate) {
    if (strdate)
      return strdate.split("-").reverse().join("/");
    else
      return strdate;
  }

  deleteImage(id) {
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
              this.closeModal(true);
              this.common.showToast("Success Delete");
            }, err => {
              this.common.loading--;
              console.log(err);

            });
        }
      })
    }
  }



}
