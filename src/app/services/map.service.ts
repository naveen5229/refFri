import { Injectable } from '@angular/core';
import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { CommonService } from './common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  mapParams = null;
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

  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal,
    private zone: NgZone) {
    this.title = this.common.params.title;
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
    this.createMarker(lat, lng);
  }
  createMarker(lat = 26.9124336, lng = 75.78727090000007) {
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(lat, lng),
      draggable: false
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
}

