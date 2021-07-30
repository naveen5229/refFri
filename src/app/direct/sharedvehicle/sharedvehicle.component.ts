import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { DataService } from '../../services/data.service';
import { ApiService } from '../../services/api.service';
import { MapService } from '../../services/map.service';
declare let google: any;
declare let MarkerClusterer: any;

@Component({
  selector: 'sharedvehicle',
  templateUrl: './sharedvehicle.component.html',
  styleUrls: ['./sharedvehicle.component.scss']
})
export class SharedvehicleComponent implements OnInit {
  msg = '';
  queryStringParam = [];
  token: string;
  data = [];
  viewType = 'List & Map';
  panelId: number = 0;
  utype: string = "";
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      tableHeight: "68vh",
      autoWidth: true
    }
  };
  vehicles: [];
  selected = {
    vehicle: null,
    vehicles: [],
    company: 0,
    group: '',
    status: '',
    tripstatus: '',
    delay: 0,
    idle: 0,
    markerCluster: false,
    lastFilterby: ''
  };

  isModal: boolean = false;
  map: any;
  autoRefreshIntervalId: any;
  autoRefreshStopBy: string = '';
  filteredVehicles = [];
  markers = [];
  intervalId: any;
  isShowNearBy = {
    show: false,
    police: false,
    crane: false,
    vehicle: false,
    location: { lat: 0, lng: 0 },
    policesMarkers: [],
    cranesMarkers: [],
    vehiclesMarkers: [],
    selected: '3'
  };

  // <main *ngIf="data.length" [data]="data" [xPanelId]="1"></main>
  constructor(private route: ActivatedRoute,
    private common: CommonService,
    private user: UserService,
    private router: Router,
    private dataService: DataService,
    private api: ApiService,
    public mapService: MapService
  ) { 
  let params = window.location.href.substr(window.location.href.indexOf('?') + 1).split('&');
  params.forEach(param => {
    if (param.startsWith('token=')) {
      this.token = param.split('token=')[1];
    }
  })
  this.showData();
}

  ngOnInit(): void {
  }
  ngAfterViewInit() {


    setTimeout(() => {

  if (!this.isModal) {
    this.mapService.mapIntialize("map", 10);
    setTimeout(() => {
      this.mapService.setMapType(0);
      this.map = this.mapService.map;
      google.maps.event.addListener(this.map, 'mousemove', (point) => {
        document.getElementById('map-lat-lng').innerHTML = point.latLng.lat().toFixed(6) + ', ' + point.latLng.lng().toFixed(6);
      });
    }, 1000);
    this.handleActiveScreen();
  }
}, 1000)
}
handleActiveScreen() {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'hidden' && this.autoRefreshIntervalId) {
      this.autoRefreshStopBy = 'auto';
      clearInterval(this.autoRefreshIntervalId);
      this.autoRefreshIntervalId = '';
    } else if (document.visibilityState === 'visible' && this.autoRefreshStopBy === 'auto') {
    //  this.handleAutoRefresh();
    }
  });
}


  showData() {
    // console.info('Login Params:', this.queryStringParam);
    this.common.loading++;
    this.api.post('vehicles/getSharedDashboard',{token:this.token})
      .subscribe((res: any) => {
        console.log("respose:", res);
        if (res['success']) {
          this.common.loading--;
          // this.data = JSON.parse(res['data']).map(x => {
          //   let vehicle = x.Vehicle;
          //   delete x.Vehicle;
          //   return { vehicle, _lngt: x._long, ...x };
          // });
          this.data = res['data'];
          console.log("Data:", res['data']);
          this.setTable()
        } else {
          this.msg = res.msg;
          this.common.loading--;
        }
      });
  }
  setTable() {
    this.table.data = {
      headings: this.generateHeadings(this.data[0]),
      columns: this.getColumns(this.data, this.data[0])
    };
  }
  generateHeadings(keyObject) {
    let headings = {};
    headings['checkbox'] = {
      isCheckbox: true,
      action: this.selectUnselectAllVehicles.bind(this),
      value: false,
      class: 'ckbox'
    };

    for (var key in keyObject) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        if (key === 'Challan Date') {
          headings[key]['type'] = 'date';
        }
      }
    }
    return headings;
  }

  selectUnselectAllVehicles(status: boolean) {
   // this.stopLiveTracking();
    this.selected.vehicles = [];
    if (this.selected.status && status) {
      this.filteredVehicles.forEach(vehicle => this.selected.vehicles.push(vehicle._vid));
      this.table.data.columns.map(column => column.checkbox.value = true);
    } else if (status) {
      this.data.forEach(vehicle => this.selected.vehicles.push(vehicle._vid));
      this.table.data.columns.map(column => column.checkbox.value = true);
    } else {
      this.table.data.columns.map(column => column.checkbox.value = false);
    }
    this.handleMarkerVisibility();
  }
  handleMarkerVisibility() {
    let bounds = new google.maps.LatLngBounds();
    let count = 0;
    let lastLatLng = null;
    this.markers.forEach(marker => {
      if (this.selected.vehicles.indexOf(marker.id) !== -1) {
        marker.marker.setMap(this.map)
        lastLatLng = marker.marker.getPosition()
        bounds.extend(lastLatLng)
        count++;
      } else marker.marker.setMap(null);
    });
    // if (this.selected.markerCluster) this.handleMarkerCluster();
    setTimeout(() => {
      if (count) {
        this.map.fitBounds(bounds);
        if (count == 1) {
          this.map.setCenter(lastLatLng);
          this.map.setZoom(15);
        }
      }
    }, 200);
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  getColumns(challanList, chHeadings) {
    let columns = [];
    challanList.map(item => {
      let column = {};
      for (let key in this.generateHeadings(chHeadings)) {
        if (key === 'checkbox') {
          column[key] = {
            isCheckbox: true,
            action: this.selectOrUnselectVehicle.bind(this, item),
            value: this.selected.vehicles.indexOf(item._vid) !== -1 ? true : false
          }
        }else if (key == "Action") {
          column[key] = {
            value: "", action: null, icons: [
              // { class: item._ch_doc_id ? 'far fa-file-alt' : 'far fa-file-alt text-color', action: this.paymentDocImage.bind(this, item._ch_doc_id) },
              // { class: item._payment_doc_id ? 'far fa-file-pdf' : 'far far fa-file-pdf text-color', action: this.paymentDocImage.bind(this, item['_payment_doc_id1'] ? item['_payment_doc_id1'] : item['_payment_doc_id']) },
              // { class: item['Payment Type'] == 'Pending' && item._ch_doc_id && item._req_status == 0 && (!(item._payment_doc_id)) && (!(item.State.includes('PB') || item.State.includes('BR') || item.State.includes('UK'))) ? 'far fa-money-bill-alt' : '', action: this.challanPendingRequest.bind(this, item) },
              { class: this.classList(item), action: '' }

            ]
          };
        } else if (key == "Challan Date") {
          column[key] = { value: item[key], class: 'black', action: '' };
        } else {
          column[key] = { value: item[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    return columns;
  }
  selectOrUnselectVehicle(vehicle) {
    this.stopLiveTracking();
    this.mapService.clearAll();
   let veh = [];
    this.viewType = 'List & Map';
    document.getElementById('angle').style.transform = `rotate(${vehicle._ang}deg)`;

    if (this.selected.vehicles.indexOf(vehicle._vid) !== -1) {
      this.selected.vehicles.splice(this.selected.vehicles.indexOf(vehicle._vid), 1);
    } else {
      this.selected.vehicles.push(vehicle._vid);
    }

    if (this.selected.vehicles.length === this.data.length) {
      this.table.data.headings['checkbox'].value = true
    } else {
      this.table.data.headings['checkbox'].value = false
    }
    this.data.map((vdata)=>{
     let flag =  this.selected.vehicles.map((x) => { 
       if(x ==  vdata._vid){
        veh.push(vdata);
       }
      });
   
    });
   console.log('select or unselect',veh,this.selected.vehicles);
   this.mapService.createMarkers(veh);

    this.handleMarkerVisibility();
  }
  stopLiveTracking(isReset?) {
    clearInterval(this.intervalId);
    this.clearNearByMarkers();
    //if (this.marker) this.marker.setMap(null);
    //if (this.polyline) this.polyline.setMap(null);
   // this.liveMapData = [];
   // this.splitLocations = [];
   // this.isLiveTrakingOn = false;
   //this.markers.forEach(marker => marker.marker.setMap(this.map));
   this.markers.forEach(marker => marker.marker.setMap(null));
    this.map.setZoom(5);
  //  setTimeout(this.setBounds.bind(this), 100);
    this.selected.vehicle = null;
  }
  clearNearByMarkers(): void {
    if (this.isShowNearBy.policesMarkers.length) {
      this.isShowNearBy.policesMarkers.map(marker => marker.setMap(null));
      this.isShowNearBy.policesMarkers = [];
    }
    if (this.isShowNearBy.cranesMarkers.length) {
      this.isShowNearBy.cranesMarkers.map(marker => marker.setMap(null))
      this.isShowNearBy.cranesMarkers = [];
    }

    if (this.isShowNearBy.vehiclesMarkers.length) {
      this.isShowNearBy.vehiclesMarkers.map(marker => marker.setMap(null));
      this.isShowNearBy.vehiclesMarkers = [];
    }
  }


  classList(item) {
    if (item['Payment Type'] == 'Pending' && (item.State.includes('PB') || item.State.includes('BR') || item.State.includes('UK'))) {
      return 'fas fa-times-circle'
    } else {
      if (item['_req_status'] == 1 && item['_payment_doc_id'] == null) {
        return 'fas fa-hourglass-end'
      } else if (item['_req_status'] == 3 && item['_payment_doc_id']) {
        return 'fas fa-check'
      } else if (item['_req_status'] == -1 && item['_payment_doc_id'] == null) {
        return 'fas fa-times'
      }
    }
  }
}
