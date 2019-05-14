import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

declare var google: any;

@Component({
  selector: 'location-marker',
  templateUrl: './location-marker.component.html',
  styleUrls: ['./location-marker.component.scss', '../../pages/pages.component.css']
})
export class LocationMarkerComponent implements OnInit {
  title = '';
  map: any;
  @ViewChild('map') mapElement: ElementRef;
  location = {
    lat: 26.9124336,
    lng: 75.78727090000007,
    name: '',
    time: ''
  };
  marker: any;
  infoWindows = [];

  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal,
    private zone: NgZone) {
    this.title = this.common.params.title;
  }

  ngOnInit() {
  }


  ngAfterViewInit() {
    console.log('ionViewDidLoad MarkerLocationPage');
    this.location = this.common.params['location'];
    this.loadMap(this.location.lat, this.location.lng);
  }

  loadMap(lat = 26.9124336, lng = 75.78727090000007) {
    let mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: 14,
      disableDefaultUI: true,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.createMarker(lat, lng);
  }


  createMarker(lat = 26.9124336, lng = 75.78727090000007) {

    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(lat, lng),
      draggable: false
    });
    let displayText = '';
    let infoWindow = this.createInfoWindow();

    displayText = 'lat' + " : " + this.location.lat + " " + 'long' + " : " + this.location.lng;
    google.maps.event.addListener(this.marker, 'click', function (evt) {
      console.log("In Here");
      infoWindow.setPosition(evt.latLng);
      infoWindow.setContent(displayText);
      infoWindow.open(this.map, this.marker);
    });
  }

  setZoom(zoom) {
    this.map.setZoom(zoom);
    if (zoom == 18 || zoom == 15) {
      this.map.setMapTypeId('hybrid')
    } else {
      this.map.setMapTypeId('roadmap')
    }
  }

  createInfoWindow() {
    return new google.maps.InfoWindow();
  }

  closeModal() {
    this.activeModal.close();
  }
}

