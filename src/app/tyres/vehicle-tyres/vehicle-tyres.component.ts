import { Component, OnInit } from '@angular/core';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';


import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-tyres',
  templateUrl: './vehicle-tyres.component.html',
  styleUrls: ['./vehicle-tyres.component.scss', '../../pages/pages.component.css', '../tyres.component.css']
})
export class VehicleTyresComponent implements OnInit {
  refMode = "701";
  data = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};
  vehicleTyres = [
    {
      tyreNo: null,
      tyreId: null,
      details: null,
      kms: null,
      date: (this.common.dateFormatter(new Date())).split(' ')[0],
      tyrePosition: {
        leftRight: -1,
        pos: -1,
        axel: -1,
        frontRear: -1
      },
      position: false
    },
    {
      tyreNo: null,
      tyreId: null,
      details: null,
      kms: null,
      date: (this.common.dateFormatter(new Date())).split(' ')[0],
      tyrePosition: {
        leftRight: -1,
        pos: -1,
        axel: -1,
        frontRear: -1
      },
      position: false
    },
    {
      tyreNo: null,
      tyreId: null,
      details: null,
      kms: null,
      date: (this.common.dateFormatter(new Date())).split(' ')[0],
      tyrePosition: {
        leftRight: -1,
        pos: -1,
        axel: -1,
        frontRear: -1
      },
      position: false
    },
    {
      tyreNo: null,
      tyreId: null,
      details: null,
      kms: null,
      date: (this.common.dateFormatter(new Date())).split(' ')[0],
      tyrePosition: {
        leftRight: -1,
        pos: -1,
        axel: -1,
        frontRear: -1
      },
      position: false
    },
  ]
  vehicleNo = "";
  vehicleId = null;
  constructor(
    private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService
  ) { }

  ngOnDestroy(){}
ngOnInit() {
  }

  resetDetails(){
    this.vehicleTyres = [
      {
        tyreNo: null,
        tyreId: null,
        details: null,
        kms: null,
        date: (this.common.dateFormatter(new Date())).split(' ')[0],
        tyrePosition: {
          leftRight: -1,
          pos: -1,
          axel: -1,
          frontRear: -1
        },
        position: false
      },
      {
        tyreNo: null,
        tyreId: null,
        details: null,
        kms: null,
        date: (this.common.dateFormatter(new Date())).split(' ')[0],
        tyrePosition: {
          leftRight: -1,
          pos: -1,
          axel: -1,
          frontRear: -1
        },
        position: false
      },
      {
        tyreNo: null,
        tyreId: null,
        details: null,
        kms: null,
        date: (this.common.dateFormatter(new Date())).split(' ')[0],
        tyrePosition: {
          leftRight: -1,
          pos: -1,
          axel: -1,
          frontRear: -1
        },
        position: false
      },
      {
        tyreNo: null,
        tyreId: null,
        details: null,
        kms: null,
        date: (this.common.dateFormatter(new Date())).split(' ')[0],
        tyrePosition: {
          leftRight: -1,
          pos: -1,
          axel: -1,
          frontRear: -1
        },
        position: false
      },
    ]
  }

  getDate(index) {
    this.common.params = { ref_page: "Tyre Inputs", date: this.vehicleTyres[index].date };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.vehicleTyres[index].date = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.vehicleTyres[index].date);
    });
  }
  getTyreDetails(tyreDetails, index) {
    this.vehicleTyres[index].tyreId = tyreDetails.id;
    this.vehicleTyres[index].tyreNo = tyreDetails.tyrenum;
    this.getTyreCurrentStatus(this.vehicleTyres[index].tyreId, index)
  }
  getvehicleData(vehicleDetails) {
    this.vehicleId = vehicleDetails.id;
    this.getMappedTyres();
  }
  resetVehDetails() {
    this.vehicleNo = "";
    this.vehicleId = null;
  }

  addMore() {
    this.vehicleTyres.push({
      tyreNo: null,
      tyreId: null,
      details: null,
      kms: null,
      date: (this.common.dateFormatter(new Date())).split(' ')[0],
      tyrePosition: {
        leftRight: -1,
        pos: -1,
        axel: -1,
        frontRear: -1
      },
      position: false
    });
  }

  saveDetails() {
    if (!this.vehicleId) {
      this.common.showError("Please Select Vehicle");
    } else {
      this.common.loading++;
      let params = {
        vehicleId: this.vehicleId,
        refMode: this.refMode,
        vehicleTyres: JSON.stringify(this.vehicleTyres)
      };
      console.log('Params:', params);

      this.api.post('Tyres/saveTyreInputs', params)
        .subscribe(res => {
          this.common.loading--;
          console.log("return id ", res['data'][0].r_id, res['data'][0].r_msg);
          if (res['data'][0].r_id > 0) {
            console.log("sucess");
            this.resetDetails();
            this.common.showToast("sucess");
            this.getMappedTyres();
          } else {
            console.log("fail");
            this.common.showError(res['data'][0].r_msg);
          }
        }, err => {
          this.common.loading--;
          console.error(err);
          this.common.showError();
        });
    }
  }

  getMappedTyres() {
    let params = 'vehicleId=' + this.vehicleId +
      '&refMode=' + this.refMode;
    console.log("params ", params);
    this.api.get('Tyres/getVehicleTyreDetails?' + params)
      .subscribe(res => {
        this.data = res['data'];
        this.table = {
          data: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        this.valobj = {};
        if (!this.data || !this.data.length) {
          //document.getElementById('mdl-body').innerHTML = 'No record exists';
          return;
        }
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();

      }, err => {
        console.error(err);
        this.common.showError();
      });

  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  getTyreCurrentStatus(tyreId, index) {
    console.log("vehicle Id ---", this.vehicleId, "tyre====", tyreId);
    if (!this.vehicleId || !tyreId) {
      alert("Vehicle id and Tyre Id is Mandatory");
    } else {
      let alertMsg;
      let params = 'tyreId=' + tyreId;
      console.log("params ", params);
      this.api.get('Tyres/getTyreCurrentStatus?' + params)
        .subscribe(res => {
          console.log('Res: ', res['data']);
          if (res['data'][0].rtn_id > 0) {
            alertMsg = res['data'][0].rtn_msg
            this.openConrirmationAlert(alertMsg, index);
          }

        }, err => {
          console.error(err);
          this.common.showError();
        });
    }
  }
  openConrirmationAlert(alertMsg, index) {
    this.common.params = {
      title: "Current Postion Of Tyre",
      description: alertMsg + " Do you want to change ?"
    }
    const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (!data.response) {
        this.vehicleTyres[index].tyreId = null;
        this.vehicleTyres[index].tyreNo = null;
        // console.log("data", document.getElementById('tyreNo-' + index), document.getElementById('tyreNo-' + index).innerHTML);

        (<HTMLInputElement>document.getElementById('tyreNo-' + index)).value = '';
      }
    });
  }
}


