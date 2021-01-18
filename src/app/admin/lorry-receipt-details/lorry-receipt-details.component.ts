import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditLorryDetailsComponent } from '../../modals/edit-lorry-details/edit-lorry-details.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { AddConsigneeComponent } from '../../modals/LRModals/add-consignee/add-consignee.component';
declare var google: any;
import { NgZone } from '@angular/core';
import { LrGenerateComponent } from '../../modals/LRModals/lr-generate/lr-generate.component';


import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'lorry-receipt-details',
  templateUrl: './lorry-receipt-details.component.html',
  styleUrls: ['./lorry-receipt-details.component.scss', '../../pages/pages.component.css']
})
export class LorryReceiptDetailsComponent implements OnInit {
  pendinglr = [];
  fromDate = '';
  endDate = '';
  foid;
  lrType = "0";

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
  activeLrIndex = -1;

  constructor(public api: ApiService, public common: CommonService,
    public user: UserService,
    private zone: NgZone,
    public modalService: NgbModal) {
    let today;
    today = new Date();
    this.endDate = this.common.dateFormatter(today);
    this.fromDate = this.common.dateFormatter(new Date(today.setDate(today.getDate() - 6)));
    console.log('dates start and end', this.endDate, this.fromDate);
    this.getPendingLr();
    this.common.refresh = this.refresh.bind(this);

  }


  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {
    console.log('Refresh');
    this.getPendingLr();
  }

  setModalData() {
    return {
      showMain: true,
      showAgentLayout: false,
      images: [],
      tonnage: '',
      LrData: null,
      vehId: '',
      lrDate: null,
      payType: 'toPay',
      regno: '',
      taName: '',
      consignerName: '',
      materialName: '',
      consineeName: '',
      isUpdated: false,
      option: 'accept',
      tempDate: null,
      status: 1,
      transportAgentDetails: {
        gstin: '',
        name: '',
        pan: '',
        city: '',
        sbname1: '',
        sbmobile1: '',
        sbname2: '',
        sbmobile2: '',
        sbname3: '',
        sbmobile3: ''
      }
    };
  }

  getPendingLr() {

    let params = {
      startDate: this.fromDate,
      endDate: this.common.dateFormatter(this.endDate).split(' ')[0] + " 23:59:59",
      foId: this.foid,
      status: this.lrType
    };
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/getPendingLr', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        this.pendinglr = res['data'];
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  openEditLorryDetailsModel(details, modalType = 'first') {
    this.common.params = { details: Object.assign({}, details) };
    let modalRef = this.modal[modalType].data;

    modalRef.LrData = this.common.params.details;
    modalRef.regno = modalRef.LrData.regno;
    modalRef.vehId = modalRef.LrData.vehicle_id;
    modalRef.taName = modalRef.LrData.ta_name;
    modalRef.consignerName = modalRef.LrData.consigner_name;
    modalRef.consineeName = modalRef.LrData.consignee_name;
    modalRef.materialName = modalRef.LrData.material_name;
    modalRef.payType = modalRef.LrData.pay_type;
    modalRef.regno = modalRef.LrData.regno;
    modalRef.vehId = modalRef.LrData.vehicle_id;
    modalRef.images[0] = modalRef.LrData.lr_image;

    if (modalRef.LrData.lr_date != null) {
      modalRef.lrDate = modalRef.LrData.lr_date;
      modalRef.lrDate = this.common.dateFormatter1(modalRef.lrDate);
    }
    // this.lrDate

    // const activeModel = this.modalService.open(EditLorryDetailsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' })
    // this.common.handleModalSize('class', 'modal-lg', '1500');
    // activeModel.result.then(data => {
    //   if (data.isUpdated) {
    //     this.exitTicket(details);
    //     this.getPendingLr();
    //   }
    // });
  }

  modalOpenHandling(params, index) {
    this.activeLrIndex = index;
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

    setTimeout(this.autoSuggestion.bind(this, this.modal.active + '-source', this.modal.active), 300);
    setTimeout(this.autoSuggestion.bind(this, this.modal.active + '-destination', this.modal.active), 300);
  }

  handleModalData(modalType, details) {
    this.common.params = { details: Object.assign({}, details) };
    let modalRef = this.modal[modalType].data;

    modalRef.LrData = this.common.params.details;
    modalRef.regno = modalRef.LrData.regno;
    modalRef.vehId = modalRef.LrData.vehicle_id;
    modalRef.taName = modalRef.LrData.ta_name;
    modalRef.consignerName = modalRef.LrData.consigner_name;
    modalRef.consineeName = modalRef.LrData.consignee_name;
    modalRef.materialName = modalRef.LrData.material_name;
    modalRef.payType = modalRef.LrData.pay_type;
    modalRef.regno = modalRef.LrData.regno;
    modalRef.vehId = modalRef.LrData.vehicle_id;
    modalRef.images[0] = modalRef.LrData.lr_image;

    if (modalRef.LrData.lr_date != null) {
      modalRef.lrDate = modalRef.LrData.lr_date;
      modalRef.lrDate = this.common.dateFormatter1(modalRef.lrDate);
    }
  }

  enterTicket(details) {
    let result;
    let params = {
      tblRefId: 6,
      tblRowId: details.id
    };
    console.log("params", params);
    this.common.loading++;
    this.api.post('TicketActivityManagment/insertTicketActivity', params)
      .subscribe(res => {
        this.common.loading--;
        result = res;
        console.log(result);
        if (!result['success']) {
          //alert(result.msg);
          return false;
        }
        else {
          // this.openEditLorryDetailsModel(details);
          this.modalOpenHandling(details, this.activeLrIndex);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  exitTicket(details) {
    let result;
    var params = {
      tblRefId: 6,
      tblRowId: details.id
    };
    console.log("params", params);
    this.common.loading++;
    this.api.post('TicketActivityManagment/updateActivityEndTime', params)
      .subscribe(res => {
        this.common.loading--;
        result = res
        console.log(result);
        if (!result.sucess) {
          // alert(result.msg);
          return false;
        }
        else {
          return true;
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  getDate(type) {

    this.common.params = { ref_page: 'lrDetails' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {
          this.fromDate = '';
          this.fromDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('fromDate', this.fromDate);
        }
        else {
          this.endDate = '';
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.endDate);
        }

      }

    });


  }


  revertLrDetails(details) {

    let params = {
      lr_id: details.id
    };
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/revertLrDetails', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        this.common.showToast(res['msg']);
        if (res['msg'] == "Success") {
          this.getPendingLr();
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  getFolist(list) {
    this.foid = list.id;
  }

  getImage(lrDetails) {
    console.log(lrDetails);
    let images = [{
      name: "LR",
      image: lrDetails.lr_image
    },
    {
      name: "Invoice",
      image: lrDetails.invoice_image
    },
    {
      name: "Other Image",
      image: lrDetails.other_image
    }];
    console.log("images:", images);
    this.common.params = { images, title: 'LR Details' };
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout' });
  }


  searchVehicle(vehicleList, modalType) {
    let modalRef = this.modal[modalType].data;
    console.log('vehiclelist: ', vehicleList);
    modalRef.vehId = vehicleList.id;
    console.log("id:", modalRef.vehId);
    return modalRef.vehId;
  }


  loadImage(flag, modalType) {
    let modalRef = this.modal[modalType].data;
    if (flag == 'LR') {
      modalRef.images[0] = modalRef.LrData.lr_image;
      console.log('LR', modalRef.images[0]);

    } else if (flag == 'Invoice') {

      if (modalRef.LrData.invoice_image) {
        modalRef.images[0] = modalRef.LrData.invoice_image;
        console.log('Invoice', modalRef.images[0]);
      } else { this.common.showError('Image not present!!') }

    } else if (flag == 'Other') {

      if (modalRef.LrData.other) {
        modalRef.images[0] = modalRef.LrData.other;
        console.log('Invoice', modalRef.images[0]);
      } else { this.common.showError('Image not present!!') }
    }
  }



  closeModal(modalType) {
    // this.modal[modalType].show = false;
    if (this.modal.first.show && this.modal.second.show) {
      if (modalType == 'first') {
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
      this.modal[modalType].show = false;
      this.modal[modalType].class = '';
      this.modal[modalType].data = this.setModalData();
    }
    this.getPendingLr();

    // this.activeModal.close();
  }

  dismiss(modalType) {

    if (this.modal.first.show && this.modal.second.show) {
      if (modalType == 'first') {
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
      this.modal[modalType].show = false;
      this.modal[modalType].class = '';
      this.modal[modalType].data = this.setModalData();
    }
    this.exitTicket(this.modal[modalType].data.LrData);
    this.getPendingLr();
  }

  selectDate(modalType) {
    let modalRef = this.modal[modalType].data;
    this.common.params = { ref_page: 'lrDetails' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        modalRef.lrDate = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        console.log('lrdate: by getDate ' + modalRef.lrDate);
      }
    });
  }

  add(modalType) {
    this.modalService.open(AddConsigneeComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', windowClass: "drag-box" })
  }

  addAgentName(modalType) {
    let modalRef = this.modal[modalType].data;
    modalRef.showMain = false;
    modalRef.showAgentLayout = true;
    this.common.handleModalSize('class', 'modal-lg', '1300');
  }

  searchName(nameList, flag, modalType) {
    let modalRef = this.modal[modalType].data;
    if (flag == 'Consignee') {
      modalRef.LrData.consignee_id = nameList.id;
      modalRef.LrData.consignee_name = nameList.name;
      return modalRef.LrData.consignee_id;
    } else {
      modalRef.LrData.consigner_id = nameList.id;
      modalRef.LrData.consigner_name = nameList.name;
      return modalRef.LrData.consigner_id;
    }
  }

  searchTaName(TaList, modalType) {
    let modalRef = this.modal[modalType].data;
    console.log("list", TaList);
    modalRef.LrData.ta_id = TaList.id;
    modalRef.LrData.ta_name = TaList.name;
    return modalRef.LrData.ta_id;

  }



  insertAgentInfo(modalType) {
    let modalRef = this.modal[modalType].data;
    let params = {
      gstin: modalRef.transportAgentDetails.gstin,
      name: modalRef.transportAgentDetails.name,
      pan: modalRef.transportAgentDetails.pan,
      city: modalRef.transportAgentDetails.city,
      sbname1: modalRef.transportAgentDetails.sbname1,
      sbmobile1: modalRef.transportAgentDetails.sbmobile1,
      sbname2: modalRef.transportAgentDetails.sbname2,
      sbmobile2: modalRef.transportAgentDetails.sbmobile2,
      sbname3: modalRef.transportAgentDetails.sbname3,
      sbmobile3: modalRef.transportAgentDetails.sbmobile3,
    };
    console.log('params agent info', params);
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/InsertTransportAgent', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ' + res['data']);
        this.common.showToast('Success !!');
        modalRef.showAgentLayout = false;
        this.common.handleModalSize('class', 'modal-lg', '1000');
        modalRef.showMain = true;
      }, err => {
        this.common.loading--;
        this.common.showError();
        modalRef.showAgentLayout = false;
        this.common.handleModalSize('class', 'modal-lg', '1000');
        modalRef.showMain = true;
      });

  }


  changePayType(modalType) {
    let modalRef = this.modal[modalType].data;
    modalRef.LrData.pay_type = modalRef.payType;
    console.log('paytype to change', modalRef.LrData.pay_type);
  }

  resetView(modalType) {
    let modalRef = this.modal[modalType].data;
    modalRef.showAgentLayout = false;
    this.common.handleModalSize('class', 'modal-lg', '1000');
    modalRef.showMain = true;
  }

  searchMaterialType(MaterialList, modalType) {
    let modalRef = this.modal[modalType].data;
    modalRef.LrData.material = MaterialList.id;
    modalRef.LrData.material_name = MaterialList.name;
    return modalRef.LrData.material;
  }


  insertLrDetails(modalType) {
    let modalRef = this.modal[modalType].data;

    let params;
    if (modalRef.option == 'reject') {
      modalRef.tempDate = null;
      console.log('if block');
      params = {
        sourceLat: modalRef.LrData.source_lat ? modalRef.LrData.source_lat : '',
        sourceLng: modalRef.LrData.source_long ? modalRef.LrData.source_long : '',
        source: modalRef.LrData.source ? modalRef.LrData.source : '',
        dest: modalRef.LrData.destination ? modalRef.LrData.destination : '',
        destLat: modalRef.LrData.destination_lat ? modalRef.LrData.destination_lat : '',
        destLng: modalRef.LrData.destination_long ? modalRef.LrData.destination_long : '',
        vehId: modalRef.vehId ? modalRef.vehId : '',
        remark: modalRef.LrData.remark ? modalRef.LrData.remark : '',
        id: modalRef.LrData.id ? modalRef.LrData.id : '',
        receiptNo: modalRef.LrData.receipt_no ? modalRef.LrData.receipt_no : '',
        status: modalRef.status,
        taId: modalRef.LrData.ta_id ? modalRef.LrData.ta_id : '',
        taName: modalRef.LrData.ta_name ? modalRef.LrData.ta_name : '',
        consignerId: modalRef.LrData.consigner_id ? modalRef.LrData.consigner_id : '',
        tonnage: modalRef.LrData.weight ? modalRef.LrData.weight : '',
        consignerName: modalRef.LrData.consigner_name ? modalRef.LrData.consigner_name : '',
        consigneeId: modalRef.LrData.consignee_id ? modalRef.LrData.consignee_id : '',
        consigneeName: modalRef.LrData.consignee_name ? modalRef.LrData.consignee_name : '',
        lrDate: modalRef.lrDate ? modalRef.lrDate : '',
        payType: modalRef.LrData.pay_type ? modalRef.LrData.pay_type : '',
        rate: modalRef.LrData.rate ? modalRef.LrData.rate : '',
        amount: modalRef.LrData.amount ? modalRef.LrData.amount : '',
        material: modalRef.LrData.material_name ? modalRef.LrData.material_name : '',
        materialId: modalRef.LrData.material ? modalRef.LrData.material : ''

      };
    } else {
      console.log('else block');
      modalRef.tempDate = this.common.dateFormatter(modalRef.lrDate, 'ddMMYYYY', false, '/');
      modalRef.lrDate = this.common.dateFormatter1(new Date(modalRef.lrDate));
      console.log('tempDate', modalRef.tempDate);
      // this.lrDate=this.datepipe.transform(this.lrDate, 'yyyy/MM/dd');
      params = {
        sourceLat: modalRef.LrData.source_lat,
        sourceLng: modalRef.LrData.source_long,
        source: modalRef.LrData.source,
        dest: modalRef.LrData.destination,
        destLat: modalRef.LrData.destination_lat,
        destLng: modalRef.LrData.destination_long,
        vehId: modalRef.vehId,
        remark: modalRef.LrData.remark,
        id: modalRef.LrData.id,
        receiptNo: modalRef.LrData.receipt_no,
        status: modalRef.status,
        taId: modalRef.LrData.ta_id,
        taName: modalRef.LrData.ta_name,
        consignerId: modalRef.LrData.consigner_id,
        tonnage: modalRef.LrData.weight,
        consignerName: modalRef.LrData.consigner_name,
        consigneeId: modalRef.LrData.consignee_id,
        consigneeName: modalRef.LrData.consignee_name,
        lrDate: modalRef.lrDate,
        payType: modalRef.LrData.pay_type,
        rate: modalRef.LrData.rate,
        amount: modalRef.LrData.amount,
        material: modalRef.LrData.material_name,
        materialId: modalRef.LrData.material

      };
    }
    console.log('params to Insert: ', params);
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/updateLorryReceiptsDetails', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['msg']);
        if (res['success']) {
          //this.resetValues();
          this.common.showToast('Success !!');
          modalRef.isUpdated = true;
          this.closeModal(modalType);
        }
        else {
          this.common.showToast('Not Success !!');
          if (modalRef.tempDate != null) {
            modalRef.lrDate = modalRef.tempDate;
            console.log('lrDate', modalRef.lrDate);
          }
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  ngAfterViewInit(): void {

  }

  autoSuggestion(elementId, modalType) {

    var options = {
      types: ['(cities)'],
      componentRestrictions: { country: "in" }
    };
    let ref = document.getElementById(elementId);//.getElementsByTagName('input')[0];
    let autocomplete = new google.maps.places.Autocomplete(ref, options);
    google.maps.event.addListener(autocomplete, 'place_changed', this.updateLocation.bind(this, elementId, autocomplete, modalType));
  }

  updateLocation(elementId, autocomplete, modalType) {
    console.log('tets');
    let place = autocomplete.getPlace();
    let lat = place.geometry.location.lat();
    let lng = place.geometry.location.lng();
    place = autocomplete.getPlace().formatted_address.split(',')[0];
    this.setLocations(elementId, place, lat, lng, modalType);
  }

  setLocations(elementId, place, lat, lng, modalType) {
    let modalRef = this.modal[modalType].data;

    this.zone.run(() => {
      if (elementId.includes('source')) {
        modalRef.LrData.source = place;
        console.log('LrData', modalRef.LrData);
        modalRef.LrData.source_lat = lat;
        modalRef.LrData.source_long = lng;
      } else if (elementId.includes('destination')) {
        modalRef.LrData.destination = place;
        modalRef.LrData.destination_lat = lat;
        modalRef.LrData.destination_long = lng;
      }
      console.log("elementId", elementId, "place", place, "lat", lat, "lng", lng, 'modalRef', modalRef);
    });

  }

  removeLrDetails(modalType) {
    let modalRef = this.modal[modalType].data;

    if (modalRef.images[0] == null) {
      console.log('image to delete', modalRef.images[0]);
      this.common.showToast('Load LR To Delete !!');
      return;
    }

    let params = {
      lr_id: modalRef.LrData.id,
      image_url: modalRef.images[0]
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/deleteLr', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['msg']);
        if (res['success']) {
          this.common.showToast('Success !!');
          modalRef.isUpdated = true;
          this.closeModal(modalType);
        } else {
          this.common.showToast('something went wrong');
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  getMaterialName(modalType) {
    let modalRef = this.modal[modalType].data;

    modalRef.LrData.material_name = document.getElementById('material_input')['value'];
    console.log('getMaterialName', modalRef.LrData.material_name);
  }

  checkDateFormat(modalType) {
    let modalRef = this.modal[modalType].data;
    if (!modalRef.lrDate) return;
    let dateValue = modalRef.lrDate;
    console.log('this.lrdate', modalRef.lrDate);
    if (dateValue.length < 8) return;
    let date = dateValue[0] + dateValue[1];
    let month = dateValue[2] + dateValue[3];
    let year = dateValue.substring(4, 8);
    modalRef.lrDate = year + '-' + month + '-' + date;
    console.log('Date: ', modalRef.lrDate);
  }

  resetValues(modalType) {
    let modalRef = this.modal[modalType].data;

    modalRef.LrData.receipt_no = null;
    modalRef.LrData.source = null;
    modalRef.LrData.source_lat = null;
    modalRef.LrData.source_long = null;
    modalRef.LrData.destination = null;
    modalRef.LrData.destination_lat = null;
    modalRef.LrData.destination_long = null;
    modalRef.LrData.remark = null;
    modalRef.LrData.ta_name = null;
    modalRef.LrData.ta_id = null;
    modalRef.LrData.consigner_name = null;
    modalRef.LrData.consigner_id = null;
    modalRef.LrData.consignee_name = null;
    modalRef.LrData.pay_type = null;
    modalRef.LrData.weight = null;
    modalRef.LrData.amount = null;
    modalRef.LrData.material = null;
    modalRef.LrData.material_id = null;
    modalRef.LrData.rate = null;
    modalRef.vehId = null;
    modalRef.LrData.lr_date = null;
  }

  changeStatusType(modalType) {
    let modalRef = this.modal[modalType].data;

    if (modalRef.option == "reject") {
      modalRef.status = -1;
    } else {
      modalRef.status = 1;
    }
  }

  openNextModal() {
    if (this.modal.first.show && this.modal.second.show) return;
    if (this.activeLrIndex == this.pendinglr.length - 1) return;
    this.activeLrIndex++;
    let details = Object.assign({}, this.pendinglr[this.activeLrIndex]);
    console.log('---------------------------------------------');
    console.log('Details:', details);
    console.log('---------------------------------------------');
    this.modalOpenHandling(details, this.activeLrIndex);
    // this.showDetails({ _docid: 0, vehicle_id: 0 });
  }

  openGenerateLr(data) {
    let lrData = {
      lrId: data.id
    }
    this.common.params = { lrData: lrData }
    const activeModal = this.modalService.open(LrGenerateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Data:', data);
      this.getPendingLr();

    });
  }

}