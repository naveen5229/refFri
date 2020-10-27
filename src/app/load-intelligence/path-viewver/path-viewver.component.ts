import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
// import { LoadDetailsComponent } from '../load-details/load-details.component';

declare var google: any;
@Component({
  selector: 'path-viewver',
  templateUrl: './path-viewver.component.html',
  styleUrls: ['./path-viewver.component.scss']
})
export class PathViewverComponent implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  map: any;
  hotspot: any = null;
  routes = [];
  costRoutes = [];
  findAsaRoutes = [];
  costRoutesCopy = [];
  routeLines = [];
  linkLines = [];
  showLines = [];
  routeType = "";
  loadedRoutes = [];
  total = {
    profit: 0,
    cost: 0,
    revenue: 0
  };
  viewType = "map";

  table = [];

  connect = false;

  selected = {
    suggestion: []
  };
  polygons = [];

  geocoder = null;
  showInfo = -1;
  hideInfo = -1;

  runningPolyline1 = null;
  runningPolyline2 = null;
  runningPolyline3 = null;
  isRunPolyline = false;


  bounds = null;

  isAvoidSpecialAreas = true;

  source = '';
  destination = '';
  constructor(
    public common: CommonService,
    public api: ApiService,
    public data: DataService,
    public router: Router,
    public location: Location,
    public modalCtrl: NgbModal) {
    let params = this.common.params;
    if (!params) {
      params = JSON.parse(localStorage.getItem('params'));
    } else {
      localStorage.setItem('params', JSON.stringify(params));
    }
    console.log('Params: ', params);
    this.routeType = params.routeType;

    this.routes = params.routes;

    setTimeout(() => {
      this.loadMap();
      if (this.routeType == 'cost') {
        this.getCostRoutesFromAPI();
      } else if (this.routeType == 'findAsa') {
        this.getFindAsaRoutesFromAPI();
      } else if (this.routeType == 'profit') {
        this.getProfitRoutesFromAPI();
      }
    }, 3000);

  }

  ngOnInit() {
    console.log('onInit', this.common.params);
    this.source = this.common.params['routes'][0].origin;
    this.destination = this.common.params['routes'][0].destination;
    console.log('source', this.source, 'destination', this.destination);
  }


  loadMap(lat = 26.9124336, lng = 75.78727090000007) {
    let mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: 5,
      disableDefaultUI: true,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.geocoder = new google.maps.Geocoder;
  }

  showHideInfo(id) {
    this.hideInfo = this.showInfo;
    this.showInfo = (this.showInfo != id) ? id : -1;
    console.log('Id:', id);
    console.log('hideInfo:', this.hideInfo);
    console.log('showInfo:', this.showInfo);

  }
  selectSuggestion(type, routeIndex, suggestIndex, loadedRoute, suggestionData) {
    console.log('Route: ', loadedRoute);
    console.log('Suggestion: ', suggestionData);

    if (type == 'route') {
      this.selected.suggestion[routeIndex] = -1;
    } else {
      this.selected.suggestion[routeIndex] = suggestIndex;
    }

    let data = {
      routeId: loadedRoute.id,
      index: type == 'route' ? -1 : suggestionData.index,
      suggestionId: type == 'route' ? loadedRoute.route.id : suggestionData.id,
      preId: routeIndex != 0 ? this.loadedRoutes[routeIndex - 1].route.id : -1,
      nextId: routeIndex != this.loadedRoutes.length - 1 ? this.loadedRoutes[routeIndex + 1].route.id : this.connect ? this.loadedRoutes[0].route.id : -1,
      data: {
        rate: -1,
        tonnage: -1,
        brokrage: -1,
        loading: -1,
        unloading: -1
      }
    }

    console.log('Suggetion Data: ', data, routeIndex);
    this.getSuggestData(data, routeIndex, loadedRoute.route.id);
  }

  getSuggestData(data, routeIndex, loadedRouteId) {
    this.isRunPolyline = false;
    let loader = this.common.loading++;
    // loader.present();
    this.api.post('segmentSuggestion', data)
      .subscribe(res => {
        console.log('RES: ', res);
        // loader.dismiss();
        if (!this.common.handleApiResponce(res)) {
          this.common.showToast(res['msg']);
          localStorage.clear();
          // this.navCtrl.setRoot('LoginPage');
          return;
        }

        this.handleSuggestionUpdate(res['data'].routes, routeIndex, loadedRouteId);
      }, err => {
        console.log(err);
        // loader.dismiss();
      });
  }
  // editLoadDetails(type, routeIndex, suggestIndex, loadedRoute, suggestionData) {
  //   this.common.params = { suggestion: suggestionData };
  //   // let modal = this.modalCtrl.open(LoadDetailsComponent, { size: 'lg' });


  //   modal.result.then(data => {
  //     console.log(data);
  //     if (!data.status) return;
  //     this.hideInfo = this.showInfo;
  //     this.showInfo = -1;

  //     if (type == 'route') {
  //       this.selected.suggestion[routeIndex] = -1;
  //     } else {
  //       this.selected.suggestion[routeIndex] = suggestIndex;
  //     }

  //     let info = {
  //       index: type == 'route' ? -1 : suggestionData.index,
  //       suggestionId: type == 'route' ? loadedRoute.route.id : suggestionData.id,
  //       preId: routeIndex != 0 ? this.loadedRoutes[routeIndex - 1].route.id : -1,
  //       nextId: routeIndex != this.loadedRoutes.length - 1 ? this.loadedRoutes[routeIndex + 1].route.id : this.connect ? this.loadedRoutes[0].route.id : -1,
  //       data: {
  //         rate: (data.load.rate != suggestionData.rate) ? data.load.rate : -1,
  //         tonnage: (data.load.tonnage != suggestionData.tonnage) ? data.load.tonnage : -1,
  //         brokrage: (data.load.brokrage != suggestionData.brokrage) ? data.load.brokrage : -1,
  //         loading: (data.load.loading != suggestionData.loading) ? data.load.loading : -1,
  //         unloading: (data.load.unloading != suggestionData.unloading) ? (data.load.unloading != suggestionData.unloading) : -1
  //       }
  //     };
  //     this.loadedRoutes[routeIndex].route.suggestions[suggestIndex].rate = data.load.rate;
  //     this.loadedRoutes[routeIndex].route.suggestions[suggestIndex].tonnage = data.load.tonnage;
  //     this.loadedRoutes[routeIndex].route.suggestions[suggestIndex].brokrage = data.load.brokrage;
  //     this.loadedRoutes[routeIndex].route.suggestions[suggestIndex].loading = data.load.loading;
  //     this.loadedRoutes[routeIndex].route.suggestions[suggestIndex].unloading = data.load.unloading;

  //     console.log('Suggetion Data: ', info, routeIndex);
  //     this.getSuggestData(info, routeIndex, loadedRoute.route.id);



  //   });
  //   // modal.present();
  // }

  handleSuggestionUpdate(routes, routeIndex, loadedRouteId) {
    let index = this.loadedRoutes[routeIndex].index;

    this.costRoutes[index] = routes[1];
    if (typeof (this.costRoutes[index].latLng) == typeof ('')) {
      this.costRoutes[index].latLng = JSON.parse(this.costRoutes[index].latLng);
    }

    if (routes[0]) {
      this.costRoutes[index - 1] = routes[0];
      if (typeof (this.costRoutes[index - 1].latLng) == typeof ('')) {
        this.costRoutes[index - 1].latLng = JSON.parse(this.costRoutes[index - 1].latLng);
      }
    }

    if (routes[2]) {
      this.costRoutes[index + 1] = routes[2];
      if (typeof (this.costRoutes[index + 1].latLng) == typeof ('')) {
        this.costRoutes[index + 1].latLng = JSON.parse(this.costRoutes[index + 1].latLng);
      }
    }
    console.log(this.costRoutes);
    this.handleCostRoutes(this.costRoutes, 'suggestion');
  }



  getCostRoutesFromAPI(isDragged = false) {
    this.removeDummyRoutes();
    let loader = this.common.loading;

    let routes = [];
    this.routes.map(route => {
      routes.push({
        "origin": {
          "name": route.origin.name,
          "lat": route.origin.lat,
          "lng": route.origin.lng
        },
        "destination": {
          "name": route.destination.name,
          "lat": route.destination.lat,
          "lng": route.destination.lng
        }
      })
    });

    console.log(routes);

    console.log(routes);
    const params = {
      routes: routes,
      searchId: this.common.searchId || -1,
      connect: this.connect
    };

    console.log(params);
    // loader.present();

    this.api.post('info', params)
      .subscribe(res => {
        console.log('Res:', res);
        // loader.dismiss();
        let data = res['data']['special_areas'];
        if (res && res['data']['hotspotDetails']) {
          this.hotspot = res['data']['hotspotDetails'];
          console.log(this.hotspot);
        }
        // let datay = [{data:data}];
        // this.createPolygons(datay);



        let latLngsArray = [];
        let isMain = false;
        let isSec = false;
        let minDis = 100000;
        let minIndex = -1;

        Object.keys(data).map(e => {
          latLngsArray.push({ data: data[e]['latLngs'], info: e });

        })
        console.log(latLngsArray);

        this.createPolygons(latLngsArray);







        if (!this.common.handleApiResponce(res)) {
          this.common.showToast(res['msg']);
          localStorage.clear();

          // this.navCtrl.setRoot('LoginPage');
          return;
        }

        localStorage.setItem('COSTROUTES', JSON.stringify(res));
        if (res['success']) {
          if (!isDragged) {
            this.common.searchId = res['data'].searchId;
          }
          localStorage.setItem('COSTROUTES', JSON.stringify(res['data']['routes']));
          this.handleCostRoutes(res['data']['routes']);
          return;
        }
        this.common.showToast(res['msg']);
      }, err => {
        // loader.dismiss();
        console.error('Error', err);
      });

    // console.log(JSON.parse(localStorage.getItem('COSTROUTES')));
    // setTimeout(this.handleCostRoutes.bind(this, JSON.parse(localStorage.getItem('COSTROUTES'))), 3000);


  }

  getFindAsaRoutesFromAPI(isDragged = false) {
    this.removeDummyRoutes();
    let routes = [];
    this.routes.map(route => {
      routes.push({
        "origin": {
          "name": route.origin.name,
          "lat": parseFloat(route.origin.lat),
          "lng": parseFloat(route.origin.long)
        },
        "destination": {
          "name": route.destination.name,
          "lat": parseFloat(route.destination.lat),
          "lng": parseFloat(route.destination.long)
        }
      })
    });

    console.log(routes);

    console.log(this.common.params);
    if (this.common.params && this.common.params.routes[0]['isAvoidSpecialAreas']) {
      this.isAvoidSpecialAreas = this.common.params && this.common.params.routes[0]['isAvoidSpecialAreas'];
    }
    const params = {
      routes: routes,
      // searchId: this.common.searchId || -1,
      searchId: -1,
      connect: this.connect,
      isAvoidSpecialAreas: this.isAvoidSpecialAreas
    };

    console.log(params);
    this.common.loading++;
    this.api.postJava('info', params,)
      .subscribe(res => {
        console.log('Res:', res);
        this.common.loading--;
        if (!this.common.handleApiResponce(res)) {
          this.common.showToast(res['msg']);
          localStorage.clear();
          return;
        }
        if (res['success']) {
          localStorage.setItem('COSTROUTES', JSON.stringify(res));
          if (!res['data']) return;
          
          if (res['data']['hotspotDetails']) {
            this.hotspot = res['data']['hotspotDetails']
          }

          if (res['data']['special_areas']) {
            let data = res['data']['special_areas'];
            let latLngsArray = [];
            Object.keys(data).map(e => {
              latLngsArray.push({ data: data[e]['latLngs'], info: e });
            })
            this.createPolygons(latLngsArray);
          }

          if (res['data'].regularPathDetails && res['data'].regularPathDetails.length) {
            this.drawRegularRoute(res['data'].regularPathDetails[0].latLng);
          }

          if (!isDragged) {
            this.common.searchId = res['data'].searchId;
          }

          if (res['data']['routes']) {
            localStorage.setItem('COSTROUTES', JSON.stringify(res['data']['routes']));
            this.handleCostRoutes(res['data']['routes']);
          }
          return;
        }
        this.common.showToast(res['msg']);
      }, err => {
        this.common.loading--;
        console.error('Error', err);
      });
  }


  removeDummyRoutes() {
    this.routes = this.routes.filter(route => {
      if (route.origin.lat && route.destination.lat) return true;
      else return false;
    });
  }

  getProfitRoutesFromAPI(isDragged = false) {
    this.removeDummyRoutes();
    let loader = this.common.loading++;

    let routes = [];
    this.routes.map(route => {
      routes.push({
        "origin": {
          "name": route.origin.name,
          "lat": route.origin.lat,
          "lng": route.origin.lng
        },
        "destination": {
          "name": route.destination.name,
          "lat": route.destination.lat,
          "lng": route.destination.lng
        },
        rate: route.rate,
        tonnage: route.tonnage,
        brokerage: route.brokerage,
        loading: route.loading,
        unloading: route.unloading
      });
    });

    console.log(routes);
    const params = {
      routes: routes,
      searchId: this.common.searchId || -1,
      connect: this.connect
    };

    console.log(params);

    // loader.present();

    this.api.post('infoprofit', params)
      .subscribe(res => {
        console.log('Res:', res);
        let data = res['special_areas'];
        // loader.dismiss();


        if (!this.common.handleApiResponce(res)) {
          this.common.showToast(res['msg']);
          localStorage.clear();
          // this.navCtrl.setRoot('LoginPage');
          return;
        }

        if (res['success']) {
          if (!isDragged) {
            this.common.searchId = res['data'].searchId;
            localStorage.setItem('SEARCH_ID', res['data'].searchId);
          }
          localStorage.setItem('COSTROUTES', JSON.stringify(res['data']['routes']));
          console.log('Test: ', JSON.parse(localStorage.getItem('COSTROUTES')));

          this.handleCostRoutes(res['data']['routes']);

          this.initializeSelectedSuggestion();
          return;
        }
        this.common.showToast(res['msg']);
      }, err => {
        // loader.dismiss();
        console.error('Error', err);
      });

    // this.common.searchId = parseInt(localStorage.getItem('SEARCH_ID'));
    // console.log('Test: ',JSON.parse(localStorage.getItem('COSTROUTES')));
    // this.handleCostRoutes(JSON.parse(localStorage.getItem('COSTROUTES')));
    // setTimeout(this.handleCostRoutes.bind(this, JSON.parse(localStorage.getItem('COSTROUTES'))), 3000);


  }

  handleCostRoutes(costRoutes, type = 'search') {
    console.log(costRoutes);
    this.data.costRoutes = costRoutes;
    this.costRoutes = costRoutes;
    if (type == 'search') {
      this.costRoutesCopy = Object.assign({}, this.costRoutes);
      this.loadedRoutes = [];

      costRoutes.map((route, i) => {
        if (route.isLoaded) {
          this.loadedRoutes.push({
            index: i,
            route: route
          });
          console.log('-------------------------Loaded--------------: ', this.loadedRoutes);
        }
      });
    }

    this.calulateTotalCost();


    if (this.routeType == 'profit') {
      console.log('Calculate Profit');
      this.calculateProfit();
    }
    let routLineIndex = 0;
    let linkLineIndex = 0;
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var labelIndex = 0;

    this.costRoutes.map((costRoute, i) => {
      if (costRoute.latLng.length) {
        if (costRoute.isLoaded) {
          this.routes[routLineIndex].origin.lat = costRoute.latLng[0].lat;
          this.routes[routLineIndex].origin.lng = costRoute.latLng[0].lng;
          console.log(this.routes[routLineIndex].origin.lat, this.routes[routLineIndex].origin.lng, routLineIndex);
          this.routes[routLineIndex].destination.lat = costRoute.latLng[costRoute.latLng.length - 1].lat;
          this.routes[routLineIndex].destination.lng = costRoute.latLng[costRoute.latLng.length - 1].lng;
          this.setMarker(routLineIndex, 'origin', labels[labelIndex++ % labels.length]);
          this.setMarker(routLineIndex, 'destination', labels[labelIndex++ % labels.length]);
          this.drawRoute2(i, "routeLines", costRoute.isLoaded, routLineIndex);
          console.log('Routes: ', this.routes, costRoute, costRoute.latLng[0].lat, costRoute.latLng[0].lng);
          routLineIndex++;
        }
      }

    });


    this.costRoutes.map((costRoute, i) => {
      if (costRoute.latLng.length) {
        if (!costRoute.isLoaded) {
          this.drawRoute2(i, "linkLines", costRoute.isLoaded, linkLineIndex);
          linkLineIndex++;
        }
      }
    });

    this.getRoutes2();
    // this.drawPolyline();

    this.initializeRunPolyline();


  }
  calulateTotalCost() {
    this.costRoutes.map(costRoute => {
      costRoute.cost.totalCost.value = costRoute.cost.fuel.value + costRoute.cost.border.value + costRoute.cost.toll.value + costRoute.cost.loading.value + costRoute.cost.unloading.value;
      if (costRoute.cost.brokerage) {
        costRoute.cost.totalCost.value += costRoute.cost.brokerage.value;
      }
      console.log('Total Cost:', costRoute.cost.totalCost);
    });
  }

  setMarker(index, markerType, label = '0') {
    let latLng = new google.maps.LatLng(this.routes[index][markerType].lat, this.routes[index][markerType].lng);

    if (this.routes[index][markerType].marker) {
      this.routes[index][markerType].marker.setPosition(latLng);
    } else {
      this.routes[index][markerType].marker = new google.maps.Marker({
        position: { lat: this.routes[index][markerType].lat, lng: this.routes[index][markerType].lng },
        map: this.map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: this.routes[index][markerType].name,
        label: label
      });
      google.maps.event.addListener(this.routes[index][markerType].marker, "dragend", this.markerPositionChangd.bind(this, index, markerType));

      this.createInfoWindow(index, markerType)
      this.routes[index][markerType].marker.addListener('click', this.showInfoWindow.bind(this, index, markerType));// function () { infowindow.open(map, marker); });

    }

    if (!localStorage.getItem("MARKER_MOVED")) this.bounceMarker();

  }

  createInfoWindow(index, markerType) {
    var contentString = `
      <h4 style="margin:0px; font-size: 14px;">${this.routes[index][markerType].name}</h4>
      `;

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    this.routes[index][markerType].infowindow = infowindow;
  }

  showInfoWindow(index, markerType) {
    console.log(markerType, index);
    this.routes[index][markerType].infowindow.open(this.map, this.routes[index][markerType].marker);
  }

  drawRoute2(costIndex, lineType, isLoaded, routeIndex) {
    console.log("polylines", this[lineType]);
    if (this[lineType][routeIndex]) {
      for (var i = 0; i < this[lineType][routeIndex].length; i++) {
        this[lineType][routeIndex][i].setMap(null);
      }
    }
    this[lineType][routeIndex] = [];

    // this.directionsDisplay.setDirections(response);
    // console.log("response", response);

    let color: string = isLoaded ? "black" : "red";

    let polyline = null;

    if (!isLoaded) {
      polyline = new google.maps.Polyline({
        map: this.map,
        strokeColor: color,
        strokeOpacity: 1,
        strokeWeight: 1.5,
        geodesic: true,
      });

    } else {
      polyline = new google.maps.Polyline({
        map: this.map,
        strokeColor: color,
        strokeOpacity: 1,
        strokeWeight: 2.5,
        geodesic: true
      });
    }



    // var bounds = new google.maps.LatLngBounds();
    // let length = this.costRoutes[index].latLng.length;
    // bounds.extend(new google.maps.LatLng(this.costRoutes[index].latLng[0].lat, this.costRoutes[index].latLng[0].lng));
    // bounds.extend(new google.maps.LatLng(this.costRoutes[index].latLng[length - 1].lat, this.costRoutes[index].latLng[length - 1].lng));


    this[lineType][routeIndex].push(polyline);
    console.log('CostIndex:', costIndex);
    console.log('Cost:', this.costRoutes[costIndex]);
    if (typeof (this.costRoutes[costIndex]).latLng == typeof ('')) {
      this.costRoutes[costIndex].latLng = JSON.parse(this.costRoutes[costIndex].latLng);
    }
    console.log('Cost:', this.costRoutes[costIndex]);
    this.costRoutes[costIndex].latLng.map((latLng, i) => {
      polyline.getPath().push(new google.maps.LatLng(latLng.lat, latLng.lng));
    });


    polyline.setMap(this.map);
    console.log(this[lineType]);
    this.map.setCenter({ lat: this.costRoutes[costIndex].latLng[0].lat, lng: this.costRoutes[costIndex].latLng[0].lng });
    // this.map.fitBounds(bounds);
  }

  getRoutes2() {
    this.removeDummyRoutes();
    for (let i = 0; i < this.routes.length; i++) {
      if (this.routes[i].origin.lat && this.routes[i].destination.lat) {
        this.setMarker(i, 'origin');
        this.setMarker(i, 'destination');
      }
    }

  }

  markerPositionChangd(index, markerType) {
    localStorage.setItem('MARKER_MOVED', 'YES');
    this.routes[index][markerType].lat = this.routes[index][markerType].marker.getPosition().lat();
    this.routes[index][markerType].lng = this.routes[index][markerType].marker.getPosition().lng();
    let latlng = { lat: this.routes[index][markerType].lat, lng: this.routes[index][markerType].lng };
    this.geocoder.geocode({ 'location': latlng }, this.getAddress.bind(this, index, markerType));

  }

  bounceMarker() {
    if (localStorage.getItem("MARKER_MOVED")) return;

    if (this.routes[0].origin.marker.getAnimation() !== null) {
      this.routes[0].origin.marker.setAnimation(null);
    } else {
      this.routes[0].origin.marker.setAnimation(google.maps.Animation.BOUNCE);
    }
    setTimeout(this.bounceMarker.bind(this), 500);

  }



  goBack() {
    this.isRunPolyline = false;
    this.common.params = null;
    // this.router.navigate(['/intelligence/calculator']);
    this.location.back();
  }
  showSuggestion() {
    document.getElementById('suggestion').className = "suggestion suggestion-show animated slideInUp";
  }

  hideSuggestion() {
    document.getElementById('suggestion').className = "suggestion suggestion-show animated slideOutDown";
    setTimeout(() => {
      document.getElementById('suggestion').className = "suggestion animated slideOutDown";
    }, 500);
  }



  calculateProfit() {
    this.total = {
      profit: 0,
      cost: 0,
      revenue: 0
    };
    this.costRoutes.map(costRoute => {
      this.total.profit += costRoute.cost.profit.value;
      this.total.cost += costRoute.cost.totalCost.value;
      this.total.revenue += costRoute.cost.revenue.value;
    });
    console.log('Total:', this.total);
  }

  handleZoom(action) {
    let zoom = this.map.getZoom();
    this.map.setZoom(action ? zoom + 1 : zoom - 1);
  }

  getAddress(index, markerType, results, status) {
    console.log(results);
    console.log(status);
    if (results[0]) {
      console.log(results[0].formatted_address);
      this.routes[index][markerType].name = results[0].formatted_address;
    }
    this.isRunPolyline = false;

    if (this.routeType == 'cost') {
      this.getCostRoutesFromAPI(true);
    } else if (this.routeType == 'profit') {
      this.getProfitRoutesFromAPI(true);
    }
  }

  initializeSelectedSuggestion() {
    this.selected.suggestion = [];
    for (let i = 0; i < this.loadedRoutes.length; i++) {
      this.selected.suggestion[i] = -1;
    }
  }

  initializeRunPolyline() {

    let allLatLngs = [];
    this.costRoutes.map(costRoute => {
      costRoute.latLng.map(latLng => allLatLngs.push(latLng));
    });
    // let startLatLng = new google.maps.LatLng(allLatLngs[0].lat, allLatLngs[0].lng);
    // let endLatLng = new google.maps.LatLng(allLatLngs[allLatLngs.length - 1].lat, allLatLngs[allLatLngs.length - 1].lng);

    this.setBounds();

    this.isRunPolyline = true;
    this.setRunPolyline(allLatLngs, '1');
    // setTimeout(this.setRunPolyline.bind(this, allLatLngs, '2'), 500);
    // setTimeout(this.setRunPolyline.bind(this, allLatLngs, '3'), 700);

  }

  setRunPolyline(allLatLngs, polyline = '1') {
    // console.log(this.runningPolyline1);
    if (this['runningPolyline' + polyline]) {
      this['runningPolyline' + polyline].setMap(null);
    }


    this['runningPolyline' + polyline] = new google.maps.Polyline({
      map: this.map,
      strokeColor: '#f2f2f2',
      strokeOpacity: 1,
      strokeWeight: 2.5,
      geodesic: true,
    });
    this.runPolyline(allLatLngs, 0, polyline);
  }

  runPolyline(allLatLngs, index, polyline) {
    let count = 10;
    for (let i = 0; i <= count; i++) {
      if (index + i < allLatLngs.length - 1) {
        let latLng = new google.maps.LatLng(allLatLngs[index + i].lat, allLatLngs[index + i].lng);
        this['runningPolyline' + polyline].getPath().push(latLng);
      }
      if (this['runningPolyline' + polyline].getPath().length > 100) {
        this['runningPolyline' + polyline].getPath().removeAt(i);
      }
    }
    // console.log(this.runningPolyline.getPath().length);
    // this.runningPolyline.getPath().removeAt(i)
    if (index + count < allLatLngs.length - 1 && this.isRunPolyline) {
      // console.log(index);
      setTimeout(this.runPolyline.bind(this, allLatLngs, index + count, polyline), 1);
      return;
    }
    this['runningPolyline' + polyline].setMap(this.map);

    if (this.isRunPolyline) {
      setTimeout(this.setRunPolyline.bind(this, allLatLngs, polyline), 1);
    }
    // this.setRunPolyline(allLatLngs);

    // console.log('Running End');
  }

  setBounds() {
    this.bounds = new google.maps.LatLngBounds();
    // this.costRoutes.map(costRoute => {
    //   this.bounds.extend(new google.maps.LatLng(costRoute.latLng[0].lat, costRoute.latLng[0].lng));
    //   this.map.fitBounds(this.bounds);
    //   this.bounds.extend(new google.maps.LatLng(costRoute.latLng[costRoute.latLng.length - 1].lat, costRoute.latLng[costRoute.latLng.length - 1].lng));
    //   this.map.fitBounds(this.bounds);
    // });






  }

  viewDetails() {
    this.isRunPolyline = false;
    if (this.routeType == 'cost') {
      this.router.navigate(['/intelligence/cost-viewer']);
    } else if (this.routeType == 'profit') {
      this.router.navigate(['/intelligence/profit-viewer']);
    } else if (this.routeType == 'findAsa') {
      this.router.navigate(['/intelligence/cost-viewer']);
    }
  }


  createPolygons(latLngsMulti, options?) {// strokeColor = '#', fillColor = '#') {
    console.log(latLngsMulti);
    let index = 0;

    latLngsMulti.forEach(latLngs => {
      let colorBorder;
      let colorFill;
      let isMain = false;
      if (latLngs.isSec) {
        colorBorder = '#00f';
        colorFill = '#88f';
      } else if (latLngs.isMain) {
        colorBorder = '#0f0';
        colorFill = '#8f8';
      } else {
        colorBorder = '#f00';
        colorFill = '#f88';
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
      let showContent = latLngs.info;
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
  }

  drawRegularRoute(latLngs) {
    console.log('latLngs:', latLngs);
    let polyline = new google.maps.Polyline({
      path: [],
      geodesic: true,
      strokeColor: '#800080',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    polyline.setMap(this.map);
    let path = polyline.getPath();
    console.log(path);
    for (let i = 0; i < latLngs.length; i++) {
      let latLng = new google.maps.LatLng(latLngs[i].lat, latLngs[i].lng)
      path.push(latLng);
      this.fitBounds(latLng);
    }
  }

  fitBounds(latLng) {
    if (!this.bounds) this.bounds = new google.maps.LatLngBounds();
    this.bounds.extend(latLng);
    this.map.fitBounds(this.bounds);
  }
}
