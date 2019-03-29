import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { AddConsigneeComponent } from '../LRModals/add-consignee/add-consignee.component';


declare var google: any;
@Component({
  selector: 'edit-lorry-details',
  templateUrl: './edit-lorry-details.component.html',
  styleUrls: ['./edit-lorry-details.component.scss']
})
export class EditLorryDetailsComponent implements OnInit {
  showMain = true;
  showAgentLayout = false;
  images = [];
  tonnage='';
  LrData = null;
  // oldvehId = "";
  vehId = "";
  lrDate = '';
  payType='';
  isDelete=false;
  regno = null;
  // LrData = {
  //   receiptNo: null,
  //   source: this.documents.source,
  //   sourceLat: null,
  //   sourceLng: null,
  //   dest: this.documents.destination,
  //   destLat: null,
  //   destLng: null,
  //   remark: this.documents.remark,
  //   taName: this.documents.ta_name,
  //   taId: null,
  //   consignerName: this.documents.consigner_name,
  //   consignerId: null,
  //   consigneeId: null,
  //   consigneeName: this.documents.consignee_name,
  //   payType: this.documents.pay_type,
  //   tonnage: null,
  //   amount: this.documents.amount,
  //   material: this.documents.material,
  //   materialId: null,
  //   rate: this.documents.rate
  // };
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
    private modalService: NgbModal) {
    if (this.common.params) {
      this.LrData = this.common.params.details;
      this.payType=this.LrData.pay_type;
      console.info('Document: ', this.LrData);
      this.regno = this.LrData.regno;

      this.vehId=this.LrData.vehicle_id;

    }
  }

  ngOnInit() {
  }

 
  searchVehicle(vehicleList) {
    console.log('vehiclelist: ' , vehicleList);
    this.vehId = vehicleList.id;
    return this.vehId;
    console.log("id:",this.vehId);
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

      if (this.LrData.invoice_image) {
        this.images[0] = this.LrData.other;
        console.log('Invoice', this.images[0]);
      } else { this.common.showError('Image not present!!') }
    }
  }

  dismiss(status) {
    this.activeModal.close({ status: status, isDelete:this.isDelete});
  }

  getDate() {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.lrDate = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        console.log('lrdate: ' + this.lrDate);

      }

    });
  }

  add() {
    this.modalService.open(AddConsigneeComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' })
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
    } else {
      this.LrData.consigner_id = nameList.id;
      this.LrData.consigner_name = nameList.name;
    }
  }

  searchTaName(TaList) {
    console.log("list",TaList);
    this.LrData.ta_id = TaList.id;
    this.LrData.ta_name = TaList.name;
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

  resetView() {
    this.showAgentLayout = false;
    this.common.handleModalSize('class', 'modal-lg', '1000');
    this.showMain = true;
  }

  searchMaterialType(MaterialList) {
    this.LrData.material = MaterialList.id;
    this.LrData.material_name = MaterialList.name;
  }

  insertLrDetails() {
    let params = {
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
      status: this.LrData.status,
      taId: this.LrData.ta_id,
      taName: this.LrData.ta_name,
      consignerId: this.LrData.consigner_id,
      tonnage: this.tonnage,
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
    console.log('params to Insert: ', params);
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/updateLorryReceiptsDetails', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['msg']);
        if(res['msg']=="Success"){
           this.resetValues(); 
           this.common.showToast('Success !!');
           this.isDelete=true;
           this.dismiss(false);
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
    place = autocomplete.getPlace().formatted_address;

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

  removeLrDetails(){
    let params={
      lr_id:this.LrData.id,
      image_url:this.images[0]
    };
    console.log('params: ',params);
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/deleteLr',params)
            .subscribe(res =>{
              this.common.loading--;
              console.log('res: ',res['msg']);
              this.isDelete=true;
              this.dismiss(false);
            }, err=>{
              this.common.loading--;
              this.common.showError();
            })
  }

  resetValues() {
    this.LrData.receipt_no=null;
    this.LrData.source=null;
    this.LrData.source_lat=null;
    this.LrData.source_long=null;
    this.LrData.destination=null;
    this.LrData. destination_lat=null;
    this.LrData.destination_long=null;
    this.LrData.remark= null;
    this.LrData.ta_name=null;
    this.LrData.ta_id=null;
    this.LrData.consigner_name=null;
    this.LrData.consigner_id=null;
    this.LrData.consignee_name=null;
    this.LrData.pay_type=null;
    this.LrData.tonnage=null;
    this.LrData.amount=null;
    this.LrData.material=null;
    this.LrData.material_id=null;
    this.LrData.rate=null;
    this.vehId=null;
    this.lrDate=null;
  }

}
