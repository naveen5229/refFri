import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { MapService } from '../../services/map.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../services/account.service';

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
    sourceLat: null,
    sourceLng: null,
    destinationCity: null,
    destinationLat: null,
    destinationLng: null,
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
  // vehicleRegNo= document.getElementById('vehicleno')['value'];
  constructor(
    private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public mapService: MapService,
    public accountService: AccountService,
  ) {
    let date = new Date();
    date.setDate(date.getDate());
    this.mainfesto.date = date;
    this.mainfesto.ewayExpDate = date;

    // this.mainfesto.date = this.common.dateFormatter1(new Date(this.mainfesto.date));
    // this.mainfesto.ewayExpDate = this.common.dateFormatter1(new Date(this.mainfesto.ewayExpDate));
    this.getPendingLtlLr();
    // this.api.getBranches();

  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.mapService.autoSuggestion("sourceCity", (place, lat, long) => {
      this.mainfesto.sourceCity = place;
      this.mainfesto.sourceLat = lat;
      this.mainfesto.sourceLng = long;
    });
    this.mapService.autoSuggestion("destinationCity", (place, lat, long) => {
      this.mainfesto.destinationCity = place;
      this.mainfesto.destinationLat = lat;
      this.mainfesto.destinationLng = long;
    });
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
    console.log('Vehicle Data: ', vehicle);
    this.mainfesto.vehicleId = vehicle.id;
    this.mainfesto.vehicleRegNo = vehicle.regno;
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
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/pendingLTLLr')
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

    this.lrDetails.forEach(lrDetail => {
      if (lrDetail.assignLr) {
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
      sourceLat: this.mainfesto.sourceLat,
      sourceLng: this.mainfesto.sourceLng,
      destination: this.mainfesto.destinationCity,
      destinationLat: this.mainfesto.destinationLat,
      destinationLng: this.mainfesto.destinationLng,
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
      otherDetails: JSON.stringify(this.otherDetails)
    }
    console.log("params", this.mainfesto)

    this.api.post('LorryReceiptsOperation/saveManifesto', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'][0].r_id > 0) {
          this.common.showToast("LR Generated Successfully");
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

}
