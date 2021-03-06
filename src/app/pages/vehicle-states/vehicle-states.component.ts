import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { CsvService } from '../../services/csv/csv.service';
import { UserService } from '../../services/user.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-states',
  templateUrl: './vehicle-states.component.html',
  styleUrls: ['./vehicle-states.component.scss']
})
export class VehicleStatesComponent implements OnInit {
  startDate = new Date(new Date().setDate(new Date().getDate() - 3));
  endDate = new Date();
  vehicleId = null;
  stateType = "-1";
  stateTypes = [];
  count = 0;
  vehicleStates = [];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      pagination: true
    }
  };
  constructor(public api: ApiService,
    public common: CommonService,
    private csvService: CsvService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.count = 0;
    this.getStates();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  getStates() {
    this.api.get("Suggestion/getTypeMaster?typeId=13")
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.stateTypes = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  refresh() {
    this.count = 0;
    this.getVehicleStates();
  }

  getVehicleStates() {
    this.vehicleStates = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true,
        pagination: true
      }
    };
    let startDate = this.common.dateFormatter(this.startDate);
    let endDate = this.common.dateFormatter(this.endDate);
    console.log('start & end', startDate, endDate);
    let params = "vehicleId=" + this.vehicleId +
      "&startDate=" + startDate +
      "&endDate=" + endDate +
      "&stateId=" + this.stateType;
    console.log('params', params);
    ++this.common.loading;
    this.api.get('Vehicles/getVehicleState?' + params)
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res['data']);
        // this.vehicleId = -1;
        // this.vehicleStates = res['data'];
        //this.vehicleStates = JSON.parse(res['data']);
        this.vehicleStates = res['data'];
        //this.table = this.setTable();
        if (this.vehicleStates != null) {
          console.log('vehicleStates', this.vehicleStates);
          let first_rec = this.vehicleStates[0];
          console.log("first_Rec", first_rec);

          for (var key in first_rec) {

            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: key, placeholder: this.formatTitle(key) };
              if (key === 'start_time' || key === 'end_time' || key === 'addtime') {
                headerObj['type'] = 'date';
              }
              this.table.data.headings[key] = headerObj;
            }

          }
          this.table.data.columns = this.getTableColumns();
          console.log("table:");
          console.log(this.table);
        } else {
          this.common.showToast('No Record Found !!');
        }
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.vehicleStates.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        this.valobj[this.headings[j]] = { value: this.vehicleStates[i][this.headings[j]], class: 'black', action: '' };
        this.valobj['Action'] = { value: null, isHTML: false, action: null, class: '', icons: this.actionIcons(this, this.vehicleStates[i]) }
      }
      this.valobj['style'] = { background: this.vehicleStates[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }

  printCsv(tblEltId) {
    let customerName = this.user._customer.name;
    if (this.user._loggedInBy == "customer")
      customerName = this.user._details.name;
    let details = [
      { customer: 'Customer : ' + customerName },
      { report: 'Report : Fleet States' },
      { period: 'Report Date :' + this.startDate + " to " + this.endDate },
      //   {date : 'Generated On :'+ this.common.dateFormatter(new Date())}
    ];
    this.csvService.byMultiIds([tblEltId], 'Fleet States', details);
  }
  resetVehicle() {
    this.vehicleId = null;
  }
  setVehicleDetail(event) {
    this.count++;
    this.vehicleId = event.id;
    if (this.count < 2) {
      console.log(" this.stateTypes", this.stateTypes)
      this.stateTypes.push({
        description: "All",
        id: -1
      });
    }
  }


  actionIcons(details, i) {
    let icons = [];
    icons.push({
      class: "fa fa-trash remove",
      action: this.removeVehicleState.bind(this, false, i),
    });
    icons.push({
      class: "fa fa-edit edit",
      action: this.openRemarkModal.bind(this, i),
    })

    return icons;
  }

  removeVehicleState(strictDeleteVS, data1, resmsg?) {
    let params = {
      stateid: data1._id,
      isStrictDelete: strictDeleteVS,
    };
    if (!strictDeleteVS) {
      this.common.params = {
        title: 'Remove State ',
        description: `<b>&nbsp;` + 'Are Sure To Remove State ' + `<b>`,
      }
    }
    else {
      this.common.params = {
        title: 'Remove State ',
        description: `<b>&nbsp;` + resmsg + `<b>`,
      }
    }
    const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false });
    activeModal.result.then(data => {
      if (data.response) {
        console.log("data", data);
        this.common.loading++;
        this.api.post('Vehicles/removeVehicleState', params)
          .subscribe(res => {
            this.common.loading--;
            console.log('res: ', res);
            if (res['data'][0].r_id > 0) {
              this.common.showToast('Selected state has been deleted');
            } else if (res['data'][0].r_id == -1) {
              strictDeleteVS = true;
              resmsg = 'Are You Sure ?<br>' + res['data'][0].r_msg;
              this.removeVehicleState(true, data1, resmsg);
            }
            else {
              this.common.showToast(res['data'][0].r_msg, '', 10000);
            }


          }, err => {
            this.common.loading--;
            console.log('Error: ', err);
            this.common.showError('Error!');
          });
      }
    });
  }

  // removeVehicleState(data) {
  //   let params = {
  //     stateid: data._id
  //   };

  //   this.common.params = {
  //     title: 'Remove State ',
  //     description: `<b>&nbsp;` + 'Are Sure To Remove State ' + `<b>`,
  //   }
  //   const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false });
  //   activeModal.result.then(data => {
  //     if (data.response) {
  //       console.log("data", data);
  //       this.common.loading++;
  //       this.api.post('Vehicles/removeVehicleState', params)
  //         .subscribe(res => {
  //           this.common.loading--;
  //           console.log('res: ', res);
  //           if (res['data'][0].r_id > 0) {
  //             this.common.showToast('Selected state has been deleted');
  //             this.getStates();
  //           } else {
  //             this.common.showToast(res['data'][0].r_msg, '', 10000);
  //           }


  //         }, err => {
  //           this.common.loading--;
  //           console.log('Error: ', err);
  //           this.common.showError('Error!');
  //         });
  //     }
  //   });
  // }
  openRemarkModal(state) {
    this.common.params = { title: 'Add Remark' }
    const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {

      if (data.response) {
        let params = {
          remark: data.remark,
          id: state._id
        }
        console.log("params=", params);
        this.common.loading++;
        this.api.post('Vehicles/saveVehicleState', params)
          .subscribe(res => {
            this.common.loading--;
            this.activeModal.close();
            if (res['data'][0]['r_id'] > 0) {
              this.common.showError(res['data'][0]['r_msg']);
            } else {
              this.common.showToast(res['data'][0]['r_msg']);
            }
          }, err => {
            this.common.loading--;

          });
      }
    });
  }

}
