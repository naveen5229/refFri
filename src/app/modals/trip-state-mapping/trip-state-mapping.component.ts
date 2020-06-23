import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'trip-state-mapping',
  templateUrl: './trip-state-mapping.component.html',
  styleUrls: ['./trip-state-mapping.component.scss']
})
export class TripStateMappingComponent implements OnInit {
  trips = [];
  tripIds = [];
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
        this.trips = res['data'];
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
}
