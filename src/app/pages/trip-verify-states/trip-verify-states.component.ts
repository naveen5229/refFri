import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { VehicleStatesComponent } from '../../modals/vehicle-states/vehicle-states.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'trip-verify-states',
  templateUrl: './trip-verify-states.component.html',
  styleUrls: ['./trip-verify-states.component.scss']
})
export class TripVerifyStatesComponent implements OnInit {

  verifyState = [];
  stateId = [];
  adduserId = [];
  isVerified = [];
  pendingStateType = "0";
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
    private activeModal: NgbActiveModal,
    public user: UserService) {
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

    this.stateId = [];
    this.adduserId = [];
    this.isVerified = [];
    this.verifyState = [];


    let params = "is_verified=" + this.pendingStateType;
    console.log('params', params);
    this.common.loading++;
    this.api.get('vehicles/getPendingVehicleStates?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.verifyState = res['data'] || [];
        for (let i = 0; i < this.verifyState.length; i++) {
          if (this.verifyState[i]["_id"] != undefined) {
            this.stateId.push(this.verifyState[i]["_id"]);
          }
          this.adduserId.push(this.verifyState[i]["_aduserid"]);
          this.isVerified.push(this.verifyState[i]["_isverified"]);

        }
        console.log('adduserid', this.adduserId);
        console.log('stateid', this.stateId);
        console.log('isVerified', this.isVerified);
        console.log('verifyState', this.verifyState);
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
    this.verifyState.map((doc, index) => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        this.valobj['action'] = { value: null, isHTML: false, action: null, class: '', icons: this.actionIcons(doc, index) }
      }
      columns.push(this.valobj);
    });
    return columns;
  }



  actionIcons(details, i) {
    let icons = [];
    if (this.isVerified[i] == 0) {

      icons.push({
        class: " fa fa-check-circle",
        action: this.acceptOnTrip.bind(this, details),
      },
        {
          class: "fa fa-window-close",
          action: this.rejectOnTrip.bind(this, details),
        })



    }

    if (this.adduserId[i] > 0) {
      icons.push({
        class: "fa fa-trash remove",
        action: this.removeVehicleState.bind(this, i),
      })
    }

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



  printPDF(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = fodata['name'];
        let center_heading = "Verify Trip States";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  printCsv(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = "FoName:" + fodata['name'];
        let center_heading = "Report:" + "Verify Trip States";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }

  removeVehicleState(index) {
    let params = {
      stateid: this.stateId[index]
    };
    console.log('params', params);
    console.log('index', index);
    this.common.params = {
      title: 'Remove State ',
      description: `<b>&nbsp;` + 'Are Sure To Remove State ' + `<b>`,
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
              this.getPendingStates();
            } else {
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

}
