import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

declare var google: any;

import { MapService } from '../../services/map.service';

@Component({
  selector: 'near-by-vehicles',
  templateUrl: './near-by-vehicles.component.html',
  styleUrls: ['./near-by-vehicles.component.scss']
})
export class NearByVehiclesComponent implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  title = '';
  map: any;
  location = {
    lat: 26.9124336,
    lng: 75.78727090000007,
    angle: 0,
    name: '',
    time: '',
  };
  rotate = null;
  fence = null;
  polygon = null;
  bounds = new google.maps.LatLngBounds();
  marker: any;
  infoWindows = [];
  locations = [];
  infoWindow = null;

  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal, private ms: MapService,
    private zone: NgZone) {
    this.title = this.common.params.title;
    this.location = this.common.params['location'];
    this.locations = this.common.params['locations'];
    this.rotate = this.location.angle ? 'rotate(' + this.location.angle + 'deg)' : null;
    this.fence = this.common.params['fence'];
  }

  ngOnDestroy() {
    try {
      this.ms.clearMarkerEvents(this.marker);
      this.marker = null;
    } catch (e) { console.log('Exception:', e) }
    this.ms.events.next({ type: 'closed' });
  }
  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadMap(this.location.lat, this.location.lng);
  }

  setBounds(latLng, reset = false) {
    this.bounds = this.bounds || this.map.getBounds();
    this.bounds.extend(latLng);
    this.map.fitBounds(this.bounds);
  }

  createLatLng(lat, lng) {
    return new google.maps.LatLng(lat, lng);
  }

  loadMap(lat = 26.9124336, lng = 75.78727090000007) {
    this.map = this.ms.mapIntialize('location-marker-map', 14, lat, lng, false, true, { mapTypeControl: false });
    this.createMarker(lat, lng);
    this.createMarkers();
    if (this.fence) {
      this.createPolyGon();
    }
  }

  createPolyGon() {
    const defaultOptions = {
      strokeColor: '#228B22',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      clickable: false,
      fillColor: '#ADFF2F',
      fillOpacity: 0.35
    };
    this.polygon = this.ms.createPolygon(this.fence, defaultOptions);
    this.fence.forEach(element => {
      this.setBounds(this.createLatLng(element.lat, element.lng));
    });
  }

  createMarker(lat = 26.9124336, lng = 75.78727090000007) {
    const latLng = new google.maps.LatLng(lat, lng);
    const options = {
      animation: google.maps.Animation.DROP,
      draggable: false
    }
    this.marker = this.ms.createMarker(latLng, options);
    let displayText = '';
    let infoWindow = this.ms.createInfoWindow();

    displayText = this.location.name;
    google.maps.event.addListener(this.marker, 'click', function (evt) {
      console.log("In Here");
      infoWindow.setPosition(evt.latLng);
      infoWindow.setContent(displayText);
      infoWindow.open(this.map, this.marker);
    });
  }

  createMarkers() {
    this.infoWindow = this.ms.createInfoWindow();
    let markers = this.ms.createMarkers(this.locations);
    markers.forEach((marker, index) => {
      google.maps.event.addListener(marker, 'click', (evt) => {
        let location = this.locations[index];
        this.infoWindow.setContent(location.name);
        this.infoWindow.open(this.map, marker);
      });
    });

    this.locations.forEach(location => {
      this.setBounds(this.createLatLng(location.lat, location.lng));
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

  closeModal() {
    this.activeModal.close();
  }

}
