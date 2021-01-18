import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { AddConsigneeComponent } from '../LRModals/add-consignee/add-consignee.component';
import { DatePipe, NumberFormatStyle } from '@angular/common';


declare var google: any;
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'edit-lorry-details',
  templateUrl: './edit-lorry-details.component.html',
  styleUrls: ['./edit-lorry-details.component.scss']
})
export class EditLorryDetailsComponent implements OnInit {
  showMain = true;
  showAgentLayout = false;
  images = [];
  tonnage = '';
  LrData = null;
  vehId = "";
  lrDate = null;
  payType = "toPay";
  regno = '';
  taName = '';
  consignerName = '';
  materialName = '';
  consineeName = ''
  isUpdated = false;
  option = 'accept';
  tempDate = null;
  status = 1;

  transportAgentDetails = {
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
  };

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService,
    public datepipe: DatePipe,
    private modalService: NgbModal) {
    if (this.common.params) {
      this.LrData = this.common.params.details;
      console.log("LrData", this.LrData);
      this.regno = this.LrData.regno;
      this.vehId = this.LrData.vehicle_id;
      this.taName = this.LrData.ta_name;
      this.consignerName = this.LrData.consigner_name;
      this.consineeName = this.LrData.consignee_name;
      this.materialName = this.LrData.material_name;
      this.payType = this.LrData.pay_type;
      this.regno = this.LrData.regno;
      this.vehId = this.LrData.vehicle_id;
      this.images[0] = this.LrData.lr_image;
      //this.lrDate=this.datepipe.transform(this.LrData.lr_date, 'dd/MM/yyyy');
      if (this.LrData.lr_date != null) {
        this.lrDate = this.LrData.lr_date;
        this.lrDate = this.common.dateFormatter1(this.lrDate);
        console.log('lrDate: ', this.lrDate);
      }
      // this.lrDate=this.common.dateFormatter(this.lrDate,'ddMMYYYY',false,'/');

    }
  }

  ngOnDestroy(){}
ngOnInit() {
  }


  searchVehicle(vehicleList) {
    console.log('vehiclelist: ', vehicleList);
    this.vehId = vehicleList.id;
    console.log("id:", this.vehId);
    return this.vehId;

  }

  loadImage(flag) {
    if (flag == 'LR') {
      this.images[0] = this.LrData.lr_image;
      console.log('LR', this.images[0]);

    } else if (flag == 'Invoice') {

      if (this.LrData.invoice_image) {
        this.images[0] = this.LrData.invoice_image;
        console.log('Invoice', this.images[0]);
      } else { this.common.showError('Image not present!!') }

    } else if (flag == 'Other') {

      if (this.LrData.other) {
        this.images[0] = this.LrData.other;
        console.log('Invoice', this.images[0]);
      } else { this.common.showError('Image not present!!') }
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.close({ isUpdated: this.isUpdated });
  }

  getDate() {
    this.common.params = { ref_page: 'lrDetails' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.lrDate = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        // if(this.lrDate<=this.common.dateFormatter(new Date())){
        //   return;
        // }else{
        //   this.common.showToast('Incorrect Date !!')
        // }
        // this.dateByIcon=true;
        console.log('lrdate: by getDate ' + this.lrDate);

      }

    });
  }

  add() {
    this.modalService.open(AddConsigneeComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', windowClass: "drag-box" })
  }
  addAgentName() {
    this.showMain = false;
    this.showAgentLayout = true;
    this.common.handleModalSize('class', 'modal-lg', '1300');
  }

  searchName(nameList, flag) {
    if (flag == 'Consignee') {
      this.LrData.consignee_id = nameList.id;
      this.LrData.consignee_name = nameList.name;
      return this.LrData.consignee_id;
    } else {
      this.LrData.consigner_id = nameList.id;
      this.LrData.consigner_name = nameList.name;
      return this.LrData.consigner_id;
    }
  }

  searchTaName(TaList) {
    console.log("list", TaList);
    this.LrData.ta_id = TaList.id;
    this.LrData.ta_name = TaList.name;
    return this.LrData.ta_id;

  }

  insertAgentInfo() {
    let params = {
      gstin: this.transportAgentDetails.gstin,
      name: this.transportAgentDetails.name,
      pan: this.transportAgentDetails.pan,
      city: this.transportAgentDetails.city,
      sbname1: this.transportAgentDetails.sbname1,
      sbmobile1: this.transportAgentDetails.sbmobile1,
      sbname2: this.transportAgentDetails.sbname2,
      sbmobile2: this.transportAgentDetails.sbmobile2,
      sbname3: this.transportAgentDetails.sbname3,
      sbmobile3: this.transportAgentDetails.sbmobile3,
    };
    console.log('params agent info', params);
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/InsertTransportAgent', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ' + res['data']);
        this.common.showToast('Success !!');
        this.showAgentLayout = false;
        this.common.handleModalSize('class', 'modal-lg', '1000');
        this.showMain = true;
      }, err => {
        this.common.loading--;
        this.common.showError();
        this.showAgentLayout = false;
        this.common.handleModalSize('class', 'modal-lg', '1000');
        this.showMain = true;
      })

  }

  changePayType() {
    this.LrData.pay_type = this.payType;
    console.log('paytype to change', this.LrData.pay_type);
  }

  resetView() {
    this.showAgentLayout = false;
    this.common.handleModalSize('class', 'modal-lg', '1000');
    this.showMain = true;
  }

  searchMaterialType(MaterialList) {
    this.LrData.material = MaterialList.id;
    this.LrData.material_name = MaterialList.name;
    return this.LrData.material;
  }

  insertLrDetails() {
    //if(!this.dateByIcon)
    let params;
    if (this.option == 'reject') {
      this.tempDate = null;
      console.log('if block');
      params = {
        sourceLat: this.LrData.source_lat ? this.LrData.source_lat : '',
        sourceLng: this.LrData.source_long ? this.LrData.source_long : '',
        source: this.LrData.source ? this.LrData.source : '',
        dest: this.LrData.destination ? this.LrData.destination : '',
        destLat: this.LrData.destination_lat ? this.LrData.destination_lat : '',
        destLng: this.LrData.destination_long ? this.LrData.destination_long : '',
        vehId: this.vehId ? this.vehId : '',
        remark: this.LrData.remark ? this.LrData.remark : '',
        id: this.LrData.id ? this.LrData.id : '',
        receiptNo: this.LrData.receipt_no ? this.LrData.receipt_no : '',
        status: this.status,
        taId: this.LrData.ta_id ? this.LrData.ta_id : '',
        taName: this.LrData.ta_name ? this.LrData.ta_name : '',
        consignerId: this.LrData.consigner_id ? this.LrData.consigner_id : '',
        tonnage: this.LrData.weight ? this.LrData.weight : '',
        consignerName: this.LrData.consigner_name ? this.LrData.consigner_name : '',
        consigneeId: this.LrData.consignee_id ? this.LrData.consignee_id : '',
        consigneeName: this.LrData.consignee_name ? this.LrData.consignee_name : '',
        lrDate: this.lrDate ? this.lrDate : '',
        payType: this.LrData.pay_type ? this.LrData.pay_type : '',
        rate: this.LrData.rate ? this.LrData.rate : '',
        amount: this.LrData.amount ? this.LrData.amount : '',
        material: this.LrData.material_name ? this.LrData.material_name : '',
        materialId: this.LrData.material ? this.LrData.material : ''

      };
    } else {
      console.log('else block');
      this.tempDate = this.common.dateFormatter(this.lrDate, 'ddMMYYYY', false, '/');
      this.lrDate = this.common.dateFormatter1(new Date(this.lrDate));
      console.log('tempDate', this.tempDate);
      // this.lrDate=this.datepipe.transform(this.lrDate, 'yyyy/MM/dd');
      params = {
        sourceLat: this.LrData.source_lat,
        sourceLng: this.LrData.source_long,
        source: this.LrData.source,
        dest: this.LrData.destination,
        destLat: this.LrData.destination_lat,
        destLng: this.LrData.destination_long,
        vehId: this.vehId,
        remark: this.LrData.remark,
        id: this.LrData.id,
        receiptNo: this.LrData.receipt_no,
        status: this.status,
        taId: this.LrData.ta_id,
        taName: this.LrData.ta_name,
        consignerId: this.LrData.consigner_id,
        tonnage: this.LrData.weight,
        consignerName: this.LrData.consigner_name,
        consigneeId: this.LrData.consignee_id,
        consigneeName: this.LrData.consignee_name,
        lrDate: this.lrDate,
        payType: this.LrData.pay_type,
        rate: this.LrData.rate,
        amount: this.LrData.amount,
        material: this.LrData.material_name,
        materialId: this.LrData.material

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
          this.isUpdated = true;
          this.dismiss();
        }
        else {
          this.common.showToast('Not Success !!');
          if (this.tempDate != null) {
            this.lrDate = this.tempDate;
            console.log('lrDate', this.lrDate);
          }
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  ngAfterViewInit(): void {
    setTimeout(this.autoSuggestion.bind(this, 'source'), 3000);
    setTimeout(this.autoSuggestion.bind(this, 'destination'), 3000);

  }

  autoSuggestion(elementId) {
    var options = {
      types: ['(cities)'],
      componentRestrictions: { country: "in" }
    };
    let ref = document.getElementById(elementId);//.getElementsByTagName('input')[0];
    let autocomplete = new google.maps.places.Autocomplete(ref, options);
    google.maps.event.addListener(autocomplete, 'place_changed', this.updateLocation.bind(this, elementId, autocomplete));
  }

  updateLocation(elementId, autocomplete) {
    console.log('tets');
    let place = autocomplete.getPlace();
    let lat = place.geometry.location.lat();
    let lng = place.geometry.location.lng();
    place = autocomplete.getPlace().formatted_address.split(',')[0];
    this.setLocations(elementId, place, lat, lng);
  }

  setLocations(elementId, place, lat, lng) {
    console.log("elementId", elementId, "place", place, "lat", lat, "lng", lng);
    if (elementId == 'source') {
      this.LrData.source = place;
      this.LrData.source_lat = lat;
      this.LrData.source_long = lng;
    } else if (elementId == 'destination') {
      this.LrData.destination = place;
      this.LrData.destination_lat = lat;
      this.LrData.destination_long = lng;
    }
  }

  removeLrDetails() {
    if (this.images[0] == null) {
      console.log('image to delete', this.images[0]);
      this.common.showToast('Load LR To Delete !!');
      return;
    }

    let params = {
      lr_id: this.LrData.id,
      image_url: this.images[0]
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/deleteLr', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['msg']);
        if (res['success']) {
          this.common.showToast('Success !!');
          this.isUpdated = true;
          this.dismiss();
        } else {
          this.common.showToast('something went wrong');
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  getMaterialName() {
    //console.log(document.getElementById('material_input')['value']);
    this.LrData.material_name = document.getElementById('material_input')['value'];
    console.log('getMaterialName', this.LrData.material_name);
  }

  checkDateFormat() {
    let dateValue = this.lrDate;
    console.log('this.lrdate', this.lrDate);
    if (dateValue.length < 8) return;
    let date = dateValue[0] + dateValue[1];
    let month = dateValue[2] + dateValue[3];
    let year = dateValue.substring(4, 8);
    // this.lrDate= date + '/' + month + '/' + year;
    this.lrDate = year + '-' + month + '-' + date;
    // if(this.lrDate<=this.common.dateFormatter(new Date()))
    // {
    //   return;
    // }else{
    //   this.common.showToast('Incorrect Date !!');
    // }

    console.log('Date: ', this.lrDate);
  }


  resetValues() {
    this.LrData.receipt_no = null;
    this.LrData.source = null;
    this.LrData.source_lat = null;
    this.LrData.source_long = null;
    this.LrData.destination = null;
    this.LrData.destination_lat = null;
    this.LrData.destination_long = null;
    this.LrData.remark = null;
    this.LrData.ta_name = null;
    this.LrData.ta_id = null;
    this.LrData.consigner_name = null;
    this.LrData.consigner_id = null;
    this.LrData.consignee_name = null;
    this.LrData.pay_type = null;
    this.LrData.weight = null;
    this.LrData.amount = null;
    this.LrData.material = null;
    this.LrData.material_id = null;
    this.LrData.rate = null;
    this.vehId = null;
    this.LrData.lr_date = null;
  }

  changeStatusType() {
    if (this.option == "reject") {
      this.status = -1;
    } else {
      this.status = 1;
    }
  }




}
