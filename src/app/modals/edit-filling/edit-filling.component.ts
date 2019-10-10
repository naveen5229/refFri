import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { AddPumpComponent } from '../add-pump/add-pump.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'edit-filling',
  templateUrl: './edit-filling.component.html',
  styleUrls: ['./edit-filling.component.scss', '../../pages/pages.component.css']
})
export class EditFillingComponent implements OnInit {
  isFormSubmit = false;
  sizeIndex = 0;
  title = '';
  filldate = '';
  litres = 0;
  isfull = false;
  regno = '';
  rate = 0.0;
  amount = 0.0;
  pump = '';
  pump_id = 0;
  vehicleId = null;
  filling_id = 0;
  isPump = true;
  pumpPayType = '-21';
  driverCash = 0;
  odoVal = 0;
  refNo = null;
  refernceType = '0';
  refTypeName = null;
  refId = null;
  referenceName = null;
  date = null;
  ledgerId = null;
  ledgers = [];
  ledger = {
    name: '',
    id: '',
  };
  referenceType = [{
    name: 'Select Type',
    id: '0'

  },
  {
    name: 'Lr',
    id: '11'
  },
  {
    name: 'Manifest',
    id: '12'
  },
  {
    name: 'state',
    id: '13'
  },
  {
    name: 'Trip',
    id: '14'
  }];
  refernceData = [];
  edit = 0;

  showDate = '';

  constructor(private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {

    this.title = this.common.params.title;
    this.sizeIndex = this.common.params.sizeIndex
    console.log("params", this.common.params);
    let rec = this.common.params.rowfilling;
    let detail = this.common.params.info
    if (this.common.params.rowfilling) {
      this.refernceType = rec.ref_type;
      this.refId = rec.ref_id;
      if (this.refId != null) {
        this.edit = 1;
      }
      this.getReferenceData();
      this.getRefernceType(this.refernceType);

      // this.showDate = rec.fdate;
      // this.filldate = rec.fdate;
      this.litres = rec.litres;
      this.isfull = rec.is_full;
      this.rate = rec.rate;
      this.amount = rec.amount;
      this.pump = rec.pp;
      this.pump_id = rec.fuel_station_id;
      this.filling_id = rec.id;
      this.driverCash = rec.driver_cash ? rec.driver_cash : 0;
      this.odoVal = rec.odometer ? rec.odometer : 0;
    }
    else if (this.common.params.info) {
      this.refernceType = detail._reftype;
      this.refTypeName = detail._refid;
      // if (this.refId != null) {
      //   this.edit = 1;
      // }
      this.date = new Date(this.common.dateFormatter1(detail._dttime));
      this.isPump = false
      this.regno = detail._regno
      //this.date=detail._dttime
      this.vehicleId = detail._vid
    }
    if (this.common.params.title == 'Edit Fuel Filling') {
      let dateArr = rec.fdate.split('-');
      if(dateArr[2].length==2){
        dateArr[2] = '20' + dateArr[2];
      }else{
      dateArr[2] = dateArr[2];
      }
      this.date = new Date(dateArr.join('/'))
      this.vehicleId = this.common.params.rowfilling.vehicle_id;
      this.regno = this.common.params.rowfilling.regno;
      console.log("vid123", this.vehicleId);
    }
    this.common.handleModalSize('class', 'modal-lg', '700', 'px', this.sizeIndex);
    this.getAllLedger();
  }

  ngOnInit() {

  }

  getRefernceType(typeId) {
    this.referenceType.map(element => {
      if (element.id == typeId) {
        return this.referenceName = element.name;
      }
    });
    this.refernceTypes();
  }


  getReferenceData() {
    const params = "id=" + this.refId +
      "&type=" + this.refernceType;
    this.api.get('Vehicles/getRefrenceDetails?' + params)
      .subscribe(res => {
        console.log(res['data']);
        let resultData = res['data'][0];
        this.vehicleId = resultData.vid;
        this.regno = resultData.regno;
        this.refTypeName = resultData.ref_name;
        // this.id = resultData.vehasstype
        this.refernceTypes();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }



  refernceTypes() {
    let type = this.refernceType + "";
    let url = null;
    let params = {
      vid: this.vehicleId,
      regno: this.regno
    };

    switch (type) {
      case '11':
        url = "Suggestion/getLorryReceipts";
        break;
      case '12':
        url = "Suggestion/getLorryManifest";
        break;
      case '13':
        url = "Suggestion/getVehicleStates";
        break;
      case '14':
        url = "Suggestion/getVehicleTrips";
        break;
      default:
        url = null;
        return;

    }
    console.log("params", params);
    this.api.post(url, params)
      .subscribe(res => {
        this.refernceData = res['data'];
      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  resetRefernceType(isReset = true) {
    document.getElementById('referncetype')['value'] = '';
    if (isReset)
      this.refernceType = null;
    this.refernceData = [];
  }
  changeRefernceType(type) {
    console.log("Type Id", type);
    this.refId = this.refernceData.find((element) => {
      console.log(element.source_dest == type);
      return element.source_dest == type;
    }).id;
  }




  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  // getDate() {
  //   this.common.params = { ref_page: 'fuelFilling' };
  //   const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     if (data.date) {
  //       this.filldate = this.common.dateFormatter1(data.date).split(' ')[0];
  //       this.showDate = this.common.changeDateformat1(this.filldate);
  //     }
  //   });
  // }

  resetvehicle() {
    document.getElementById('vehicleno')['value'] = '';
    this.resetRefernceType();
    this.vehicleId = null;
    this.regno = null;
  }

  getPumpData(pump) {
    console.log("sel:", pump);
    this.pump_id = pump.id;
    this.pump = pump.name;
    console.log("pumpname:", this.pump);
  }

  updateAmount() {
    let calcamt = this.litres * this.rate;
    //this.amount = (Math.round(calcamt)/ 100 * 100);
    this.amount = Math.round(calcamt);
  }

  getVehData(vehicle) {
    this.vehicleId = vehicle.id;
    this.regno = vehicle.regno;
    document.getElementById('vehicleno')['value'] = '';
    this.resetRefernceType();
    console.log("reg1", this.regno);
    this.setLedger();
  }

  getAllLedger() {
    this.common.loading++;
    this.api.get('Suggestion/GetAllLedgerWrtFo')
      .subscribe(res => {
        this.common.loading--;
        this.ledgers = res['data'];
        // console.log("regnoLedger",this.ledger[0]['name']);
      },
        err => {
          this.common.loading--;
          console.error('Api Error:', err);
        });
  }

  setLedger() {
    for (var i = 0; i < this.ledgers.length; i++) {
      if (this.ledgers[i]['name'].toString().startsWith(this.regno)) {
        this.ledgerId = this.ledgers[i]['id'];
        //this.ledgerName=this.ledger[i]['name'];
        this.ledger = {
          name: this.ledgers[i]['name'],
          id: this.ledgers[i]['id'],
        }
        break;
      }
    }
  }

  submitFillingData() {
    if (this.pumpPayType == '-11') {
      this.ledgerId = null;
    } else {
      this.driverCash = 0;
    }
    if (this.date == null) {
      this.common.showError("Fill Date To Continue");
      return;
    } else {
      if (this.isfull == false) {
        this.isfull = null;
      }
      // console.log('fill date', this.filldate);
      // let fmtdate = this.common.dateFormatter1(this.filldate);
      // console.log("testing", fmtdate.indexOf(fmtdate, 0));

      // console.log("check date::", fmtdate);
      let params = {
        vehId: this.vehicleId,
        siteId: this.pump_id,
        litres: this.litres,
        rate: this.rate,
        amount: this.amount,
        fuelDetailsId: this.filling_id,
        date: this.common.dateFormatter(this.date),
        petrolPumplocation: '',
        petrolPumpName: this.pump,
        isFull: this.isfull,
        fuelCompany: '',
        petrolPumpId: this.pump_id,
        driver_cash: this.driverCash,
        ledgerId: this.ledgerId,
        odometer_val: this.odoVal,
        refNum: this.refNo,
        refType: this.refernceType,
        refId: this.refId,

      };
      console.log("rowdata", this.common.params.rowfilling);
      console.log("newparams", params);
      let apiurl = '';
      if (this.filling_id) {
        apiurl = 'FuelDetails/updateFuelDetails';
      } else {
        apiurl = 'FuelDetails/insertFuelDetails';
      }

      this.common.loading++;
      this.api.post(apiurl, params)
        .subscribe(res => {
          this.common.loading--;
          console.log("result");
          console.log(res);
          if (res["success"]) {
            this.common.showToast(res['msg']);
            // this.common.showToast("Details Updated Successfully");
            this.filldate = '';
            console.log("inside console");
            this.activeModal.close({ response: res["success"] });
          }
          else {
            this.common.showError(res['msg']);
          }

        }, err => {
          this.common.showError("Error occurred");
          this.common.loading--;
          console.log(err);
          this.filldate = '';
        });

    }

  }

  showAddPump() {
    this.common.params = { title: 'Petrol Pump' };
    this.common.handleModalHeightWidth('class', 'modal-lg', '1200', '1200');
    const activeModal = this.modalService.open(AddPumpComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        window.location.reload();
      }
    });
  }


  pumpPayStatus() {
    if (this.pumpPayType == '-11') {
      this.pump_id = parseInt(this.pumpPayType);
      this.pump = '';
    } else {
      this.pump_id = parseInt(this.pumpPayType);
      this.pump = '';
    }
  }


}
