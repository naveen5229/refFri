import { Component, NgZone } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { DataService } from '../../services/data.service';
import { LocationSelectionComponent } from '../../modals/location-selection/location-selection.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
declare var google: any;

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'profit-calculator',
  templateUrl: './profit-calculator.component.html',
  styleUrls: ['./profit-calculator.component.scss']
})

export class ProfitCalculatorComponent {

  selected = {
    calculator: "profit",
    tonnage: 0,
    brokerage: 0,
    loading: 0,
    unloading: 0,
    loop: {
      profit: false,
      cost: false
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
      }
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

  edit = {
    route: null,
    index: -1
  };

  editCost = {
    route: null,
    index: -1
  }

  loadingRates = [20, 30, 40, 50];
  unloadingRates = [20, 30, 40, 50];
  tonnageRates: [28, 29, 30, 31]


  constructor(
    private zone: NgZone,
    public api: ApiService,
    public common: CommonService,
    public data: DataService,
    public router: Router,
    private modalService: NgbModal

  ) {
    this.getLoadingUnloading('tonnage', '', '', '', '');

  }
  
  ngOnDestroy() { }

  // ionViewDidLoad() {
  ngAfterViewInit(): void {
    setTimeout(this.autoSuggestion.bind(this, 'cost', 'cost_origin_0', 0, 'origin'), 3000);
    setTimeout(this.autoSuggestion.bind(this, 'cost', 'cost_destination_0', 0, 'destination'), 3000);
    setTimeout(this.autoSuggestion.bind(this, 'profit', 'profit_origin_0', 0, 'origin'), 3000);
    setTimeout(this.autoSuggestion.bind(this, 'profit', 'profit_destination_0', 0, 'destination'), 3000);


  }

  autoSuggestion(routeType, elementId, index, locationType) {
    // console.log('testtt');
    var options = {
      types: ['(cities)'],
      componentRestrictions: { country: "in" }
    };
    let ref = document.getElementById(elementId);//.getElementsByTagName('input')[0];
    let autocomplete = new google.maps.places.Autocomplete(ref, options);
    google.maps.event.addListener(autocomplete, 'place_changed', this.getLocation.bind(this, autocomplete, routeType, index, locationType));
  }

  getLocation(autocomplete, routeType, index, locationType) {
    // console.log(autocomplete);
    // console.log(index);
    // console.log(locationType);

    let place = autocomplete.getPlace();

    this.zone.run(() => {
      this.routes[routeType][index][locationType].lat = place.geometry.location.lat();
      this.routes[routeType][index][locationType].lng = place.geometry.location.lng();
      this.routes[routeType][index][locationType].name = place.formatted_address;
      // console.log(this.routes);
      if (this.routes[routeType][index].origin.lat && this.routes[routeType][index].destination.lat && routeType == 'cost') {
        this.routes[routeType][index].status = true;
      }
      if (routeType === 'profit') {
        this.getLoadingUnloading(locationType === 'origin' ? 'loading' : 'unloading', place.formatted_address, place.geometry.location.lat(), place.geometry.location.lng(), index);
      }
    });


  }

  addCostRoute() {
    console.log('afterAddClick');
    if (this.editCost.route) {

      this.routes.cost[this.editCost.index].status = true;
      this.editCost.index = -1;
      this.editCost.route = null;
    } else if (this.routes.cost[this.routes.cost.length - 1]) {
      // console.log('texttt');
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
    }

    if (this.routes[routeType].length && this.routes[routeType][index]) {
      if (this.routes[routeType][index].origin.marker) {
        this.routes[routeType][index].origin.marker.setMap(null);
        this.routes[routeType][index].destination.marker.setMap(null);
      }
      this.routes[routeType].splice(index, 1);
    }

    if (!this.routes[routeType].length && routeType === 'cost') {
      this.addCostRoute();
    } else if (!this.routes[routeType].length && routeType === 'profit') {
      this.addProfitRoute();
    }
  }

  removeDummyRoutes(routeType) {
    this.routes[routeType] = this.routes[routeType].filter(route => {
      if (route.origin.lat && route.destination.lat) return true;
      else return false;
    });
  }

  mapViewer(routeType) {
    this.common.searchId = null;
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
    }

    this.data.routes[routeType] = this.routes[routeType];
    //this.navCtrl.push('PathViewerPage', { routes: this.routes[routeType], routeType: routeType, connect: //this.selected.loop[routeType] });
  }

  calculateBrokerage(index, percent) {
    let rate = this.routes.profit[index].rate;
    let tonnage = this.routes.profit[index].tonnage;
    let brokerage = rate * tonnage / 100 * percent;
    this.routes.profit[index].brokerage = brokerage;
  }

  brokerageOptions(route) {
    if (route.rate >= 2000) {
      return [1500, 1300, 1200, 1000];
    } else if (route.rate < 1000 && route.rate > 1) {
      return [1000, 800, 500, 300]
    }
    return [1300, 1200, 1000, 800];
  }

  checkRouteStatus(routeType, index) {
    let route = this.routes[routeType][index];
    if (routeType == 'profit' && route.origin.lat && route.destination.lat && route.rate && route.tonnage && route.brokerage && route.loading && route.unloading) {
      return false;
    } else if (routeType == 'cost' && route.origin.lat && route.destination.lat) {
      return false;
    }
    return true;
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

  clearData() {
    this.edit = {
      route: null,
      index: -1
    };
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
          //this.navCtrl.setRoot('LoginPage');
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
        //console.log(err);
      });
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



  logout() {
    const params = {
      type: "logout"
    };
    this.common.loading++;
    this.api.post('login', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.common.showToast(res['msg']);
        localStorage.clear();
        // this.navCtrl.setRoot('LoginPage');

      }, err => {
        console.log(err);
        this.common.loading--;

      });
  }

  isShowLoopOption(route) {
    //  console.log('innerIsshowloop');
    if (this.routes[route].length < 2) {
      this.selected.loop[route] = false;
      return false;
    } else if (this.routes[route][0].origin.name == this.routes[route][this.routes[route].length - 1].destination.name) {
      this.selected.loop[route] = false;
      return false;
    }
    return true;
  }

  showLocation(route, cal) {

    console.log('text==', this.common.params);
    // if (!kpi.x_tlat) {
    //   this.common.showToast('Vehicle location not available!');
    //   return;
    // }
    // const location = {
    //   //lat: kpi.x_tlat,
    //   lat: 29.699222,
    //   lng: 77.869164,
    //   // lng: kpi.x_tlong,
    //   name: '',
    //   time: ''
    // };

    this.common.params = { location, title: 'Vehicle Pickup Point' };
    const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      console.log('Location name: ', data.location.name);


      if (cal == 'costPick') {
        route.origin.name = data.location.name;
        // console.log('costPick inthis');

      }

      if (cal == 'costDrop') {
        route.destination.name = data.location.name;
        // console.log('costDrop inthis');

      }

      if (cal == 'profitPickup') {
        route.origin.name = data.location.name;
        console.log('profitPick inthis');

      }

      if (cal == 'profitDrop') {

        route.destination.name = data.location.name;
        console.log('profitDrop inthis');

      }



      // if(data.response){
      // }
    });
  }


  getBrokerage(value, index) {
    // console.log(index);
    // console.log(value);
    if (value.length >= 3) {
      this.getLoadingUnloading('brokrage', '', '', '', index, value);
    }
  }

  addRate(rate, amount, id) {
    //document.getElementById(id).className = "profit-input animated shake";
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

  removeEffetc(id) {
    //  document.getElementById(id).className = "profit-input";
  }

  goToPage(page) {
    //this.navCtrl.push(page);
    this.router.navigate(['/intelligence/path-viewer']);
  }




}



