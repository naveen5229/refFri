import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'update-location',
  templateUrl: './update-location.component.html',
  styleUrls: ['./update-location.component.scss']
})
export class UpdateLocationComponent implements OnInit {
  refType = null;
  refId = null;
  location = {
    name: null,
    lat: null,
    lng: null
  }
  lat = null;
  lng = null;
  name = null;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
    if (this.common.params.location) {
      this.refType = this.common.params.location.refType;
      this.refId = this.common.params.location.refId;
      this.lat = this.common.params.location.lat ? this.common.params.location.lat : null;
      this.lng = this.common.params.location.lng ? this.common.params.location.lng : null;
      this.name = this.common.params.location.name;
    }
  }

  ngOnInit() {
  }


  closeModal() {
    this.activeModal.close();
  }

  setLocation(event) {
    console.log("event", event);
    this.location.name = event.location;
    this.location.lat = event.lat;
    this.location.lng = event.long;
  }
  calculteDistane() {
    if (this.lat && this.lng) {
      let distance = this.common.distanceFromAToB(this.lat, this.lng, this.location.lat, this.location.lng, "K")
      console.log("distance", distance, this.location.name.split(',')[0].trim().toLowerCase(), this.name.split(',')[0].trim().toLowerCase());
      if (distance > 20 && this.location.name.split(',')[0].trim().toLowerCase() != this.name.split(',')[0].trim().toLowerCase()) {
        alert("Distance is Greater than 20 Km.Please choose appropriate name");
        return;
      }
      else {
        this.updateLocation();
      }
    } else {
      this.updateLocation();
    }
  }

  updateLocation() {

    this.common.loading++;
    let params = {
      location: this.location.name,
      refType: this.refType,
      refId: this.refId,
      locationLat: this.location.lat,
      locationLng: this.location.lng
    }

    this.api.post('HaltOperations/updateSequenceStateLocName', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        if (res['success']) {
          this.common.showToast("successfully updated")
          this.closeModal();
        } else {
          this.common.showError(res['msg']);
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
}
