import { Component, ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { stat } from 'fs';
import { ApiService } from '../../services/api.service';
import { CompileShallowModuleMetadata } from '@angular/compiler';

declare var google: any;

@Component({
  selector: 'location-selection',
  templateUrl: './location-selection.component.html',
  styleUrls: ['./location-selection.component.scss']
})


export class LocationSelectionComponent implements OnInit {
  title = '';
  placeholder = '';
  map: any;
  @ViewChild('map') mapElement: ElementRef;

  location = {
    lat: 26.9124336,
    lng: 75.78727090000007,
    name: 'Jaipur, Rajasthan, India',
    district: 'jaipur',
    state: 'Rajasthan',
    dislat: 0.27092289999999863,
    dislng: 0.3012657000000445

  };
  data = [];
  r_id = null;
  city = null;
  state = null;
  district = null;
  // location = {
  //   lat: '',
  //   lng: '',
  //   name: ''
  // };

  marker: any;

  geocoder: any;
  markerOrigin: any;
  submitted = false;
  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal,
    private zone: NgZone,
    public api: ApiService) {
    // this.title = 'Vehicle Location';
    this.title = this.common.params.title || 'Vehicle Location';
    this.placeholder = this.common.params.placeholder || 'Enter Drop Location';
    this.location = this.common.params.title ? {
      lat: null,
      lng: null,
      name: null,
      district: null,
      state: null,
      dislat: null,
      dislng: null
    } : this.location;




  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.common.params['location']) {
        this.location = this.common.params['location'];
        this.loadMap(this.location.lat, this.location.lng);
      } else {
        this.loadMap();
      }
      console.log('Location:', this.common.params['location']);
      this.autoSuggestion();
      this.geocoder = new google.maps.Geocoder;
    }, 1000);
  }

  loadMap(lat = 26.9124336, lng = 75.78727090000007) {
    let mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: 8,
      disableDefaultUI: true,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    // google.maps.event.addListener(this.map, 'center_changed', this.updateLocation2.bind(this));
    // google.maps.event.addListener(this.map, 'dragend', this.updateLocation3.bind(this));
    google.maps.event.addListener(this.map, 'click', evt => { this.updateLocation4(evt) });
    this.createMarker(lat, lng);
  }

  updateLocation4(evt) {
    console.log("Here Test", evt);

    this.marker.setPosition(evt.latLng);
    this.geocoding(evt.latLng.lat(), evt.latLng.lng());
  }
  autoSuggestion() {
    var source = document.getElementById('location');
    var autocompleteOrigin = new google.maps.places.Autocomplete(source);
    google.maps.event.addListener(autocompleteOrigin, 'place_changed', this.updateLocation.bind(this, autocompleteOrigin));

  }

  updateLocation(autocomplete) {
    let state
    let city
    let district
    console.log('tets', autocomplete.getPlace());
    let place = autocomplete.getPlace();
    // place.address_components.find(element => { return element == "sublocality_level_1" });
    place.address_components.forEach(element => {
      if (!city && element['types'][0] == "sublocality_level_1") {
        this.city = element.long_name;
        city = element.long_name;
      } else if (!city && element['types'][0] == "sublocality") {
        city = element.long_name;
        this.city = element.long_name;
      } else if (!city && element['types'][0] == "locality") {
        city = element.long_name;
        this.city = element.long_name;
      } else if (!state && element['types'][0] == "administrative_area_level_1") {
        state = element.long_name;
        this.state = element.long_name;
      } else if (!district && element['types'][0] == "administrative_area_level_2") {
        district = element.long_name;
        this.district = element.long_name;
      } else if (!district && element['types'][0] == "administrative_area_level_3") {
        district = element.long_name;
        this.district = element.long_name;
      } else if (!district && element['types'][0] == "administrative_area_level_4") {
        district = element.long_name;
        this.district = element.long_name;
      } else {
        //  this.common.showError('please select right place');
      }
    });
    console.log('city', city);

    let lat = place.geometry.location.lat();
    let lng = place.geometry.location.lng();


    let dislat = place.geometry.viewport.getNorthEast().lat() - place.geometry.viewport.getSouthWest().lat();
    let disLong = place.geometry.viewport.getNorthEast().lng() - place.geometry.viewport.getSouthWest().lng();
    console.log('district:', district);
    console.log('city:', city);
    console.log('state:', state);
    console.log('placelat:', lat);
    console.log('placelng:', lng);
    console.log('dislat:', dislat);
    console.log('dislng:', disLong);

    if (city != null && district != null && state != null) {

      this.zone.run(() => {
        this.location.name = city
        this.location.lat = lat;
        this.location.lng = lng;
        this.location.district = district,
          this.location.state = state,
          this.location.dislat = dislat,
          this.location.dislng = disLong
        this.marker.setPosition(new google.maps.LatLng(lat, lng));
        this.map.setCenter(new google.maps.LatLng(lat, lng));

      });
      console.log(this.location);
    }
    else {
      this.common.showToast('place cannot be Added');
      return;
    }

  }

  updateLocation2() {
    var center = this.map.getCenter();
    this.marker.setPosition(center);
  }

  updateLocation3() {
    var center = this.map.getCenter();
    console.log(center);
    this.marker.setPosition(center);
    let latlng = { lat: this.marker.getPosition().lat(), lng: this.marker.getPosition().lng() };
    this.geocoder.geocode({ 'location': latlng }, this.getAddress.bind(this));
  }


  createMarker(lat = 26.9124336, lng = 75.78727090000007) {
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(lat, lng),
      draggable: true
    });



  }

  markerPositionChangd() {

    let latlng = { lat: this.marker.getPosition().lat(), lng: this.marker.getPosition().lng() };
    this.geocoder.geocode({ 'location': latlng }, this.getAddress.bind(this));
  }

  getAddress(results, status) {
    console.log('results', results);
    console.log(status);
    if (results[0]) {
      this.zone.run(() => {
        this.location.lat = this.marker.getPosition().lat();
        this.location.lng = this.marker.getPosition().lng();
        this.location.name = results[0].formatted_address;
        let place = results[0];
        let feild = results[0].formatted_address;
        let city = feild.split(",")
        this.city = city[0];
        place.address_components.forEach(element => {

          if (element['types'][0] == "administrative_area_level_1") {
            this.state = element.long_name;
          } else if (element['types'][0] == "administrative_area_level_2") {
            this.district = element.long_name;
          } else if (element['types'][0] == "administrative_area_level_3") {
            this.district = element.long_name;
          } else if (element['types'][0] == "administrative_area_level_4") {
            this.district = element.long_name;
          }
        });
        console.log('place:', this.city);

        console.log(this.location);
      });
    }
  }



  eventOnMarker(marker) {
    google.maps.event.addListener(marker, 'dragend', (evt) => {
      console.log(evt);
      this.geocoding(evt.latLng.lat(), evt.latLng.lng());
    });
  }
  addListerner(element, event, callback) {
    if (element)
      google.maps.event.addListener(element, event, callback);
  }
  geocoding(lat, lng) {
    this.location.lat = lat;
    this.location.lng = lng;

    console.log("geocoding", lat, lng);
    let latlng = new google.maps.LatLng(lat, lng);
    this.geocoder.geocode({ 'location': latlng }, this.getAddress.bind(this));
  }



  closeModal(event) {
    // if (submitted == 'false') {
    //   this.activeModal.close();
    // }
    if (event == false) {
      //console.log("Test");

      this.activeModal.close();
    }
    if (event == true) {
      let params = {
        locationId: null,
        locationName: this.location.name,
        district: this.location.district,
        state: this.location.state,
        locationLat: this.location.lat,
        locationLong: this.location.lng,
        distLat: this.location.dislat,
        distLong: this.location.dislng
      };
      if (params.locationLong == null || params.locationLat == null || params.locationName == null) {
        this.common.showToast('place does not exist');
        return;
      }
      if (this.city.match("Unnamed Road")) {
        this.common.showError('place cannot be added');
        return;
      }
      this.common.loading++;
      this.api.post('sitesOperation/insertLocationDetails', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.data = res['data'];
          if (this.data[0]['r_id'] < 1) {
            this.common.showToast(res['data'][0]['r_msg']);
          }
          if (this.data[0]['r_id'] > 1) {
            this.r_id = this.data[0].r_id;
            this.activeModal.close({ location: this.location, r_id: this.r_id });
            console.log('RID:', this.r_id);

          }
          // this.common.showToast(res['msg']);
          // this.activeModal.close({ location: this.location });


        }, err => {
          console.log(err);
          this.common.loading--;

        });

    }


  }

  modelDismiss() {
    this.activeModal.close();

  }




}

