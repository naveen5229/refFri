import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'trip-state-mapping',
  templateUrl: './trip-state-mapping.component.html',
  styleUrls: ['./trip-state-mapping.component.scss']
})
export class TripStateMappingComponent implements OnInit {
  trips = [];
  tripIds = [];
  stateIds = [];
  vtStates = [];
  dis_all = 't';
  stateId = null;
  constructor(
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) {
    if (this.common.params && this.common.params.vehicle && this.common.params.vehicle.stateId) {
      this.stateId = this.common.params.vehicle.stateId;
      this.getTrips();
      this.getvtStates();
    }
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  getTrips() {
    let params = "stateId=" + this.stateId;
    console.log(params)
    this.common.loading++;
    this.api.get('HaltOperations/getStateTripSuggestions?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: ', res['data']);
        this.trips = res['data']?res['data']:[];
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  getvtStates() {
    let params = "stateId=" + this.stateId;
    console.log(params)
    this.common.loading++;
    this.api.get('HaltOperations/getStateReviveSuggestions?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: ', res['data']);
        this.vtStates = res['data']?res['data']:[];
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  map(flag) {
    if (flag) {
      this.tripIds = [];
      this.trips.map(tp => {
        if (tp.is_mapped) {
          this.tripIds.push(tp.id)
        }
      })

    } else {
      this.tripIds = [];
    }

    let params = {
      stateId: this.stateId,
      trips: JSON.stringify(this.tripIds),
    }

    console.log(params)
    this.common.loading++;
    this.api.post('HaltOperations/mapStateAndTrips', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: ', res['data']);
        this.common.showToast(res['data'][0].y_msg)
        this.getTrips();
        // this.trips = res['data'];
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  revertState(flag) {
   
      this.tripIds = [];
      this.vtStates.map(vts => {
        console.log("vts",vts);
        if (vts.is_mapped) {
          this.tripIds.push(vts.id)
        }
      })

    let params = {
      stateId: this.stateId,
      vtId: JSON.stringify(this.tripIds),
    }

    console.log(params)
    this.common.loading++;
    this.api.post('HaltOperations/reviveState', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: ', res['data']);
        this.common.showToast(res['data'][0].y_msg)
        this.getvtStates();
        // this.trips = res['data'];
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  removeVehicleState(strictDeleteVS,resmsg?) {
    
    let params = {
      stateid: this.stateId,
      isStrictDelete:strictDeleteVS
    };
   if(!strictDeleteVS){
    this.common.params = {
      title: 'Remove State ',
      description: `<b>&nbsp;` + 'Are Sure To Remove State ' + `<b>`,
    }
  }
    else
    {
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
            } else if(res['data'][0].r_id == -1){
             strictDeleteVS = true;
              resmsg = 'Are You Sure ?<br>'+res['data'][0].r_msg;
              this.removeVehicleState(true,resmsg);
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
}
