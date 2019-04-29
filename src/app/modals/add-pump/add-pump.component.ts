import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';


@Component({
  selector: 'add-pump',
  templateUrl: './add-pump.component.html',
  styleUrls: ['./add-pump.component.scss', '../../pages/pages.component.css']
})
export class AddPumpComponent implements OnInit {
  fuel_company = 0;
  location = '';
  name = '';
  siteId = null;
  title = '';

  marker = [];


  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private mapService: MapService) {
    this.title = this.common.params.title;
    this.common.handleModalHeightWidth('class', 'modal-lg', '1200', '1200');
    setTimeout(() => {
      console.log('--------------location:', "location");
      this.mapService.autoSuggestion("location", (place, lat, lng) => {
        console.log('Lat: ', lat);
        console.log('Lng: ', lng);
        console.log('Place: ', place);
        this.location = place;
        this.getmapData(lat, lng);
      });
    }, 5000)


  }

  ngOnInit() {

  }


  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.autoSuggestion("moveLoc", (place, lat, lng) => {
      this.mapService.zoomAt({ lat: lat, lng: lng });
      this.getmapData(lat, lng);
    });
    // this.mapService.autoSuggestion("siteLoc", (place, lat, lng) => { this.siteLoc = place; this.siteLocLatLng = { lat: lat, lng: lng } });
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  getmapData(lat, lng) {
    const params = "lat=" + lat +
      "&long=" + lng;
    this.common.loading++;
    this.api.get('fuel/getAllSiteWrtFuelStation?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log("result");
        console.log(res['data']);
        this.marker = res['data'];
        this.mapService.createMarkers(this.marker);


        console.log("marker", this.marker);
        let markerIndex = 0
        for (const marker of this.mapService.markers) {
          let event = this.marker[markerIndex];
          this.mapService.addListerner(marker, 'click', () => this.setEventInfo(event));
          this.mapService.addListerner(marker, 'click', () => this.unsetEventInfo());
        }
      }, err => {
        this.common.showError("Error occurred");
        this.common.loading--;
        console.log(err);
      });

  }

  setEventInfo(event) {
    console.log("Event Data:", event);
    this.siteId = event.id;
  }

  unsetEventInfo() {

  }

  selectCompany(id) {
    this.fuel_company = parseInt(id);
  }

  submitPumpData() {
    let params = {
      petrolPumplocation: this.location,
      petrolPumpName: this.name,
      siteId: this.siteId,
      fuelCompany: this.fuel_company
    };
    console.log("params", params);
    return;
    this.common.loading++;
    this.api.post('FuelDetails/addPetrolPump', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("result");
        console.log(res);
        this.common.showToast("Petrol Pump Added Successfully");
        this.activeModal.close();
      }, err => {
        this.common.showError("Error occurred");
        this.common.loading--;
        console.log(err);
      });
  }
}
