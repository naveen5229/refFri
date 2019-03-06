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
  documents = null;
  vehId = "";
  lrDate = '';
  LrData = {
    receiptNo: null,
    source: null,
    sourceLat: null,
    sourceLng: null,
    dest: null,
    destLat: null,
    destLng: null,
    remark: null,
    taName: null,
    taId: null,
    consignerName: null,
    consignerId: null,
    consigneeId: null,
    consigneeName: null,
    payType: null,
    tonnage: null,
    amount: null,
    material: null,
    materialId: null,
    rate: null
  };
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
      this.documents = this.common.params.details;
      console.info('Document: ', this.documents);

    }
  }

  ngOnInit() {
  }

  searchVehicle(vehicleList) {
    console.log('vehiclelist: ' + vehicleList);
    this.vehId = vehicleList.id;
  }

  loadImage(flag) {
    if (flag == 'LR') {
      this.images[0] = this.documents.lr_image;
      console.log('LR', this.images[0]);

    } else if (flag == 'Invoice') {

      if (this.documents.invoice_image) {
        this.images[0] = this.documents.invoice_image;
        console.log('Invoice', this.images[0]);
      } else { this.common.showError('Image not present!!') }

    } else if (flag == 'Other') {

      if (this.documents.invoice_image) {
        this.images[0] = this.documents.other;
        console.log('Invoice', this.images[0]);
      } else { this.common.showError('Image not present!!') }
    }
  }

  dismiss(status) {
    this.activeModal.close({ status: status });
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
      this.LrData.consigneeId = nameList.id;
      this.LrData.consigneeName = nameList.name;
    } else {
      this.LrData.consignerId = nameList.id;
      this.LrData.consignerName = nameList.name;
    }
  }

  searchTaName(TaList) {
    this.LrData.taId = TaList.id;
    this.LrData.taName = TaList.name;
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
      sbmobile3: this.transportAgentDetails.sbmobile1,
    };
    console.log('params agent info', params);
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/InsertTransportAgent', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ' + res['data']);
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
    this.LrData.materialId = MaterialList.id;
    this.LrData.material = MaterialList.name;
  }

  insertLrDetails() {
    let params = {
      sourceLat: this.LrData.sourceLat,
      sourceLng: this.LrData.sourceLng,
      source: this.LrData.source,
      dest: this.LrData.dest,
      destLat: this.LrData.destLat,
      destLng: this.LrData.destLng,
      vehId: this.vehId,
      remark: this.LrData.remark,
      id: this.documents.id,
      receiptNo: this.LrData.receiptNo,
      status: this.documents.status,
      taId: this.LrData.taId,
      taName: this.LrData.taName,
      consignerId: this.LrData.consignerId,
      tonnage: this.LrData.tonnage,
      consignerName: this.LrData.consignerName,
      consigneeId: this.LrData.consigneeId,
      consigneeName: this.LrData.consigneeName,
      lrDate: this.lrDate,
      payType: this.LrData.payType,
      rate: this.LrData.rate,
      amount: this.LrData.amount,
      material: this.LrData.material,
      materialId: this.LrData.materialId

    };
    console.log('params to Insert: ', params);
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/updateLorryReceiptsDetails', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['msg']);
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
      this.LrData.sourceLat = lat;
      this.LrData.sourceLng = lng;
    } else if (elementId == 'destination') {
      this.LrData.dest = place;
      this.LrData.destLat = lat;
      this.LrData.destLng = lng;
    }
  }

  resetValues() {
    this.LrData.receiptNo=null;
    this.LrData.source=null;
    this.LrData.sourceLat=null;
    this.LrData.sourceLng=null;
    this.LrData.dest=null;
    this.LrData. destLat=null;
    this.LrData.destLng=null;
    this.LrData.remark= null;
    this.LrData.taName=null;
    this.LrData.taId=null;
    this.LrData.consignerName=null;
    this.LrData.consignerId=null;
    this.LrData.consigneeId=null;
    this.LrData.consigneeName=null;
    this.LrData.payType=null;
    this.LrData.tonnage=null;
    this.LrData.amount=null;
    this.LrData.material=null;
    this.LrData.materialId=null;
    this.LrData.rate=null;
    this.vehId=null;
    this.lrDate=null;
  }

}
