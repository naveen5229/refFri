import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'find-route',
  templateUrl: './find-route.component.html',
  styleUrls: ['./find-route.component.scss']
})
export class FindRouteComponent implements OnInit {

  data = {routes: {
    cost: [],
    profit: [],
    findAsa:[]
  }
  }

  selected = {
    calculator: "findAsa",
    tonnage: 0,
    brokerage: 0,
    loading: 0,
    unloading: 0,
    loop: {
      profit: false,
      cost: false,
      findAsa: false
    }
  }

  routes = {
    cost: [
      {
        origin: {
          name: "",
          lat: "",
          lng: "",
          marker: null,
        },
        destination: {
          name: "",
          lat: "",
          lng: "",
          marker: null
        },
        status: false
      },
    ],
    findAsa: [
      {
        origin: {
          name: "",
          lat: "",
          lng: "",
          marker: null,
        },
        destination: {
          name: "",
          lat: "",
          lng: "",
          marker: null
        },
        status: false,
        isAvoidSpecialAreas: true

      },
    ],
    profit: [
      {
        origin: {
          name: "",
          lat: "",
          lng: "",
          marker: null,
        },
        destination: {
          name: "",
          lat: "",
          lng: "",
          marker: null
        },
        status: false,
        rate: null,
        tonnage: null,
        brokerage: null,
        loading: null,
        unloading: null,
        loadingRates: [20, 30, 40, 50],
        unloadingRates: [20, 30, 40, 50],
        brokrageRates: [1300, 1200, 1000, 800],
      }
    ]
  };
  place: any;
  edit = {
    route: null,
    index: -1
  };

  editCost = {
    route: null,
    index: -1
  }

  editFindCost = {
    route: null,
    index: -1
  }

  originData = [];
  loadingRates = [20, 30, 40, 50];
  unloadingRates = [20, 30, 40, 50];
  tonnageRates: [28, 29, 30, 31]
  constructor(
    private zone: NgZone,
    public modalCtrl: NgbModal,
    public api: ApiService,
    public router: Router,
    public common: CommonService,
   ) {
    // this.getLoadingUnloading('tonnage', '', '', '', '');
    // setTimeout(this.autoSuggestion.bind(this, 'profit', 'profit_origin_0', 0, 'origin'), 3000);
    // setTimeout(this.autoSuggestion.bind(this, 'profit', 'profit_destination_0', 0, 'destination'), 3000);
    // setTimeout(this.autoSuggestion.bind(this, 'cost', 'cost_origin_0', 0, 'origin'), 3000);
    // setTimeout(this.autoSuggestion.bind(this, 'cost', 'cost_destination_0', 0, 'destination'), 3000);
    // setTimeout(this.autoSuggestion.bind(this, 'findAsa', 'findAsa_origin_0', 0, 'origin'), 3000);
    // setTimeout(this.autoSuggestion.bind(this, 'findAsa', 'findAsa_destination_0', 0, 'destination'), 3000);
    this.getOrigin();
  }

  ngOnInit() {
  }


  getOrigin() {
    this.common.loading++;
    this.api.get('LoadIntelligence/getOriginDestPoints')
      .subscribe(res => {
        this.common.loading--;
        this.originData = res['data'];
        console.log(res);
      }, err => {
        console.log('Error:', err);
        this.common.loading--;

      });
  }

  mapViewer(routeType) {
    this.common.searchId = null;
    if (routeType === 'findAsa') {
      this.data.routes.findAsa = this.routes.findAsa;
      this.common.params = { routes: this.routes.findAsa, routeType: 'findAsa', connect: false };
      console.log(this.common.params);
      this.router.navigate(['/load-intelligence/path-viewver']);
      return;
    }

    if (routeType == 'profit' && this.edit.route) {
      this.routes.profit[this.edit.index].status = true;
      this.clearData();
    } else if (routeType == 'profit' && !this.checkRouteStatus('profit', this.routes.profit.length - 1)) {
      this.routes.profit[this.routes.profit.length - 1].status = true;
    } else if (routeType == 'profit') {
      this.removeDummyRoutes('profit');
    } else if (routeType == 'cost' && this.editCost.route) {
      this.routes.cost[this.editCost.index].status = true;
      this.editCost = {
        index: -1,
        route: null
      };
    } else if (routeType == 'cost' && !this.checkRouteStatus('cost', this.routes.cost.length - 1)) {
      this.routes.cost[this.routes.cost.length - 1].status = true;
    } else if (routeType == 'cost') {
      this.removeDummyRoutes('cost');
    } else if (routeType == 'findAsa' && this.editCost.route) {
      this.routes.cost[this.editCost.index].status = true;
      this.editCost = {
        index: -1,
        route: null
      };
    } else if (routeType == 'findAsa' && !this.checkRouteStatus('findAsa', this.routes.cost.length - 1)) {
      this.routes.cost[this.routes.cost.length - 1].status = true;
    } else if (routeType == 'findAsa') {
      this.removeDummyRoutes('findAsa');
    }

    this.data.routes[routeType] = this.routes[routeType];
    this.common.params = { routes: this.routes[routeType], routeType: routeType, connect: this.selected.loop[routeType] };
    this.router.navigate(['/load-intelligence/path-viewver']);

    // this.navCtrl.push('PathViewerPage', { routes: this.routes[routeType], routeType: routeType, connect: this.selected.loop[routeType] });
  }



  deleteRoute(routeType, index) {
    this.removeDummyRoutes(routeType);
    if (routeType == 'profit' && this.edit.route) {
      this.routes.profit[this.edit.index].status = true;
      this.clearData();
      return;
    } else if (routeType == 'cost' && this.editCost.route) {
      this.routes.cost[this.editCost.index].status = true;
      this.editCost = {
        index: -1,
        route: null
      };
      return;
    } else if (routeType == 'findAsa' && this.editCost.route) {
      this.routes.cost[this.editCost.index].status = true;
      this.editCost = {
        index: -1,
        route: null
      };
      return;
    }

  }
  editCostRoute(route, index) {
    this.removeDummyRoutes('cost');
    if (this.edit.route) {
      this.routes.cost[this.edit.index].status = true;
    }
    this.editCost = {
      route: Object.assign({}, route),
      index: index
    };
    this.routes.cost[index].status = false;
    setTimeout(this.autoSuggestion.bind(this, 'cost', 'cost_origin_' + index, 0, 'origin'), 500);
    setTimeout(this.autoSuggestion.bind(this, 'cost', 'cost_destination_' + index, 0, 'destination'), 500);
  }

  editfindAvoidSpecialRoute(route, index) {
    this.removeDummyRoutes('findAsa');
    if (this.edit.route) {
      this.routes.cost[this.edit.index].status = true;
    }
    this.editCost = {
      route: Object.assign({}, route),
      index: index
    };
    this.routes.cost[index].status = false;
    setTimeout(this.autoSuggestion.bind(this, 'findAsa', 'findAsa_origin_' + index, 0, 'origin'), 500);
    setTimeout(this.autoSuggestion.bind(this, 'findAsa', 'findAsa_destination_' + index, 0, 'destination'), 500);
  }

  resetData(index) {
    if (this.edit.route) {
      this.routes.profit[this.edit.index] = Object.assign({}, this.edit.route);
      this.edit = {
        route: null,
        index: -1
      };
    } else {
      console.log('Index', index);
      this.deleteRoute('profit', index);
    }
  }



  removeDummyRoutes(routeType) {
    this.routes[routeType] = this.routes[routeType].filter(route => {
      if (route.origin.lat && route.destination.lat) return true;
      else return false;
    });
  }

  editRoute(route, index) {
    this.removeDummyRoutes('profit');
    console.log('Route:', route);
    if (this.edit.route) {
      this.routes.profit[this.edit.index].status = true;
    }
    this.edit = {
      route: Object.assign({}, route),
      index: index
    };
    console.log('Index:', index);
    this.routes.profit[index].status = false;
    setTimeout(this.autoSuggestion.bind(this, 'profit', 'profit_origin_' + index, 0, 'origin'), 500);
    setTimeout(this.autoSuggestion.bind(this, 'profit', 'profit_destination_' + index, 0, 'destination'), 500);
  }

  autoSuggestion(routeType, elementId, index, locationType) {
    var options = {
      types: ['(regions)'],
      componentRestrictions: { country: "in" }
    };
    let ref = document.getElementById(elementId);//.getElementsByTagName('input')[0];
    console.log(ref);
    let autocomplete = new google.maps.places.Autocomplete(ref, options);
    google.maps.event.addListener(autocomplete, 'place_changed', this.getLocation.bind(this, autocomplete, routeType, index, locationType));
  }

  selectedLocation(event) {
    console.log(event);
    console.log(event.target);
    console.log(event.target.value);
    this.place = event;
  }

  getLocation(autocomplete, routeType, index, locationType) {
    // console.log(autocomplete);
    // console.log(index);
    // console.log(locationType);

    let place = this.place;
    console.log(place);

    this.zone.run(() => {
      this.routes[routeType][index][locationType].lat = place.lat;
      this.routes[routeType][index][locationType].lng = place.long;
      this.routes[routeType][index][locationType].name = place.plant_name;
      // console.log(this.routes);
      if (this.routes[routeType][index].origin.lat && this.routes[routeType][index].destination.lat && routeType == 'cost') {
        this.routes[routeType][index].status = true;
      }
      if (this.routes[routeType][index].origin.lat && this.routes[routeType][index].destination.lat && routeType == 'findAsa') {
        this.routes[routeType][index].status = true;
      }
      if (routeType === 'profit') {
        this.getLoadingUnloading(locationType === 'origin' ? 'loading' : 'unloading', place.formatted_address, place.geometry.location.lat(), place.geometry.location.lng(), index);
      }
    });


  }

  getLoadingUnloading(loadType, place, lat, lng, index, rate = 0) {
    const params = {
      type: loadType,
      place: place,
      lat: lat,
      lng: lng,
      rate: rate
    };
    console.log(params);
    this.api.post('inputSuggestion', params)
      .subscribe(res => {
        console.log(res);
        if (!this.common.handleApiResponce(res)) {
          this.common.showToast(res['msg']);
          localStorage.clear();
          // this.navCtrl.setRoot('LoginPage');
          return;
        }

        if (loadType == 'tonnage') {
          this.tonnageRates = res['data'].values;
          return;
        }
        console.log(index);
        console.log(this.routes.profit[index]);
        this.routes.profit[index][loadType + 'Rates'] = res['data'].values;
      }, err => {
        console.log(err);
      });
  }

  addRate(rate, amount, id) {
    document.getElementById(id).className = "profit-input animated shake";
    setTimeout(this.removeEffetc.bind(this, id), 500);

    console.log(rate);
    console.log(amount);
    if (rate == null) {
      return amount;
    } else if (typeof (rate) == typeof ('')) {
      return parseInt(rate) + parseInt(amount)
    }
    console.log(typeof (parseInt(rate) + parseInt(amount)));
    return parseInt(rate) + parseInt(amount);
  }

  clearData() {
    this.edit = {
      route: null,
      index: -1
    };
  }
  removeEffetc(id) {
    document.getElementById(id).className = "profit-input";
  }
  checkAddProfitRoute() {
    if (this.edit.route) {
      this.routes.profit[this.edit.index].status = true;
      this.clearData();
    } else {
      this.routes.profit[this.routes.profit.length - 1].status = true;
    }
    this.addProfitRoute();
  }
  addProfitRoute() {
    this.routes.profit.push({
      origin: {
        name: "",
        lat: "",
        lng: "",
        marker: null
      },
      destination: {
        name: "",
        lat: "",
        lng: "",
        marker: null
      },
      status: false,
      rate: null,
      tonnage: null,
      brokerage: null,
      loading: null,
      unloading: null,
      loadingRates: [20, 30, 40, 50],
      unloadingRates: [20, 30, 40, 50],
      brokrageRates: [1300, 1200, 1000, 800],
    });

    let originId = 'profit_origin_' + (this.routes.profit.length - 1);
    let destinationId = 'profit_destination_' + (this.routes.profit.length - 1);

    setTimeout(this.autoSuggestion.bind(this, 'profit', originId, this.routes.profit.length - 1, 'origin'), 500);
    setTimeout(this.autoSuggestion.bind(this, 'profit', destinationId, this.routes.profit.length - 1, 'destination'), 500);
  }
  isShowLoopOption(route) {
    if (this.routes[route].length < 2) {
      this.selected.loop[route] = false;
      return false;
    } else if (this.routes[route][0].origin.name == this.routes[route][this.routes[route].length - 1].destination.name) {
      this.selected.loop[route] = false;
      return false;
    }
    return true;
  }

  addCostRoute() {
    if (this.editCost.route) {
      this.routes.cost[this.editCost.index].status = true;
      this.editCost.index = -1;
      this.editCost.route = null;
    } else if (this.routes.cost[this.routes.cost.length - 1]) {
      this.routes.cost[this.routes.cost.length - 1].status = true;
    }

    this.routes.cost.push({
      origin: {
        name: "",
        lat: "",
        lng: "",
        marker: null
      },
      destination: {
        name: "",
        lat: "",
        lng: "",
        marker: null
      },
      status: false,
    });

    let originId = 'cost_origin_' + (this.routes.cost.length - 1);
    let destinationId = 'cost_destination_' + (this.routes.cost.length - 1);

    setTimeout(this.autoSuggestion.bind(this, 'cost', originId, this.routes.cost.length - 1, 'origin'), 500);
    setTimeout(this.autoSuggestion.bind(this, 'cost', destinationId, this.routes.cost.length - 1, 'destination'), 500);
  }

  checkRouteStatus(routeType, index) {
    let route = this.routes[routeType][index];
    if (routeType == 'profit' && route.origin.lat && route.destination.lat && route.rate && route.tonnage && route.brokerage && route.loading && route.unloading) {
      return false;
    } else if (routeType == 'cost' && route.origin.lat && route.destination.lat) {
      return false;
    } else if (routeType == 'findAsa' && route.origin.lat && route.destination.lat) {
      return false;
    }

    return true;
  }
  getBrokerage(value, index) {
    // console.log(index);
    // console.log(value);
    if (value.length >= 3) {
      this.getLoadingUnloading('brokrage', '', '', '', index, value);
    }
  }

}
