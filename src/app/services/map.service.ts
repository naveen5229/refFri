import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonService } from './common.service';
declare let google: any;
declare let MarkerClusterer: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  events: Subject<any> = new Subject();
  poly = null;
  test = null;
  elevator = null;
  polyVertices = [];
  map = null;
  mapDiv = null;
  markers = [];
  bounds = null;
  infoStart = null;
  infoWindow = null;
  polygon = null;
  polygons = [];
  isMapLoaded = false;
  mapLoadDiv = null;
  cluster = null;
  labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
  };
  lineSymbolBack = {
    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW
  };
  customMarkers: any[] = [];
  infoWindows: any[] = [];
  polygonPath = null;
  polygonPathVertices = [];
  isDrawAllow = false;
  designsDefaults = [
    "M  0,0,  0,-5,  -5,-5,-5,-13 , 5,-13 ,5,-5, 0,-5 z",///Rect
    "M  0,0,  0,-5,  -5,-13 , 5,-13 , 0,-5 z"//Pin
  ];
  options = null;
  heatmap = null;
  polygonPaths = [];
  polygonPathsVertices = [[]];
  constructor(public common: CommonService) {
  }

  toggleHeatmap() {
    this.heatmap.setMap(this.heatmap.getMap() ? null : this.map);
  }

  changeGradient() {
    const gradient = [
      "rgba(0, 255, 255, 0)",
      "rgba(0, 255, 255, 1)",
      "rgba(0, 191, 255, 1)",
      "rgba(0, 127, 255, 1)",
      "rgba(0, 63, 255, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(0, 0, 223, 1)",
      "rgba(0, 0, 191, 1)",
      "rgba(0, 0, 159, 1)",
      "rgba(0, 0, 127, 1)",
      "rgba(63, 0, 91, 1)",
      "rgba(127, 0, 63, 1)",
      "rgba(191, 0, 31, 1)",
      "rgba(255, 0, 0, 1)",
    ];
    this.heatmap.set("gradient", this.heatmap.get("gradient") ? null : gradient);
  }
  changeRadius() {
    this.heatmap.set("radius", this.heatmap.get("radius") ? null : 20);
  }

  changeOpacity() {
    this.heatmap.set("opacity", this.heatmap.get("opacity") ? null : 0.2);
  }

  autoSuggestion(elementId, setLocation?, types?) {
    let options = {
      types: types ? types : ['(cities)'],
      componentRestrictions: { country: "in" }
    };
    let ref = document.getElementById(elementId);//.getElementsByTagName('input')[0];
    let autocomplete = new google.maps.places.Autocomplete(ref, options);
    google.maps.event.addListener(autocomplete, 'place_changed', this.updateLocation.bind(this, elementId, autocomplete, setLocation));
  }

  updateLocation(elementId, autocomplete, setLocation?) {
    let placeFull = autocomplete.getPlace();
    let lat = placeFull.geometry.location.lat();
    let lng = placeFull.geometry.location.lng();
    let place = placeFull.formatted_address.split(',')[0];
    setLocation && setLocation(place, lat, lng, placeFull.formatted_address);
  }

  zoomAt(latLng, level = 20) {
    this.map.panTo(latLng);
    if (level != this.map.getZoom())
      this.zoomMap(level);
  }

  centerAt(latLng) {
    this.map.panTo(latLng);
  }

  zoomMap(zoomValue) {
    this.map.setZoom(zoomValue);
    if (zoomValue <= 14) {
      this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    } else if (zoomValue > 14) {
      this.map.setMapTypeId(google.maps.MapTypeId.HYBRID);

    }
  }

  setMultiBounds(bounds, isReset = false) {
    if (isReset)
      this.resetBounds();
    for (let index = 0; index < bounds.length; index++) {
      const thisPoint = bounds[index];
      this.setBounds(this.createLatLng(thisPoint.lat, thisPoint.lng));
    }
  }
  setPolyBounds(polygon, isReset = false) {
    if (isReset)
      this.resetBounds();
    for (let index = 0; index < polygon["i"].length; index++) {
      const thisPoint = polygon["i"][index];
      this.setBounds(this.createLatLng(thisPoint.lat(), thisPoint.lng()));
    }
  }

  createSingleMarker(latLng, icons?, dragEvent?, clickEvent?, label?) {
    var icon = icons ? icons : {
      path: google.maps.SymbolPath.redpin,
      scale: 4,
      fillColor: "#000000",
      fillOpacity: 1,
      strokeWeight: 1
    };
    var marker = new google.maps.Marker({
      icon: icon,
      position: latLng,
      label: label,
      map: this.map,
      draggable: dragEvent ? true : false,
    });


    if (dragEvent) {
      this.addListerner(marker, 'dragend', (e) => dragEvent(e, latLng))
    }
    if (clickEvent) {
      this.addListerner(marker, 'click', (e) => clickEvent(e, latLng))
    }
    return marker;
  }

  mapIntialize(div = "map", zoom = 18, lat = 25, long = 75, showUI = false, usePrevious = false, options?: any) {
    let latLng = new google.maps.LatLng(lat, long);
    this.clearAll();
    this.mapDiv = document.getElementById(div);
    if (this.mapLoadDiv && usePrevious) {
      this.map.panTo(latLng);
      if (options) {
        this.map.set(options);
      }
      this.mapDiv.appendChild(this.mapLoadDiv);
      console.log('JRx: map not re-initialized!');
    } else {
      let opt = {
        center: latLng,
        zoom: zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scaleControl: true,
        disableDefaultUI: showUI,
        styles: [{
          featureType: 'all',
          elementType: 'labels',
          stylers: [{
            visibility: 'on'
          }]
        }]
      };

      opt = Object.assign({}, opt, (options || {}));
      console.log('------------------opt', opt);
      const mapElement = document.createElement('div');
      mapElement.classList.add('google-map');

      this.map = new google.maps.Map(mapElement, opt);
      this.mapLoadDiv = this.map.getDiv();
      this.mapDiv.appendChild(this.mapLoadDiv);
      this.bounds = new google.maps.LatLngBounds();
      this.isMapLoaded = true;
    }
    this.events.next({ type: 'initialize' });
    return this.map;
  }

  createLatLng(lat, lng) {
    return new google.maps.LatLng(lat, lng);
  }
  createInfoWindow() {
    let infoWindow = new google.maps.InfoWindow();
    this.infoWindows.push(infoWindow);
    return infoWindow;
  }

  createPolygon(latLngs, options?) {// strokeColor = '#', fillColor = '#') {
    if (this.polygon) {
      this.polygon.setMap(null);
      this.polygon = null;
    }

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
    return this.polygon;
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
        infoWindow.setContent("Info: " + showContent);
        infoWindow.setPosition(evt.latLng); // or evt.latLng
        infoWindow.open(this.map);
      });
      google.maps.event.addListener(polygon, 'mouseout', function (evt) {
        infoWindow.close();
        infoWindow.opened = false;
      });
      index++;
    });
    return this.polygons;

  }

  addListerner(element, event, callback) {
    if (element)
      google.maps.event.addListener(element, event, callback);
  }

  getLatLngValue(markerData) {
    let latLng = { lat: 0, lng: 0 }
    let keys = Object.keys(markerData);
    latLng.lat = parseFloat(markerData[keys.find((element) => {
      return element == "lat" || element == "y_lat" || element == "x_lat" || element == "x_tlat" || element == "_lat" || element === 'latitude';
    })]);
    latLng.lng = parseFloat(markerData[keys.find((element) => {
      return element == "lng" || element == "long" || element == "x_long" || element == "x_tlong" || element == "_long" || element === 'longitude';
    })]);
    return latLng;
  }

  createMarkers(markers, dropPoly = false, changeBounds = true, infoKeys?, afterClick?) {
    try {
      let thisMarkers = [];
      let infoWindows = [];
      for (let index = 0; index < markers.length; index++) {
        let subType = markers[index]["subType"];
        let design = markers[index]["type"] == "site" ? this.designsDefaults[0] :
          markers[index]["type"] == "subSite" ? this.designsDefaults[1] : null;
        let text = markers[index]["text"] ? markers[index]["text"] : " ";
        let pinColor = markers[index]["color"] ? markers[index]["color"] : "FFFF00";
        let latLng = this.getLatLngValue(markers[index]);
        let lat = latLng.lat;
        let lng = latLng.lng;
        let title = markers[index]["title"] ? markers[index]["title"] : "";
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
            pinImage = "http://chart.apis.google.com/chart?chst=d_map_xpin_letter&chld=pin|" + (index + 1) + "|" + pinColor + "|000000";
          else //if(subType=='circle')
            pinImage = {
              path: google.maps.SymbolPath.CIRCLE,
              scale: this.options ? this.options.circle.scale : 6,
              fillColor: "#" + pinColor,
              fillOpacity: 0.8,
              strokeWeight: 1
            };
        }

        let marker = null;
        if (dropPoly)
          this.drawPolyMF(latlng);
        if ((lat && lng)) {
          marker = new google.maps.Marker({
            position: latlng,
            flat: true,
            icon: pinImage,
            map: this.map,
            title: title,
            label: title
          });
          let displayText = '';
          if (infoKeys) {
            let infoWindow = this.createInfoWindow();
            infoWindows.push(infoWindow);
            infoWindow.opened = false;
            if (typeof (infoKeys) == 'object') {
              infoKeys.map((display, indexx) => {
                if (indexx != infoKeys.length - 1) {
                  displayText += this.common.ucWords(display) + " : " + markers[index][display] + ' <br> ';
                } else {
                  displayText += this.common.ucWords(display) + " : " + markers[index][display];
                }
              });
            } else {
              displayText = this.common.ucWords(infoKeys) + " : " + markers[index][infoKeys];
            }
            google.maps.event.addListener(marker, 'click', function (evt) {
              this.infoStart = new Date().getTime();
              for (let infoIndex = 0; infoIndex < infoWindows.length; infoIndex++) {
                const element = infoWindows[infoIndex];
                if (element)
                  element.close();
              }
              infoWindow.setContent("<span style='color:blue'>Info</span> <br> " + displayText);
              infoWindow.setPosition(evt.latLng); // or evt.latLng
              infoWindow.open(this.map);
              afterClick(markers[index]);
            });
          }
          if (changeBounds)
            this.setBounds(latlng);
        }
        this.markers.push(marker);
        thisMarkers.push(marker);

        //  marker.addListener('mouseover', this.infoWindow.bind(this, marker, show ));

        //  marker.addListener('click', fillSite.bind(this,item.lat,item.long,item.name,item.id,item.city,item.time,item.type,item.type_id));
        //  marker.addListener('mouseover', showInfoWindow.bind(this, marker, show ));


      }
      return thisMarkers;
    } catch (e) {
      console.error('Exception in createMarkers ', e);
    }
  }

  createMarkerCluster(markers) {
    let markerCluster =
      new MarkerClusterer(this.map, markers, {
        imagePath:
          "assets\\images\\blank",
      });
    return markerCluster;
  }

  createCluster(markers, ismake?) {
    let infoWindows = [];

    if (ismake) {
      this.cluster = new MarkerClusterer(this.map,
        markers.filter(marker => (marker && marker.position && marker.position.lat() && marker.position.lng())),
        { gridSize: 40, maxZoom: 16, zoomOnClick: false, minimumClusterSize: 2, imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
      let infoWindow = this.createInfoWindow();
      infoWindows.push(infoWindow);
      infoWindow.opened = false;
      google.maps.event.addListener(this.cluster, 'clusterclick', (cluster) => {

        let infoStr = '';
        cluster.markers_.map(mrk => {
          infoStr += mrk.title + ', '
        })
        this.infoStart = new Date().getTime();
        for (let infoIndex = 0; infoIndex < infoWindows.length; infoIndex++) {
          const element = infoWindows[infoIndex];
          if (element)
            element.close();
        }
        infoWindow.setContent(infoStr);
        infoWindow.setPosition(cluster.center_); // or evt.latLng
        infoWindow.open(this.map);
      });

    } else {
      if (this.cluster)
        this.cluster.clearMarkers();
      markers.map(marker => marker && marker.setMap(this.map));
    }
    return this.cluster;
  }


  circle = null;
  createCirclesOnPostion(center, radius, stokecolor = '#FF0000', fillcolor = '#FF0000', fillOpacity = 0.1, strokeOpacity = 1) {
    this.circle = new google.maps.Circle({
      strokeColor: stokecolor,
      strokeOpacity: strokeOpacity,
      strokeWeight: 2,
      fillColor: fillcolor,
      fillOpacity: fillOpacity,
      map: this.map,
      center: center,
      radius: radius
    });
    return this.circle;
  }

  toggleBounceMF(id, evtype = 1) {
    // console.log("id=", id);
    if (this.markers[id]) {
      if (this.markers[id].getAnimation() == null && evtype == 1) {
        this.markers[id].setAnimation(google.maps.Animation.BOUNCE);
      }
      else if (evtype == 2 && this.markers[id].getAnimation() != null) {
        this.markers[id].setAnimation(null);
      }
    }
  }

  createPoint(x, y) {
    return new google.maps.Point(x, y);
  }

  clearAll(reset = true, boundsReset = true, resetParams = { marker: true, polygons: true, polypath: true }) {
    resetParams.marker && this.resetMarker(reset, boundsReset);
    resetParams.polygons && this.resetPolygons();
    resetParams.polypath && this.resetPolyPath();
    this.options ? this.options.polypaths && this.resetPolyPaths() : '';
    this.options ? this.options.clearHeat && this.resetHeatMap() : '';
    this.customMarkers.map(marker => marker.setMap(null));
    this.customMarkers = [];
    try {
      this.infoWindows.map(infoWindow => infoWindow.close());
      this.infoWindows.map(infoWindow => infoWindow.setMap(null));
      this.infoWindows = [];
    } catch (e) { console.log('Exception in clearing info windows : ', e) }
  }
  resetHeatMap() {
    try {
      if (this.heatmap) {
        this.heatmap.setMap(null);
        this.heatmap = null;
      }
    } catch (e) {
      console.error('Exception in resetHeatMap', e);
    }
  }

  resetMarker(reset = true, boundsReset = true, markers?) {
    try {
      let actualMarker = markers || this.markers;
      for (let i = 0; i < actualMarker.length; i++) {
        actualMarker[i].setMap(null);
      }
      if (reset)
        actualMarker = [];
      if (boundsReset) {
        this.bounds = new google.maps.LatLngBounds();
      }
      this.markers = [];
    } catch (e) {
      console.error('Exception in resetMarker:', e);
    }
  }

  resetBounds() {
    this.bounds = new google.maps.LatLngBounds();
    for (let index = 0; index < this.markers.length; index++) {
      if (this.markers[index]) {
        let pos = this.markers[index].position;
        if (pos.lat() != 0 && this.markers[index].getMap())
          this.setBounds(pos);
      }
    }
  }
  resetPolygons() {
    try {
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
    } catch (e) {
      console.error('Exception in resetPolygons:', e);
    }
  }
  resetPolyPaths() {
    try {
      if (this.polygonPaths.length > 0) {
        this.polygonPaths.forEach(path => {
          path.setMap(null);
        });
        this.polygonPaths = [];
      }
      if (this.polygonPathsVertices.length > 0) {
        this.polygonPathsVertices.forEach(polyPathVertices => {
          if (polyPathVertices.length > 0) {
            polyPathVertices.forEach(polyPathVertix => {
              polyPathVertix.setMap(null);
            });
          }
        });
        this.polygonPathsVertices = [[]];
      }
    } catch (e) {
      console.error('Exception in resetPolyPaths', e);
    }
  }
  resetPolyPath() {
    try {
      if (this.polygonPath) {
        this.polygonPath.setMap(null);
        this.polygonPath = null;
      }
      if (this.polygonPathVertices.length > 0) {
        this.polygonPathVertices.forEach(polyPathVertix => {
          polyPathVertix.setMap(null);
        });
        this.polygonPathVertices = [];
      }
    } catch (e) {
      console.error('Exception in resetPolyPath', e);
    }
  }

  createPolygonPath(polygonOptions?, drawVertix?) {
    google.maps.event.addListener(this.map, 'click', (event) => {
      if (this.isDrawAllow) {
        this.createPolyPathManual(event.latLng, polygonOptions, drawVertix);
      }
    });
  }
  createPolyPathManual(latLng, polygonOptions?, drawVertix?) {
    try {
      if (!this.polygonPath) {
        const defaultPolygonOptions = {
          strokeColor: 'black',
          strokeOpacity: 1,
          strokeWeight: 3,
          icons: [{
            icon: this.lineSymbol,
            offset: '100%'
          }]
        };
        this.polygonPath = new google.maps.Polyline(polygonOptions || defaultPolygonOptions);
        this.polygonPath.setMap(this.map);
      }
      let path = this.polygonPath.getPath();
      path.push(latLng);
      drawVertix && this.polygonPathVertices.push(this.createSingleMarker(latLng));
      return this.polygonPath;
    } catch (e) {
      console.error('Exception in createPolyPathManual ', e);
    }
  }
  createPolyPathDetached2(latLng, polygonOptions?, drawVertix?,) {
    if (!this.poly) {
      const defaultPolygonOptions = {
        strokeColor: "black",
        strokeOpacity: 1,
        strokeWeight: 3,
        icons: [{
          icon: this.lineSymbol,
          offset: '100%'
        }]
      }
      this.poly = new google.maps.Polyline(polygonOptions || defaultPolygonOptions);
      this.poly.setMap(this.map);
    }
    let path = this.poly.getPath();
    path.push(this.createLatLng(latLng.lat, latLng.lng));
    drawVertix && this.polyVertices.push(this.createSingleMarker(latLng));
    return this.poly;
  }

  createPolyPathDetached(latLng, polygonOptions?, drawVertix?, poly?, infoKeys?) {
    if (!poly) {
      const defaultPolygonOptions = {
        strokeColor: "black",
        strokeOpacity: 1,
        strokeWeight: 3,
        icons: [{
          icon: this.lineSymbol,
          offset: '100%'
        }]
      }

      poly = new google.maps.Polyline(polygonOptions || defaultPolygonOptions);
      poly.setMap(this.map);
      let infoWindow = new google.maps.InfoWindow();
      infoWindow.opened = false;
      google.maps.event.addListener(poly, 'mouseover', function (evt) {
        infoWindow.setContent("Info: ");
        infoWindow.setPosition(evt.latLng); // or evt.latLng
        infoWindow.open(this.map);
      });
      // google.maps.event.addListener(poly, 'mouseout', evt => {
      //   infoWindow.close();
      //   infoWindow.opened = false;
      // }); 
    }
    let path = poly.getPath();
    path.push(this.createLatLng(latLng.lat, latLng.lng));
    drawVertix && this.polyVertices.push(this.createSingleMarker(latLng));
    return poly;
  }

  infoCallback(infowindow) {
    return function () {
      infowindow.open(this.map);
    };
  }
  undoPolyPath(polyLine?) {
    let path = polyLine ? polyLine.getPath() : this.polygonPath.getPath();
    path.pop();
  }



  createPolyPathsManual(latLngsAll, afterClick?, drawVertix?) {
    latLngsAll.forEach((latLngAll) => {
      this.poly = null;
      this.polyVertices = [];
      latLngAll.latLngs.forEach((latLng) => {
        const defaultPolygonOptions = {
          strokeColor: latLngAll.color,
          strokeOpacity: 1,
          strokeWeight: 2,
          icons: [{
            icon: null,
            offset: '100%'
          }]
        }
        this.createPolyPathDetached(latLng, defaultPolygonOptions);
      });
      this.polygonPaths.push(this.poly);
      drawVertix && this.polygonPathsVertices.push(this.polyVertices);
      this.addListerner(this.poly, 'click', function (event) { afterClick(latLngAll, event); });

    });
  }


  setMapType(typeIndex) {
    let types = ['roadmap', 'satellite', 'hybrid', 'terrain'];
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
  createHeatMap(points, changeBounds = true) {
    var googlePoints = [];
    for (const point in points) {
      if (points.hasOwnProperty(point)) {
        const thisPoint = points[point];
        var latLng = this.getLatLngValue(thisPoint);
        var googleLatLng = this.createLatLng(latLng.lat, latLng.lng);
        googlePoints.push(googleLatLng);
        if (changeBounds)
          this.setBounds(googleLatLng);
      }
    }
    if (googlePoints.length != 0) {
      this.heatmap = new google.maps.visualization.HeatmapLayer({
        data: googlePoints,
        map: this.map
      });
    }
  }

  distanceBtTwoPoint(startLat, startLong, endLat, endLong) {
    return new Promise((resolve, reject) => {
      let origin = new google.maps.LatLng(startLat, startLong);
      let destination = new google.maps.LatLng(endLat, endLong);
      let service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        avoidHighways: false,
        avoidTolls: false,
      }, (response, status) => {
        if (status != google.maps.DistanceMatrixStatus.OK) {
          reject(-1)
        } else {
          resolve(response.rows[0].elements[0].distance.value);
        }
      });
    });
  }


  displayLocationElevation(lat, lng) {
    let prom = new Promise((resolve, reject) => {

      this.elevator ? this.elevator : this.elevator = new google.maps.ElevationService;
      let location = this.createLatLng(lat, lng);
      this.elevator.getElevationForLocations({
        'locations': [location]
      },
        (response, status) => {
          if (status != google.maps.DistanceMatrixStatus.OK) {
            reject(-1)
          } else {
            resolve(response[0]);
          }
        });

    });
    return prom;
  }

  drawDataonMap(data) {
    data.forEach(ele => {
      let icon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: ele.fillColor || '#0000FF',
        fillOpacity: 1,
        strokeWeight: 1
      };

      if (ele.lat && ele.lng && ele.type == 'marker') {
        let showContent = ele.show;
        this.createSingleMarker(this.createLatLng(ele.lat, ele.lng), icon, false, (e, latlng) => {
          let infoWindow = new google.maps.InfoWindow();
          infoWindow.opened = false;
          infoWindow.setContent(showContent);
          infoWindow.setPosition(e.latLng); // or evt.latLng
          infoWindow.open(this.map);

        });
      } else if (ele.lat && ele.lng && ele.type == 'cluster') {
        let icon1 = {
          url: ele.url,
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(16, 16)
        };
        let center = this.createLatLng(ele.lat, ele.lng)
        let radius = ele.radius || 100;
        this.createCirclesOnPostion(center, radius, ele.strokeColor, ele.fillColor);

        let showContent = ele.show;
        this.createSingleMarker(this.createLatLng(ele.lat, ele.lng), icon1, false, (e, latlng) => {
          let infoWindow = new google.maps.InfoWindow();
          infoWindow.opened = false;
          infoWindow.setContent(showContent);
          infoWindow.setPosition(e.latLng); // or evt.latLng
          infoWindow.open(this.map);

        }, ele.label);
      }
    });
    this.setMultiBounds(data);
  }

  getURL(points) {
    let url = "https://www.google.com/maps/dir/";
    points.map(pt => {
      url = url + "'" + pt.lat + "," + pt.long + "'/";
    });
    return url;
  }

  setHeatMap(data) {
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: data,
      map: this.map,
    });
    return this.heatmap;
  }

  createSimpleMarkers(datax, setBounds = true) {
    let markers = [];
    datax.map((location, i) => {
      if (location.lat && location.lat != 0)
        markers.push(new google.maps.Marker({
          position: this.createLatLng(location.lat, location.long),
          label: location.title,
        }));
    });
    if (setBounds) {
      var bounds = new google.maps.LatLngBounds();
      datax.forEach(e => {
        if (e.lat && e.lat != 0) {
          let point = new google.maps.LatLng(e.lat, e.long);
          datax.push({ location: point, weight: e.weight })
          bounds.extend(point);
        }
      });
      this.map.fitBounds(bounds);
    }
    return markers;
  }

  createPolyline(coordinates, options?) {
    const defaultOptions = {
      strokeColor: 'red',
      strokeOpacity: 1,
      strokeWeight: 3,
    };

    const polyline = new google.maps.Polyline({
      path: coordinates,
      ...(options || defaultOptions)
    });
    polyline.setMap(this.map);
    return polyline;
  }

  createMarker(latlng, options?: any) {
    const defaultOptions = {
    }
    const marker = new google.maps.Marker({
      position: latlng,
      ...(options || defaultOptions)
    });

    marker.setMap(this.map);
    this.customMarkers.push(marker);
    return marker;
  }

  clearEvents() {
    try {
      google.maps.event.clearListeners(this.map, 'click');
      google.maps.event.clearListeners(this.map, 'place_changed');
    } catch (e) {
    }
  }

  clearMarkerEvents(marker) {
    try {
      google.maps.event.clearListeners(marker, 'click');
    } catch (e) {
    }
  }

}