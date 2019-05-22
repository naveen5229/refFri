import { Component, ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
    name: 'Jaipur, Rajasthan, India'
  };
  // location = {
  //   lat: '',
  //   lng: '',
  //   name: ''
  // };

  marker: any;

  geocoder: any;
  markerOrigin: any;

  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal,
    private zone: NgZone) {
    // this.title = 'Vehicle Location';
    this.title = this.common.params.title || 'Vehicle Location';
    this.placeholder = this.common.params.placeholder || 'Enter Drop Location';
    this.location = this.common.params.title ? {
      lat: null,
      lng: null,
      name: null,
    } : this.location;
    // if (this.common.params.title || this.common.params.placeholder) {
    //   this.title = this.common.params.title;
    //   this.placeholder = this.common.params.placeholder;
    // } else {
    //   this.title = 'vehicle Location';
    //   this.placeholder = 'Enter Drop Location';
    // }

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
    google.maps.event.addListener(this.map, 'center_changed', this.updateLocation2.bind(this));
    google.maps.event.addListener(this.map, 'dragend', this.updateLocation3.bind(this));

    this.createMarker(lat, lng);
  }

  autoSuggestion() {
    var source = document.getElementById('location');
    var autocompleteOrigin = new google.maps.places.Autocomplete(source);
    google.maps.event.addListener(autocompleteOrigin, 'place_changed', this.updateLocation.bind(this, autocompleteOrigin));

  }

  updateLocation(autocomplete) {
    console.log('tets');
    let place = autocomplete.getPlace();
    let lat = place.geometry.location.lat();
    let lng = place.geometry.location.lng();
    this.zone.run(() => {
      this.location.name = place.formatted_address;
      this.location.lat = lat;
      this.location.lng = lng;
      this.marker.setPosition(new google.maps.LatLng(lat, lng));
      this.map.setCenter(new google.maps.LatLng(lat, lng));

    });


    console.log(this.location);
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
      draggable: false
    });

    // google.maps.event.addListener(this.marker, "dragend", this.markerPositionChangd.bind(this));

  }

  markerPositionChangd() {

    let latlng = { lat: this.marker.getPosition().lat(), lng: this.marker.getPosition().lng() };
    this.geocoder.geocode({ 'location': latlng }, this.getAddress.bind(this));
  }

  getAddress(results, status) {
    console.log(results);
    console.log(status);
    if (results[0]) {
      this.zone.run(() => {
        this.location.lat = this.marker.getPosition().lat();
        this.location.lng = this.marker.getPosition().lng();
        this.location.name = results[0].formatted_address;
        // this.map.setCenter(new google.maps.LatLng(this.marker.getPosition().lat(), this.marker.getPosition().lng()));
        // this.loadMap(this.location.lat, this.location.lng);
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

  geocoding(lat, lng) {
    this.location.lat = lat;
    this.location.lng = lng;

    console.log("geocoding", lat, lng);
    let latlng = new google.maps.LatLng(lat, lng);
    this.geocoder.geocode({ 'location': latlng }, this.getAddress.bind(this));
  }

  // modelDismiss(isLocation) {
  //   this.viewCtrl.dismiss({ 'isLocation': isLocation, location: this.location });
  // }

  closeModal() {
    this.activeModal.close({ location: this.location });



  }

  modelDismiss() {
    this.activeModal.close();

  }




}

