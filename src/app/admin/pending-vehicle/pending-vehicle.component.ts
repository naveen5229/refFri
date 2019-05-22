import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'pending-vehicle',
  templateUrl: './pending-vehicle.component.html',
  styleUrls: ['./pending-vehicle.component.scss']
})
export class PendingVehicleComponent implements OnInit {

  data = [];
  userdata = [];
  columns = [];
  columns2 = []

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

  documentTypes = [];
  modelType = [];
  vehicleId = -1;

  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getPendingDetailsVehicle();
    this.getAllTypesOfBrand();
    this.common.refresh = this.refresh.bind(this);
    //this.common.currentPage = 'Pending Vehicle Documents';
  }

  ngOnInit() {
  }

  refresh() {
    console.log('Refresh');

    window.location.reload();

  }

  getPendingDetailsVehicle() {
    let params = "&vehicleId=" + this.vehicleId;
    this.common.loading++;
    this.api.get('vehicles/getPendingFoVehicleBrands?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.data = res['data'];
        if (this.data.length) {
          for (var key in this.data[0]) {
            if (key.charAt(0) != "_")
              this.columns.push(key);
          }
          console.log("columns");
          console.log(this.columns);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  getAllTypesOfBrand() {
    this.api.get('vehicles/getVehicleBrandsMaster')
      .subscribe(res => {
        this.documentTypes = res['data'];
        console.log("All Type Docs: ", this.documentTypes);
      }, err => {
        console.log(err);
      });
  }
  getAllTypesOfModel(brandId, modal) {
    let params = "&brandId=" + brandId;
    this.api.get('vehicles/getVehicleModelsMaster?' + params)
      .subscribe(res => {
        this.modelType = res['data'];
        this.modal[modal].data.modelType = this.modelType;
        console.log("All Type Model: ", this.modal[modal].data.modelType);
      }, err => {
        console.log(err);
      });
  }

  showDetails(row) {
    console.log("row:", row);
    let rowData = {

      vehicle_id: row._vid,
    };
    console.log("Model  Id:", rowData);
    this.modalOpenHandling({ rowData, title: 'Update Vehicle', canUpdate: 1 });
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
    this.modal[modal].data.title = params.title;
    this.modal[modal].data.btn1 = params.btn1 || 'Update';
    this.modal[modal].data.btn2 = params.btn2 || 'Discard Image';

    if (!params.canUpdate) {
      this.modal[modal].data.canUpdate = 0;
      this.modal[modal].data.canreadonly = true;
    }

    this.modal[modal].data.document = params.rowData;
    this.modal[modal].data.vehicleId = params.rowData.vehicle_id;
    console.log("Modal Data........", this.modal[modal].data.vehicleId);

    if (this.modal[modal].data.document.wef_date)
      this.modal[modal].data.document.wef_date = this.common.dateFormatter(this.modal[modal].data.document.wef_date, 'ddMMYYYY').split(' ')[0];
    if (this.modal[modal].data.document.expiry_date)
      this.modal[modal].data.document.expiry_date = this.common.dateFormatter(this.modal[modal].data.document.expiry_date, 'ddMMYYYY').split(' ')[0];

    this.modal[modal].data.vehicleId = this.modal[modal].data.document.vehicle_id;

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

    this.getvehiclePending(modal);
    this.modal[modal].data.docTypes = this.documentTypes;
  }

  getvehiclePending(modal, fornext?) {
    console.log('Modal data: ', this.modal[modal].data);
    let params = "&vehicleId=" + this.modal[modal].data.vehicleId;
    console.log('Params: ', params);
    this.api.get(' vehicles/getPendingFoVehicleBrands?' + params)
      .subscribe(res => {
        console.log("pending detalis:", res);
        this.modal[modal].data.document.id = res['data'][0]._vid;
        this.modal[modal].data.document.newRegno = res['data'][0].Vehicle;
        this.modal[modal].data.document.img_url = res["data"][0]._rcimage;
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
          console.log("sucess......");
        }

      }, err => {
        // this.common.loading--;
        console.log(err);
      });

  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }


  deleteVehicle(row) {
    let remark;
    let ret = confirm("Are you sure you want to delete this vehicle?");
    if (ret) {
      this.common.params = { RemarkModalComponent, title: 'Delete vehicle' };
      const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("reason For delete: ", data.remark);
          remark = data.remark;
          this.common.loading++;
          this.api.post('Vehicles/deleteDocumentById', { x_document_id: row._docid, x_remarks: remark, x_user_id: this.user._details.id, x_deldoc: 1 })
            .subscribe(res => {
              this.common.loading--;
              console.log("data", res);
              this.columns = [];
              this.getPendingDetailsVehicle();
              this.common.showToast("Success Delete");
            }, err => {
              this.common.loading--;
              console.log(err);
              this.getPendingDetailsVehicle();
            });
        }
      })
    }
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

    console.log("option:" + option_val);
    /*for(var i=0; i < elt.options.length; i++) {
      console.log("i=" + i + ", val:" + elt.options[i].value);
      if(elt.options[i].value == option_val) {
        elt.selectedIndex = i;
        break;
      }
    }*/
  }
  // (0[1-9]|10|11|12)/20[0-9]{2}$
  checkDatePattern(strdate) {
    let dateformat = /^((0[1-9])|(1[0-2]))\/(\d{4})$/;
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
        console.log("api result", res);
        alert(res['msg']);
        this.closeModal(true, modal);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;
  }

  updateVehicle(modal, status?, confirm?) {


    if (this.user._loggedInBy == 'admin' && this.modal[modal].data.canUpdate == 1) {
      let document = this.modal[modal].data.document;
      // let date = "-01";
      // document.wef_date = document.wef_date + date;
      let newDate = document.wef_date.split('/').reverse().join('-') + '-01';
      console.log("date:::::", document.wef_date, newDate);
      const params = {

        vehicleId: document.id,
        brandId: document.document_type_id,
        modelId: document.modalTypeId,
        manufacturingDate: newDate,
        // x_remarks: document.remarks,
      };
      console.log("Params is", params);


      if (!document.document_type_id) {
        this.common.showError("Please enter Brand Type");
        return false;
      }



      if (document.wef_date) {
        let valid = this.checkDatePattern(document.wef_date);
        if (!valid) {
          this.common.showError("Invalid manufacturing Date. Date must be in MM/YYYY format");
          return false;
        }
      }


      let issuedt_valid = 1;
      let wefdt_valid = 1;

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

      // if (document.wef_date) {
      //   params.manufacturingDate = document.wef_date.split("/").reverse().join("-");
      //   let strdt = new Date(params.manufacturingDate);
      //   if (isNaN(strdt.getTime())) {
      //     this.common.showError("Invalid Wef Date. Date formats should be DD/MM/YYYY");
      //     return false;
      //   }
      // }


      this.common.loading++;
      let response;
      this.api.post('Vehicles/updateVehicleModal', params)
        .subscribe(res => {
          this.common.loading--;
          console.log("api result", res);
          let result = (res['msg']);
          if (result == "success") {
            alert("Success");
            this.closeModal(true, modal);
          }
          else if (res['code'] != -2) {

            alert(result);

          }
          // if (res['code'] == -2) {
          //   this.openConrirmationAlert(res, params.x_advreview);

          //   console.log("res Data", res['code']);
          // }
        }, err => {
          this.common.loading--;
          console.log(err);
        });
      return response;
    }
  }

  openConrirmationAlert(data, review) {
    console.log("Data ", data);
    console.log("params :", review);
    this.common.params = {
      title: 'Confirmation ',
      description: data['msg'],
    }
    const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        let confirm = 1;
        console.log("modal active:", this.modal.active);

        this.updateVehicle(this.modal.active, review, confirm);

        //  console.log("cofirm data response:",data.response);
      }
    });
  }



  getDate(date, modal) {
    this.common.params = { ref_page: 'pending-vehicle' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.modal[modal].data.document[date] = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        this.modal[modal].data.document[date] = this.modal[modal].data.document[date].split('-').slice(0, 2).reverse().join('/');
        console.log('Date:', this.modal[modal].data.document[date]);
      }
    });
  }

  setDate(date, modal) {
    console.log("fetch Date", date);
    console.log('Date:', this.modal[modal].data.document[date]);
  }

  checkExpiryDateValidityByValue(flddate, expdate, modal) {
    let strdt1 = flddate.split("/").reverse().join("-");
    let strdt2 = expdate.split("/").reverse().join("-");
    flddate = this.common.dateFormatter(strdt1).split(' ')[0];
    expdate = this.common.dateFormatter(strdt2).split(' ')[0];
    console.log("comparing " + flddate + "-" + expdate);
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


  findDocumentType(id, modal) {
    for (var i = 0; i < this.modal[modal].data.docTypes.length; i++) {
      console.log("val:" + this.modal[modal].data.docTypes[i]);
      if (this.modal[modal].data.docTypes[i].id == id) {
        return this.modal[modal].data.docTypes[i].document_type;
      }
    }

  }

  selectBrandType(brandType, modal) {
    this.modal[modal].data.document.document_type_id = brandType.id;
    console.log('brandType id: ', brandType.id);
    // console.log("doc var", this.modal[modal].data.document.document_type_id);
    this.getAllTypesOfModel(brandType.id, modal);
  }

  selectModelType(modalType, modal) {
    console.log("Modal Type:", modalType, modal);
    this.modal[modal].data.document.modalTypeId = modalType.id;
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
          console.log("reason For delete: ", data.remark);
          remark = data.remark;
          this.common.loading++;
          this.api.post('Vehicles/deleteDocumentById', { x_document_id: id, x_remarks: remark, x_user_id: this.user._details.id, x_deldoc: 0 })
            .subscribe(res => {
              this.common.loading--;
              console.log("data", res);
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
        modelTypeId: null,
        id: null,
        img_url: null,
        regno: null,
        newRegno: null,
        remarks: null,
        vehicle_id: null,
        wef_date: null,
        img_url2: null,
        img_url3: null
      },
    }
  }

  openNextModal(modal, vehicle_id) {
    this.showDetails({ _vid: vehicle_id });

  }

  checkDateFormat(modal, dateType) {
    let dateValue = this.modal[modal].data.document[dateType];
    if (dateValue.length < 6) return;
    // let date = dateValue[0] + dateValue[1];
    let month = dateValue[0] + dateValue[1];
    let year = dateValue.substring(2, 6);
    this.modal[modal].data.document[dateType] = month + '/' + year;
    console.log('Date: ', this.modal[modal].data.document[dateType]);
  }



}



