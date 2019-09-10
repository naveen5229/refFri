import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { MapService } from '../../services/map.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../services/account.service';
import { LocationSelectionComponent } from '../../modals/location-selection/location-selection.component';

@Component({
  selector: 'generate-lr-mainfesto',
  templateUrl: './generate-lr-mainfesto.component.html',
  styleUrls: ['./generate-lr-mainfesto.component.scss', '../../pages/pages.component.css']
})
export class GenerateLrMainfestoComponent implements OnInit {
  lrDetails = [];
  mainfesto = {
    vehicleId: null,
    vehicleRegNo: null,
    sealNo: null,
    challanNo: null,
    ownerName: null,
    ownerMobile: null,
    ownerPan: null,
    ownerGst: null,
    driverName: null,
    driverMobile: null,
    ewayNo: null,
    ewayExpDate: null,
    brokerName: null,
    remarks: null,
    sourceCity: null,
    sourceId: null,
    destinationCity: null,
    destinationId: null,
    remark: null,
    date: null,
    totalAmount: null,
    advanceAmount: null,
    otherAmount: null,
    balanceAmount: null,
    selectedLr: '',
    unselectedLr: ''
  };
  otherDetails = [{
    title: null,
    value: null
  },
  {
    title: null,
    value: null
  }]
  otherTitles = [
    {
      id: 1,
      name: "Other Charges"
    }, {
      id: 2,
      name: "Loading Hamall"
    },
    {
      id: 3,
      name: "Bitty Hamall"
    },
    {
      id: 4,
      name: "Clearing Charges"
    }, {
      id: 5,
      name: "Refund Of Merchants"
    },
    {
      id: 6,
      name: "Crossing Collection"
    },
    {
      id: 7,
      name: "B.C."
    }
  ]
  assignedLr = [];
  manifestId = null;
  sourceString = "";
  destination = "";
  // vehicleRegNo= document.getElementById('vehicleno')['value'];
  constructor(
    private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public mapService: MapService,
    public accountService: AccountService,
    public activeModal: NgbActiveModal
  ) {
    this.common.handleModalSize('class', 'modal-lg', '1100');
    if (this.common.params.manifestId != undefined) {
      console.log('menifestId=', this.common.params.manifestId);
      this.manifestId = this.common.params.manifestId;
      console.log('m+', this.manifestId);
      this.getManifestDetails();
    }

    let date = new Date();
    date.setDate(date.getDate());
    this.mainfesto.date = date;
    this.mainfesto.ewayExpDate = date;

    // this.mainfesto.date = this.common.dateFormatter1(new Date(this.mainfesto.date));
    // this.mainfesto.ewayExpDate = this.common.dateFormatter1(new Date(this.mainfesto.ewayExpDate));
    this.getPendingLtlLr();

  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  ngAfterViewInit(): void {
  }

  getDate(type) {
    this.common.params = { ref_page: 'generate-lr-mainfesto' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type = 'date') this.mainfesto.date = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        else if (type = 'ewayExpDate') this.mainfesto.ewayExpDate = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        console.log('lrdate: by getDate ' + this.mainfesto.date);
      }
    });
  }

  getvehicleData(vehicle) {
    this.mainfesto.vehicleId = vehicle.id;
    this.mainfesto.vehicleRegNo = vehicle.regno;
    return this.mainfesto.vehicleId;
    this.getOwnersInfo();
  }

  getOwnersInfo() {
    let params = {
      vid: this.mainfesto.vehicleId
    };
    this.common.loading++;
    this.api.post('Drivers/getOwnerAndDriverInfo', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['data'].length > 0) {
          this.mainfesto.ownerName = res['data'][0].owner_name;
          this.mainfesto.ownerMobile = res['data'][0].owner_mobile;
          this.mainfesto.ownerPan = res['data'][0].owner_pan;
          this.mainfesto.ownerGst = res['data'][0].owner_gst;
          this.mainfesto.driverName = res['data'][0].driver_name;
          this.mainfesto.driverMobile = res['data'][0].driver_mobile;
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  assignedLrs(lrAssign) {
    console.log(lrAssign);
  }
  getPendingLtlLr() {
    const params = "manifestId=" + this.manifestId + "&branchId=" + this.accountService.selected.branch.id;
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/pendingLTLLr?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.lrDetails = res['data'];
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  checkDateFormat(date, type) {
    let dateValue = date;
    let datereg = /^\d{4}[-]\d{2}[-]\d{2}$/;
    console.log('this.lrdate', date);
    if (dateValue.length < 8) return;
    if (dateValue.match(datereg))
      return;
    else {
      let date = dateValue[0] + dateValue[1];
      let month = dateValue[2] + dateValue[3];
      let year = dateValue.substring(4, 8);
      // this.lrDate= date + '/' + month + '/' + year;
      if (type = "ewayExpDate") {
        this.mainfesto.ewayExpDate = year + '-' + month + '-' + date;
      } else if (type = "date")
        this.mainfesto.date = year + '-' + month + '-' + date;
    }
  }

  resetData(event) {
    console.log(event);
    this.mainfesto.vehicleId = null;
  }


  assignMainFesto() {

    this.mainfesto.selectedLr = '';

    this.lrDetails.forEach(lrDetail => {
      if (lrDetail.r_assigned) {
        this.mainfesto.selectedLr = this.mainfesto.selectedLr.concat(lrDetail.r_id) + ',';
      }
      else {
        this.mainfesto.unselectedLr = this.mainfesto.unselectedLr.concat(lrDetail.r_id) + ',';
      }
    });
    this.mainfesto.selectedLr = this.mainfesto.selectedLr + "" + 0;
    this.mainfesto.unselectedLr = this.mainfesto.unselectedLr + "" + 0;
    this.saveMainFesto();

  }

  saveMainFesto() {

    let mainfestoDate = this.common.dateFormatter(this.mainfesto.date).split(' ')[0];
    console.log('params mainfestoDate', mainfestoDate);

    let mainfestoExpDate = this.common.dateFormatter(this.mainfesto.ewayExpDate).split(' ')[0];
    console.log('params mainfestoDate', mainfestoExpDate);
    this.common.loading++;
    let params = {
      branchId: this.accountService.selected.branch.id,
      vehicleId: this.mainfesto.vehicleId,
      vehicleRegNo: document.getElementById('vehicleno')['value'],
      challanNo: this.mainfesto.challanNo,
      sealNo: this.mainfesto.sealNo,
      challanDate: mainfestoDate,
      source: this.mainfesto.sourceCity,
      sourceId: this.mainfesto.sourceId,
      destinationId: this.mainfesto.destinationId,
      destination: this.mainfesto.destinationCity,
      ownerName: this.mainfesto.ownerName,
      ownerMobile: this.mainfesto.ownerMobile,
      lrIds: this.mainfesto.selectedLr,
      ownerPan: this.mainfesto.ownerPan,
      ownerGst: this.mainfesto.ownerGst,
      driverName: this.mainfesto.driverName,
      driverMobile: this.mainfesto.driverMobile,
      brokerName: this.mainfesto.brokerName,
      remarks: this.mainfesto.remarks,
      ewayNo: this.mainfesto.ewayNo,
      ewayExpDate: mainfestoExpDate,
      totalAmount: this.mainfesto.totalAmount,
      advanceAmount: this.mainfesto.advanceAmount,
      otherAmount: this.mainfesto.otherAmount,
      balanceAmount: this.mainfesto.balanceAmount,
      manifestId: this.manifestId ? this.manifestId : null,
      otherDetails: JSON.stringify(this.otherDetails)
    }
    console.log("params", this.mainfesto)

    this.api.post('LorryReceiptsOperation/saveManifesto', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'][0].r_id > 0) {
          this.common.showToast("Manifest Generated Successfully");
          this.closeModal();
        } else {
          this.common.showError(res['data'][0].r_msg);
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  addMore() {
    this.otherDetails.push({
      title: null,
      value: null
    })
  }

  takeActionSource(locFlag) {
    setTimeout(() => {
      console.log("takeActionSourc call::::::::::")
      this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };
      const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(res => {
        if (res && res.location.lat) {
          console.log('response----', res.location);
          if (locFlag == 'source') {
            this.mainfesto.sourceCity = res.location.name;
            this.mainfesto.sourceId = res.id;
            console.log('source:::', this.mainfesto.sourceCity, this.mainfesto.sourceId);
          } else {
            this.mainfesto.destinationCity = res.location.name;
            this.mainfesto.destinationId = res.id;
            console.log('destination:::', this.mainfesto.destinationCity, this.mainfesto.destinationId);
          }

        }
      })


    }, 1000);

  }

  getManifestDetails() {
    console.log('::::::', this.manifestId);
    const params = "manifestId=" + this.manifestId;
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/lrManifestEditDetails?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res::::::', res);
        console.log('res::::::', res['data']);
        // this.assignedLr = res['data'].lr || [];
        this.setManifestValues(res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  setManifestValues(manifestDetails) {

    console.log('menifest', manifestDetails);
    this.mainfesto.driverMobile = manifestDetails[0].driver_mobile;
    this.mainfesto.balanceAmount = manifestDetails[0].bal_amount;
    this.mainfesto.advanceAmount = manifestDetails[0].adv_amount;
    this.mainfesto.otherAmount = manifestDetails[0].others_amount;
    this.mainfesto.challanNo = manifestDetails[0].ch_num;
    this.mainfesto.brokerName = manifestDetails[0].broker_name;
    this.mainfesto.destinationCity = manifestDetails[0].destination;
    this.mainfesto.sourceCity = manifestDetails[0].source;
    this.mainfesto.sourceId = manifestDetails[0].source_siteid;
    this.mainfesto.destinationId = manifestDetails[0].dest_siteid;
    this.mainfesto.ownerMobile = manifestDetails[0].owner_mobile;
    this.mainfesto.ownerName = manifestDetails[0].owner_name;
    this.mainfesto.ownerGst = manifestDetails[0].owner_gst;
    this.mainfesto.ownerPan = manifestDetails[0].owner_pan;
    this.mainfesto.vehicleRegNo = manifestDetails[0].regno;
    this.mainfesto.vehicleId = manifestDetails[0].vid;
    this.mainfesto.remarks = manifestDetails[0].remarks;
    this.mainfesto.sealNo = manifestDetails[0].seal_num;
    this.mainfesto.ewayNo = manifestDetails[0].eway_num;
    this.mainfesto.ewayExpDate = new Date(manifestDetails[0].eway_date);
    this.mainfesto.driverName = manifestDetails[0].driver_name;
    this.mainfesto.date = new Date(manifestDetails[0].ch_date);
    if (manifestDetails[0].otherdetails != null) {
      let tempDetails;
      // tempDetails = manifestDetails.otherdetails;
      tempDetails = manifestDetails[0].otherdetails.replace(/'/g, '"');
      //tempDetails = JSON.stringify(tempDetails);
      this.otherDetails = JSON.parse(tempDetails);
      console.log('edit values;;;;;', this.mainfesto);
      console.log('other vlaues;;;;;', this.otherDetails, this.otherDetails.length);
    }
  }

  deleteLrManifest(manifestLr) {
    let params = {
      lrid: manifestLr._lrid,
      manifestId: this.manifestId
    }
    this.common.loading++;
    this.api.post('deleteLrFromManifest', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success'])
          this.common.showToast(res['msg']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }


}
