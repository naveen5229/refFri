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
  panelId: number = 1;
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
  markerCluster: any;
  count = this.setCount();
  infoWindow: any = null;
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
  console.log('debug');
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
    document.getElementById('nb-global-spinner').style.display = 'none';
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

    setCount() {
      return {
        moving: 0,
        idle: 0,
        unreachable: 0,
        UNR: 0,
        ONW: 0,
        RTN: 0,
        ORP: 0,
        ORG: 0,
        DST: 0,
        UDP: 0,
        CMP: 0,
        delay0: 0,
        delay6: 0,
        delay12: 0,
        delay18: 0,
        delay24: 0,
        idle0: 0,
        idle6: 0,
        idle12: 0,
        idle18: 0,
        idle24: 0
      };
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
          this.setTable(this.data);
        } else {
          this.msg = res.msg;
          this.common.loading--;
        }
      });
  }
  setTable(data) {
    this.table.data = {
      headings: this.generateHeadings(data[0]),
      columns: this.getColumns(data, data[0])
    };
    console.log('table.data',this.table.data.headings);
    this.vehicleStatusCounter();
  }
  vehicleStatusCounter() {
    this.count = this.setCount();

    this.data.forEach(veh => {
      if (veh._datastatus == 'Online') this.count.moving++
      else if (veh._datastatus == 'Idle') this.count.idle++;
      else if (veh._datastatus == 'Offline') this.count.unreachable++

      if (this.panelId == 2) {
        this.count[veh._tripstatuscode]++;
        let delayHrs = parseInt(veh._delay) / 60 / 60;
        console.log('delayHrs:', delayHrs);
        if (delayHrs <= 0) this.count.delay0++;
        else if (delayHrs >= 6 && delayHrs < 12) this.count.delay6++;
        else if (delayHrs >= 12 && delayHrs < 18) this.count.delay12++;
        else if (delayHrs >= 18 && delayHrs < 24) this.count.delay18++;
        else this.count.delay24++;

        let idleHrs = parseInt(veh._idletime) / 60 / 60;
        if (idleHrs >= 6 && idleHrs < 12) this.count.idle6++;
        else if (idleHrs >= 12 && idleHrs < 18) this.count.idle12++;
        else if (idleHrs >= 18 && idleHrs < 24) this.count.idle18++;
        else this.count.idle24++;
      }
    });
    console.log('this.count:', this.count)
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
  filterVehicles(options: any = {}) {
    // Filter By Group
    console.log('selected',this.selected);
    let dumydata =[];
   
    this.data.map((data)=>{
      if(data._datastatus ==this.selected.status){
        dumydata.push(data);
      }
    });
    if(this.selected.status){
    this.setTable(dumydata);
    }else{
    this.setTable(this.data);
    }
   
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
     if (this.selected.markerCluster) this.handleMarkerCluster();
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
  showHideMarkerLabel(isShow: boolean) {
    console.log('markers',this.markers);
    this.markers.map(marker => marker.marker.setLabel(isShow ? {
      text: marker.marker.title,
      color: "#000",
      fontSize: "12px",
      fontWeight: "bold"
    } : ''))
  }

  handleMarkerCluster() {
    if (this.markerCluster) this.markerCluster.clearMarkers();
    if (!this.selected.markerCluster) {
      this.handleMarkerVisibility();
      return;
    }
    let options = {
      gridSize: 60,
      maxZoom: 18,
      zoomOnClick: false,
      imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
    };
    console.log('selected.vehicles',this.selected.vehicles,this.markers);
    let markers = this.markers.filter(marker => {
      if (this.selected.vehicles.indexOf(marker.id) !== -1)
        return true
      return false
    }).map(marker => marker.marker);
    console.log('markers:', markers.length);
    console.log("Markers:", markers);
    this.markerCluster = new MarkerClusterer(this.map, markers, options);
    google.maps.event.addListener(this.markerCluster, 'clusterclick', (cluster) => {
      let content = '<div style="color:#000">' + cluster.getMarkers()
        .map((maker, index) => `${index + 1}. ${maker.title}`)
        .join('&nbsp;&nbsp;') + '</div>';
      console.log('content:', content);
      if (this.map.getZoom() <= this.markerCluster.getMaxZoom()) {
        if (!this.infoWindow)
          this.infoWindow = new google.maps.InfoWindow({ content });

        this.infoWindow.setContent(content);
        this.infoWindow.setPosition(cluster.getCenter());
        this.infoWindow.open(this.map, '');
      }
    });

  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  getColumns(challanList, chHeadings) {
    console.log('viewType',this.viewType);
    let columns = [];
    challanList.map((item) => {
      let column = {};
      for (let key in this.generateHeadings(chHeadings)) {
        if (key === 'checkbox') {
          column[key] = {
            isCheckbox: true,
            action: this.selectOrUnselectVehicle.bind(this, item),
            value: this.selected.vehicles.indexOf(item._vid) !== -1 ? true : false
          }
        }else if (key === 'Vehicle no') {
          console.log('columclas',item['_datastatus']);
          column[key] = { value: item[key], class: item['_datastatus'], action: '' };
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
    console.log('columns',columns);
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
   this.markers.forEach(marker => marker.marker.setMap(this.map));
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
