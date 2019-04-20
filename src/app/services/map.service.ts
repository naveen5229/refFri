import { Injectable } from '@angular/core';
declare let google: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map = null;
  mapDiv = null;
  markers = [];
  bounds = null;
  infoWindow = null;
  polygon = null;
  polygons = [];
  isMapLoaded = false;
  mapLoadDiv = null;
  lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
  };
  lineSymbolBack = {
    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW
  };

  polygonPath = null;
  isDrawAllow = false;
  designsDefaults = [
    "M  0,0,  0,-5,  -5,-5,-5,-13 , 5,-13 ,5,-5, 0,-5 z",///Rect
    "M  0,0,  0,-5,  -5,-13 , 5,-13 , 0,-5 z"//Pin
  ];

  constructor() {
  }

  autoSuggestion(elementId, setLocation?) {
    let options = {
      types: ['(cities)'],
      componentRestrictions: { country: "in" }
    };
    let ref = document.getElementById(elementId);//.getElementsByTagName('input')[0];
    let autocomplete = new google.maps.places.Autocomplete(ref, options);
    google.maps.event.addListener(autocomplete, 'place_changed', this.updateLocation.bind(this, elementId, autocomplete, setLocation));
  }

  updateLocation(elementId, autocomplete, setLocation?) {
    let place = autocomplete.getPlace();
    let lat = place.geometry.location.lat();
    let lng = place.geometry.location.lng();
    place = autocomplete.getPlace().formatted_address.split(',')[0];
    setLocation && setLocation(place, lat, lng);
  }

  zoomAt(latLng, level = 18) {
    this.map.panTo(latLng);
    if(level != this.map.getZoom())
      this.zoomMap(level);
  }

  zoomMap(zoomValue) {
    this.map.setZoom(zoomValue);
    if (zoomValue == 10 || zoomValue == 12 || zoomValue == 14) {
      this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    } else if (zoomValue == 16 || zoomValue == 18) {
      this.map.setMapTypeId(google.maps.MapTypeId.HYBRID);

    }
  }

  mapIntialize(div = "map", zoom = 18, lat = 25, long = 75) {
    if (this.isMapLoaded) {
      // document.getElementById(div).innerHTML="";
      // document.getElementById(div).append(this.mapLoadDiv.innerHTML);
      // this.setMapType(0);
      // return;
    }
    this.mapDiv = document.getElementById(div);
    let latlng = new google.maps.LatLng(lat, long);
    let opt =
    {
      center: latlng,
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scaleControl: true,
      styles: [{
        featureType: 'all',
        elementType: 'labels',
        stylers: [{
          visibility: 'on'
        }]
      }]
    };
    //$("#"+mapId).heigth(height);
    this.map = new google.maps.Map(this.mapDiv, opt);

    this.mapLoadDiv = this.map.getDiv();

    this.bounds = new google.maps.LatLngBounds();

    this.infoWindow = new google.maps.InfoWindow(
      {
        size: new google.maps.Size(50, 50),
        maxWidth: 300
      });
    this.isMapLoaded = true;
  }

  createLatLng(lat,lng){
    return new google.maps.LatLng(lat, lng);
  }
  createInfoWindow(){
    return new google.maps.InfoWindow();
  }

  createPolygon(latLngs, options?) {// strokeColor = '#', fillColor = '#') {
    const defaultOptions = {
      paths: latLngs,
      strokeColor: '#228B22',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      clickable: false,
      fillColor: '#ADFF2F',
      fillOpacity: 0.35
    };
    this.polygon = new google.maps.Polygon(options || defaultOptions);
    this.polygon.setMap(this.map);
  }
  createPolygons(latLngsMulti, options?) {// strokeColor = '#', fillColor = '#') {
    let index = 0;

    latLngsMulti.forEach(latLngs => {
      let colorBorder;
      let colorFill;
      let isMain = false;
      if (latLngs.isSec) {
        colorBorder = '#f00';
        colorFill = '#f88';
      } else if (latLngs.isMain) {
        colorBorder = '#0f0';
        colorFill = '#8f8';
      } else {
        colorBorder = '#00f';
        colorFill = '#88f';
      }
      const defaultOptions = {
        paths: latLngs.data,
        strokeColor: colorBorder,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        clickable: !latLngs.isMain,
        fillColor: colorFill,
        fillOpacity: 0.35
      };
      let polygon = new google.maps.Polygon(options || defaultOptions);
      this.polygons.push(polygon);
      polygon.setMap(this.map);
      let infoWindow = new google.maps.InfoWindow();
      infoWindow.opened = false;
      let showContent = latLngs.show;
      google.maps.event.addListener(polygon, 'mouseover', function (evt) {
        infoWindow.setContent("Info: "+showContent);
        infoWindow.setPosition(evt.latLng); // or evt.latLng
        infoWindow.open(this.map);
      });
      google.maps.event.addListener(polygon, 'mouseout', function (evt) {
        infoWindow.close();
        infoWindow.opened = false;
      });
      index++;
    });
  }

  addListerner(element,event,callback){
    google.maps.event.addListener(element, event,callback);
  }

  getLatLngValue(markerData) {
    let latLng = {lat:0,lng:0}
    let keys = Object.keys(markerData);
    latLng.lat = markerData[keys.find((element)=>{
      return element=="lat"||element=="y_lat"||element=="x_lat"||element=="x_tlat";
    })];
    latLng.lng = markerData[keys.find((element)=>{
      return element=="lng"||element=="long"||element=="x_long"||element=="x_tlong";
    })];
    return latLng;
  }

  createMarkers(markers, dropPoly = false, changeBounds = true, clickEvent?) {
    let thisMarkers = [];
    console.log("Markers", markers);
    for (let index = 0; index < markers.length; index++) {

      let subType = markers[index]["subType"];
      let design = markers[index]["type"] == "site" ? this.designsDefaults[0] :
        markers[index]["type"] == "subSite" ? this.designsDefaults[1] : null;
      let text = markers[index]["text"] ? markers[index]["text"] : " ";
      let pinColor = markers[index]["color"] ? markers[index]["color"] : "FFFF00";
      let latLng = this.getLatLngValue(markers[index]);
      let lat = latLng.lat;
      let lng = latLng.lng;
      let title = markers[index]["title"] ? markers[index]["title"] : "Untitled";
      let latlng = new google.maps.LatLng(lat, lng);
      let pinImage;
      //pin Image
      if (design) {
        pinImage = {
          path: design,
          // set custom fillColor on each iteration
          fillColor: "#" + pinColor,
          fillOpacity: 1,
          scale: 1.3,
          strokeColor: pinColor,
          strokeWeight: 2
        };
      } else {
        if (subType == 'marker')
          pinImage = "http://chart.apis.google.com/chart?chst=d_map_xpin_letter&chld=pin|" + index + "|" + pinColor + "|000000";
        else //if(subType=='circle')
          pinImage = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: "#" + pinColor,
            fillOpacity: 0.8,
            strokeWeight: 1
          };
      }


      let marker = new google.maps.Marker({
        position: latlng,
        flat: true,
        icon: pinImage,
        map: this.map,
        title: title
      });
      if (dropPoly)
        this.drawPolyMF(latlng);
      if (changeBounds&&(lat&&lng))
        this.setBounds(latlng);
      thisMarkers.push(marker);
      this.markers.push(marker);
      clickEvent && marker.addListener('click', clickEvent.bind(this, markers[index]));
      //  marker.addListener('mouseover', this.infoWindow.bind(this, marker, show ));

      //  marker.addListener('click', fillSite.bind(this,item.lat,item.long,item.name,item.id,item.city,item.time,item.type,item.type_id));
      //  marker.addListener('mouseover', showInfoWindow.bind(this, marker, show ));
    }
    return thisMarkers;
  }

  toggleBounceMF(id, evtype = 1) {
    //console.log("Bounce marker",id);
    //console.log("index",index);
    //.log("test",test);
    //console.log("item",item);
    console.log('Evtype:', evtype);
    if (this.markers[id]) {
      if (this.markers[id].getAnimation() == null && evtype == 1) {
        this.markers[id].setAnimation(google.maps.Animation.BOUNCE);
      }
      else if (evtype == 2 && this.markers[id].getAnimation() != null) {
        this.markers[id].setAnimation(null);
      }
    }
  }

  clearAll(reset = true, boundsReset = true,resetParams = {marker:true,polygons:true,polypath:true}) {
    
    resetParams.marker && this.resetMarker(reset,boundsReset);
    resetParams.polygons && this.resetPolygons();
    resetParams.polypath && this.resetPolyPath();
  }

  resetMarker(reset=true,boundsReset=true){
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    if (reset)
      this.markers = [];
    if (boundsReset) {
      this.bounds = new google.maps.LatLngBounds();
    }
  }
  resetPolygons(){
    if (this.polygon) {
      this.polygon.setMap(null);
      this.polygon = null;
    }
    if (this.polygons.length > 0) {
      this.polygons.forEach(polygon => {
        polygon.setMap(null);
      });
      this.polygons = [];
    }
  }
  resetPolyPath(){
    if (this.polygonPath) {
      this.polygonPath.setMap(null);
      this.polygonPath = null;
    }
  }

  createPolygonPath(polygonOptions?) {
    google.maps.event.addListener(this.map, 'click', (event) => {
      if (this.isDrawAllow) {
        this.createPolyPathManual(event.latLng,polygonOptions);      
      }
    });
  }
  createPolyPathManual(latLng,polygonOptions?){
    console.log("In Here");
        if (!this.polygonPath) {
          const defaultPolygonOptions = {
            strokeColor: '#000000',
            strokeOpacity: 1,
            strokeWeight: 3,
            icons: [{
              icon: this.lineSymbol,
              offset: '100%'
            }]
          }
          this.polygonPath = new google.maps.Polyline(polygonOptions || defaultPolygonOptions);
          this.polygonPath.setMap(this.map);
        }
        let path = this.polygonPath.getPath();
        path.push(latLng);
  }

  setMapType(typeIndex){
    let types = ['roadmap','satellite','hybrid','terrain'];
    this.map.setMapTypeId(types[typeIndex]);
  }

  setBounds(latLng, reset = false) {
    if (!this.bounds) this.bounds = this.map.getBounds();
    this.bounds.extend(latLng);
    this.map.fitBounds(this.bounds);
  }
  getMapBounds() {
    if (this.map) {
      let boundsx = this.map.getBounds();
      let ne = boundsx.getNorthEast(); // LatLng of the north-east corner
      let sw = boundsx.getSouthWest(); // LatLng of the south-west corder
      let lat2 = ne.lat();
      let lat1 = sw.lat();
      let lng2 = ne.lng();
      let lng1 = sw.lng();
      return { lat1: lat1, lat2: lat2, lng1: lng1, lng2: lng2 };
    }
  }
  drawPolyMF(to) {
    if (!this.polygonPath) {
      this.polygonPath = new google.maps.Polyline({
        strokeColor: '#000000',
        strokeOpacity: 1,
        strokeWeight: 2,
        icons: [{
          icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
          offset: '100%',
          repeat: '20px'
        }]
      });
      this.polygonPath.setMap(this.map);
    }
    var path = this.polygonPath.getPath();
    path.push(to);
  }
}
