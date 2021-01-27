import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'pending-vehicle',
  templateUrl: './pending-vehicle.component.html',
  styleUrls: ['./pending-vehicle.component.scss']
})
export class PendingVehicleComponent implements OnInit {
  workList = [];
  columns2 = [];

  data = [];
  columns = [];

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
  bodyType = [];
  emissionStandard = [];

  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getPendingDetailsVehicle();
    this.getAllTypesOfBrand();
    this.getAllBodyType();
    this.getUserWorkList();
    this.common.refresh = this.refresh.bind(this);
    this.emissionStandard = ["BS 1", "BS 2", "BS 3", "BS 4", "BS 6"];
    // this.bodyType = ["Truck(OpenBody)", "Truck(FullBody)", "Multiaxle(Trailer)", "Tanker", "Trailer", "Doubleaxle(Trailer)"]
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.columns = [];
    this.getPendingDetailsVehicle();
    this.getAllTypesOfBrand();
    this.getAllBodyType();
    this.getUserWorkList();
  }

  getPendingDetailsVehicle() {
    let params = "&vehicleId=" + this.vehicleId;
    this.common.loading++;
    this.api.get('vehicles/getPendingFoVehicleBrands?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.data = res['data'];
        if (this.data == null) {
          this.data = [];
          alert("Data Not  Available");
          return;

        }
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

  getAllBodyType() {
    this.api.get('Vehicles/getVehicleBodyTypes')
      .subscribe(res => {
        this.bodyType = res['data'];
        console.log("All Type Body: ", this.bodyType);
      }, err => {
        console.log(err);
      });
  }
  getAllTypesOfModel(brandId, modal?) {
    let params = "brandId=" + brandId;
    this.api.get('vehicles/getVehicleModelsMaster?' + params)
      .subscribe(res => {
        this.modelType = res['data'];
        this.modal[modal].data.modelType = this.modelType ? this.modelType : null;
        console.log("All Type Model: ", this.modelType);
      }, err => {
        console.log(err);
      });
  }

  showDetails(row, isNext?) {
    let rowData = {
      vehicle_id: row._vid,
    };

    this.modalOpenHandling({ rowData, title: 'Update Vehicle', canUpdate: 1 }, isNext);
  }

  modalOpenHandling(params, isNext?) {
    if (!this.modal.active) {
      this.modal.first.class = 'custom-active-modal';
      this.modal.first.show = true;
      this.handleModalData('first', params, isNext);
      this.modal.active = 'first';
    } else if (this.modal.active == 'first') {
      this.modal.second.class = 'custom-passive-modal';
      this.modal.second.show = true;
      this.handleModalData('second', params, isNext);
      this.modal.active = 'first';
    } else if (this.modal.active == 'second') {
      this.modal.first.class = 'custom-passive-modal';
      this.modal.first.show = true;
      this.handleModalData('first', params, isNext);
      this.modal.active = 'second';

    }
    console.log('Handler End: ', this.modal.active);
  }

  handleModalData(modal, params, isNext?) {
    this.modal[modal].data.title = params.title;
    this.modal[modal].data.btn1 = params.btn1 || 'Update';
    this.modal[modal].data.btn2 = params.btn2 || 'Discard Image';

    if (!params.canUpdate) {
      this.modal[modal].data.canUpdate = 0;
      this.modal[modal].data.canreadonly = true;
    }

    this.modal[modal].data.document = params.rowData;
    this.modal[modal].data.vehicleId = params.rowData.vehicle_id;

    if (this.modal[modal].data.document.wef_date)
      this.modal[modal].data.document.wef_date = this.common.dateFormatter(this.modal[modal].data.document.wef_date, 'ddMMYYYY').split(' ')[0];

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
    console.log('-------------------------Images:', this.modal[modal].data);
    this.modal[modal].data.images = this.modal[modal].data.imgs;
    console.log('Handle Next::', isNext);
    this.getvehiclePending(modal, isNext);
    this.modal[modal].data.docTypes = this.documentTypes;
    this.modal[modal].data.modelType = this.modelType;
    this.modal[modal].data.bodyType = this.bodyType;
  }

  getvehiclePending(modal, isNext?) {

    console.log('Modal data: ', this.modal[modal].data);
    let params = "vehicleId=" + this.modal[modal].data.vehicleId;
    if (isNext != -1) {
      params += '&forNext=1';
    }
    console.log('Params: ', params);
    this.api.get(' vehicles/getPendingFoVehicleBrands?' + params)
      .subscribe(res => {
        console.log("pending detalis:", res);
        let data = res['data'][0];
        this.modal[modal].data.document.id = res['data'][0]._vid;
        this.modal[modal].data.document.newRegno = res['data'][0].Vehicle;
        this.modal[modal].data.document.document_type_id = res['data'][0]._brandid;
        this.modal[modal].data.document.document_type = res['data'][0].Brand;
        this.modal[modal].data.document.wef_date = data._manfdate ? data._manfdate.split('-').slice(0, 2).reverse().join('/') : '';
        this.modal[modal].data.document.img_url = res["data"][0]._rcimage;
        this.modal[modal].data.document.img_url2 = res["data"][0]._rcimage2;
        this.modal[modal].data.document.img_url3 = res["data"][0]._rcimage3;
        this.modal[modal].data.document._bscode = res["data"][0]._bscode;
        this.modal[modal].data.document.bodyTypeId = res["data"][0]._bodytypeid;
        this.modal[modal].data.document.chasisNo = res["data"][0].chasisNo;
        this.modal[modal].data.document.engineNo = res["data"][0].engineNo;
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
        console.log('-------------------------Images:', this.modal[modal].data);


        this.getAllTypesOfModel(this.modal[modal].data.document.document_type_id);


        if (this.modal[modal].data.document.bodyTypeId) {
          this.getAllBodyType();
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



  updateVehicle(modal, status?, confirm?) {


    if (this.user._loggedInBy == 'admin' && this.modal[modal].data.canUpdate == 1) {
      let document = this.modal[modal].data.document;

      let newDate = document.wef_date.split('/').reverse().join('-') + '-01';
      const params = {
        vehicleId: document.id,
        brandId: document.document_type_id,
        modelId: document.modalTypeId ? document.modalTypeId : null,
        manufacturingDate: newDate,
        emsId: document._bscode,
        bodyTypeId: document.bodyTypeId,
        chasisNo: document.chasisNo,
        engineNo:document.engineNo
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
      if (!document.modalTypeId) {
        this.common.showError("Please enter Model Type");
        return false;
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
      this.common.loading++;
      let response;
      this.api.post('Vehicles/updateVehicleModal', params)
        .subscribe(res => {
          this.common.loading--;
          console.log("api result", res);
          let result = (res['success']);
          if (result == true) {
            alert("Success");
            this.closeModal(true, modal);
          }

          if (res['success'] == false) {
            alert(res['data']);
          }


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
    this.modelType = [];
    this.modal[modal].data.document.modalTypeId = null;
    this.modal[modal].data.document.document_type_id = brandType.id;
    console.log('brandType id: ', brandType.id);
    this.getAllTypesOfModel(brandType.id, modal);
  }

  selectModelType(modalType, modal) {
    console.log("select model", modalType.target.value);
    let name = modalType.target.value;
    let modelId = this.modelType.filter(x => x.name === name)[0];
    this.modal[modal].data.document.modalTypeId = modelId.id;
    console.log("Modal Type:", this.modal[modal].data.document.modalTypeId);
  }


  isValidDocument(event, modal) {
    // let selected_doctype = event.target.value;
    // if (selected_doctype == "") {
    //   this.modal[modal].data.document.document_type = "";
    //   this.modal[modal].data.document.document_type_id = "";
    // }
  }

  getDateInDisplayFormat(strdate) {
    if (strdate)
      return strdate.split("-").reverse().join("/");
    else
      return strdate;
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
        img_url2: null,
        img_url3: null,
        regno: null,
        newRegno: null,
        vehicle_id: null,
        wef_date: null,
        _bscode: null,
        bodyType: null,
        bodyTypeId: null,
      },
    }
  }

  openNextModal(modal, vehicle_id) {
    console.log('Handle Next: Open Next Modal');
    this.showDetails({ _vid: vehicle_id }, true);

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


  onbodyType(e, modal) {
    let name = e.target.value;
    let listId = this.bodyType.filter(x => x.name === name)[0];


    this.modal[modal].data.document.bodyTypeId = listId.id;



  }

  getUserWorkList() {
    this.workList = [];
    this.columns2 = [];
    this.common.loading++;
    this.api.get('Vehicles/getVehiclesUserWorkSummary')
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.workList = res['data'];
        if (this.workList == null) {
          this.workList = [];
          this.common.showError("Work List No Data Record Available");
          return;
        }
        if (this.workList.length) {
          for (var key in this.workList[0]) {
            if (key.charAt(0) != "_")
              this.columns2.push(key);
          }

        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }





}






