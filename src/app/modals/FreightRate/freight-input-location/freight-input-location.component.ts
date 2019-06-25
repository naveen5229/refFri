import { Component, OnInit } from '@angular/core';
import { AddConsigneeComponent } from '../../LRModals/add-consignee/add-consignee.component';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { LocationSelectionComponent } from '../../location-selection/location-selection.component';

@Component({
  selector: 'freight-input-location',
  templateUrl: './freight-input-location.component.html',
  styleUrls: ['./freight-input-location.component.scss']
})
export class FreightInputLocationComponent implements OnInit {
  keepGoing = true;
  sourceString = '';
  destinationString = '';
  // frieghtRate = {
  //   wefDate: '',
  //   companyName: null,
  //   companyId: null,
  //   materialName: null,
  //   materialId: null,
  //   siteName: null,
  //   siteId: null,
  // }

  frieghtDatas = [{
    fixed: null,
    distance: null,
    weight: null,
    weightDistance: null,
    origin: null,
    org_lat: null,
    org_long: null,
    destination: null,
    dest_lat: null,
    dest_long: null,
  }];
  frpId = null;
  constructor(
    private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
  ) {
    this.frpId = this.common.params.id ? this.common.params.id : null;
    this.common.handleModalSize('class', 'modal-lg', '1300');
  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }


  onChangeAuto(search, type) {
    if (type == 'Source') {

      this.sourceString = search;
      console.log('..........', search);
    }
    else {
      this.destinationString = search;
    }
  }

  addCompany() {
    console.log("open material modal")
    const activeModal = this.modalService.open(AddConsigneeComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', windowClass: 'add-consige-veiw' });
    activeModal.result.then(data => {
      console.log('Data:', data);
    });
  }

  addMore() {
    this.frieghtDatas.push({
      fixed: null,
      distance: null,
      weight: null,
      weightDistance: null,
      origin: null,
      org_lat: null,
      org_long: null,
      destination: null,
      dest_lat: null,
      dest_long: null,
    });
  }

  selectLocation(place, type) {
    if (type == 'Source') {
      console.log("palce", place);
      this.frieghtDatas[0].org_lat = place.lat;
      this.frieghtDatas[0].org_long = place.long;
      this.frieghtDatas[0].origin = place.location || place.name;
    }
    console.log("palce", place);
    this.frieghtDatas[0].dest_lat = place.lat;
    this.frieghtDatas[0].dest_long = place.long;
    this.frieghtDatas[0].destination = place.location || place.name;
  }

  takeActionSource(res) {
    setTimeout(() => {
      console.log("Here", this.keepGoing, this.sourceString.length, this.sourceString);

      if (this.keepGoing && this.sourceString.length) {
        this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };

        const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
        this.keepGoing = false;
        activeModal.result.then(res => {
          console.log('response----', res.location);
          this.keepGoing = true;
          if (res.location.lat) {
            this.frieghtDatas[0].origin = res.location.name;

            (<HTMLInputElement>document.getElementById('origin')).value = this.frieghtDatas[0].origin;
            this.frieghtDatas[0].org_lat = res.location.lat;
            this.frieghtDatas[0].org_long = res.location.lng;
            this.keepGoing = true;
          }
        })
      }
    }, 1000);

  }


  takeActionDestination(res) {
    setTimeout(() => {
      console.log("Here", this.keepGoing, this.destinationString.length, this.destinationString);

      if (this.keepGoing && this.destinationString.length) {
        this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };

        const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
        this.keepGoing = false;
        activeModal.result.then(res => {
          console.log('response----', res.location);
          this.keepGoing = true;
          if (res.location.lat) {
            this.frieghtDatas[0].destination = res.location.name;

            (<HTMLInputElement>document.getElementById('destination')).value = this.frieghtDatas[0].destination;
            this.frieghtDatas[0].dest_lat = res.location.lat;
            this.frieghtDatas[0].dest_long = res.location.lng;
            this.keepGoing = true;
          }
        })
      }
    }, 1000);

  }



  saveFrightInput() {
    let params = {
      frpId: this.frpId,
      type: 'location',
      frieghtRateData: JSON.stringify(this.frieghtDatas),
      // filterParams: JSON.stringify(this.filters)
    }
    console.log("params", params);
    ++this.common.loading;

    this.api.post('FrieghtRate/saveFrieghtRateDetails', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['data'][0].result);
        alert(res['data'][0].result);
        this.activeModal.close();
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }
}