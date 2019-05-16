import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { VehicleStatesComponent } from '../../modals/vehicle-states/vehicle-states.component';

@Component({
  selector: 'trip-verify-states',
  templateUrl: './trip-verify-states.component.html',
  styleUrls: ['./trip-verify-states.component.scss']
})
export class TripVerifyStatesComponent implements OnInit {

  verifyState = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      tableHeight: "68vh"
    }
  };
  headings = [];
  valobj = {};
  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.getPendingStates();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.getPendingStates();
  }


  getPendingStates() {

    this.common.loading++;

    this.api.get('vehicles/getPendingVehicleStates?', {})
      .subscribe(res => {
        this.common.loading--;
        this.verifyState = res['data'];
        let first_rec = this.verifyState[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {

            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;

          }


        }
        let action = { title: this.formatTitle('Action'), placeholder: this.formatTitle('Action') };
        this.table.data.headings['action'] = action;
        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.verifyState);
    this.verifyState.map(doc => {
      // console.log("Doc Data:", doc);
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        // console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };

        this.valobj['action'] = { value: null, isHTML: false, action: null, class: '', icons: this.actionIcons(doc) }

      }


      columns.push(this.valobj);
    });
    return columns;
  }



  actionIcons(details) {
    let icons = [
      {
        class: " fa fa-check-circle",
        action: this.acceptOnTrip.bind(this, details),
      },
      {
        class: "fa fa-window-close",
        action: this.rejectOnTrip.bind(this, details),
      },

    ]

    return icons;
  }

  acceptOnTrip(details) {

    let params = {
      vehicleStateId: details._id,
      isVerified: 1,
    };
    if (details) {
      console.log('details', details);
      this.common.params = {
        title: 'Accept Trip ',
        description: `<b>&nbsp;` + 'Are Sure To Accept This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("data", data);
          this.common.loading++;
          this.api.post('Vehicles/ActionOnPendingVehicleStates', params)
            .subscribe(res => {
              this.common.loading--;
              console.log('res: ', res);

              this.common.showToast(res['data'][0].r_msg);
              this.getPendingStates();
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
              this.common.showError('Error!');
            });
        }
      });
    }
  }

  rejectOnTrip(details) {


    let value = {
      vehicleStateId: details._id,
      isVerified: 0,
      vehicleId: details._vid,
      lat: details._lat,
      long: details._lngt,
      vregno: details.Vehicle

    };
    console.log("Param:", value);

    if (details) {
      console.log('details', details);
      this.common.params = {
        title: 'Reject Trip ',
        description: `<b>&nbsp;` + 'Are Sure To Reject This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("data", data);
          this.common.loading++;
          this.api.post('Vehicles/ActionOnPendingVehicleStates', value)
            .subscribe(res => {
              this.common.loading--;
              console.log('res: ', res);
              this.common.showToast(res['data'][0].r_msg, '', 10000);
              this.common.params = {
                vehicleStateId: details._id,
                isVerified: 0,
                vehicleId: details._vid,
                lat: details._lat,
                long: details._lngt,
                vregno: details.Vehicle
              };
              const activeModal = this.modalService.open(VehicleStatesComponent, { size: "lg", container: "nb-layout", backdrop: 'static' });

            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
              this.common.showError('Error!');
            });
        }
      });
    }
  }

}
