import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { async } from 'rxjs/internal/scheduler/async';
import { count } from 'rxjs/operators';
declare var google: any;
@Component({
  selector: 'map-mapping',
  templateUrl: './map-mapping.component.html',
  styleUrls: ['./map-mapping.component.scss']
})
export class MapMappingComponent implements OnInit {
  regno = null;
  res = [];
  slider = null;

  data = [{
    vehicle: '',
    startDate: null,
    endDate: null,
    pause: null,
    frequency: null,
    stoppage: null,
    time: null,
    over: null,
    location: null,
    site: null,
    ignitio: null,
    min: null,
    hour: null,
    reach: null,
    battery: null,
    grade: null,
    kmph: null,
    showsites: null,
    show: null,
  }];

  lat = [27.225184, 27.226962, 27.228922, 27.235629, 27.24758, 27.253256, 27.259900, 27.263256, 27.295047, 27.298893, 27.302976, 27.305916, 27.309180, 45.252453];
  lng = [75.940427, 75.944524, 75.948009, 75.948009, 75.948800, 75.95010, 75.950969, 75.950924, 75.951120, 75.951138, 75.959822, 75.957378, 57.245784];

  constructor(
    private mapService: MapService) {
    lat: ' ';
    lng: ' ';
    location: Object;

    // this.mapService.createPolygons([[22.928420,70.106169,"","23 Mar 2019 00:34"],[22.929589,70.105880,"","23 Mar 2019 00:35"],[22.930629,70.105836,"","23 Mar 2019 00:36"],[22.931840,70.105698,"","23 Mar 2019 00:37"],[22.931462,70.103600,"","23 Mar 2019 00:41"],[22.930031,70.103684,"","23 Mar 2019 00:42"],[22.928400,70.103698,"","23 Mar 2019 00:43"],[22.926200,70.103858,"","23 Mar 2019 00:44"],[22.924544,70.103827,"","23 Mar 2019 00:45"],[22.922660,70.104142,"","23 Mar 2019 00:46"],[22.921936,70.104240,"","23 Mar 2019 00:47"],[22.921969,70.103036,"","23 Mar 2019 00:48"],[22.923476,70.102844,"","23 Mar 2019 00:49"],[22.926213,70.102693,"","23 Mar 2019 00:50"],[22.929273,70.102547,"","23 Mar 2019 00:52"],[22.930322,70.102022,"","23 Mar 2019 00:53"],[22.929596,70.101898,"","23 Mar 2019 00:55"],[22.930440,70.102396,"","23 Mar 2019 01:18"],[22.932900,70.102320,"","23 Mar 2019 01:38"],[22.934887,70.101938,"","23 Mar 2019 01:39"],[22.938084,70.098564,"","23 Mar 2019 01:40"],[22.940851,70.096733,"","23 Mar 2019 01:40"],[22.943087,70.097427,"","23 Mar 2019 01:41"],[22.947980,70.098427,"","23 Mar 2019 01:42"],[22.951558,70.097747,"","23 Mar 2019 01:43"],[22.956787,70.096938,"","23 Mar 2019 01:44"],[22.963940,70.095933,"","23 Mar 2019 01:45"],[22.969760,70.094338,"","23 Mar 2019 01:46"],[22.972327,70.093102,"","23 Mar 2019 01:47"],[22.972693,70.093253,"","23 Mar 2019 01:47"],[22.972667,70.094889,"","23 Mar 2019 01:48"],[22.972464,70.098658,"","23 Mar 2019 01:49"],[22.975789,70.104613,"","23 Mar 2019 01:50"],[22.979707,70.111138,"","23 Mar 2019 01:51"],[22.984553,70.116013,"","23 Mar 2019 01:52"],[22.988984,70.118418,"","23 Mar 2019 01:53"],[22.994456,70.120644,"","23 Mar 2019 01:54"],[23.000060,70.124449,"","23 Mar 2019 01:55"],[23.005353,70.130507,"","23 Mar 2019 01:56"],[23.010689,70.136404,"","23 Mar 2019 01:57"],[23.015258,70.138178,"","23 Mar 2019 01:57"],[23.021949,70.139396,"","23 Mar 2019 01:58"],[23.022769,70.140733,"","23 Mar 2019 01:59"],[23.024802,70.145729,"","23 Mar 2019 02:00"],[23.030287,70.149773,"","23 Mar 2019 02:01"],[23.034633,70.150924,"","23 Mar 2019 02:02"],[23.035627,70.145898,"","23 Mar 2019 02:03"],[23.037133,70.139373,"","23 Mar 2019 02:04"],[23.038393,70.138796,"","23 Mar 2019 02:04"],[23.045371,70.141778,"","23 Mar 2019 02:05"],[23.053593,70.143929,"","23 Mar 2019 02:06"],[23.061809,70.144662,"","23 Mar 2019 02:07"],[23.066882,70.144844,"","23 Mar 2019 02:08"],[23.073049,70.145102,"","23 Mar 2019 02:09"],[23.079060,70.145324,"","23 Mar 2019 02:10"],[23.082876,70.145418,"","23 Mar 2019 02:11"],[23.088556,70.146364,"","23 Mar 2019 02:12"],[23.093816,70.145951,"","23 Mar 2019 02:13"],[23.099529,70.149551,"","23 Mar 2019 02:14"],[23.105869,70.151382,"","23 Mar 2019 02:15"],[23.107551,70.153956,"","23 Mar 2019 02:16"],[23.111502,70.159338,"","23 Mar 2019 02:17"],[23.116573,70.164618,"","23 Mar 2019 02:18"],[23.121711,70.169916,"","23 Mar 2019 02:19"],[23.127787,70.176222,"","23 Mar 2019 02:20"],[23.132918,70.182471,"","23 Mar 2019 02:21"],[23.137927,70.184511,"","23 Mar 2019 02:22"],[23.140569,70.185320,"","23 Mar 2019 02:22"],[23.141849,70.186204,"","23 Mar 2019 02:23"]],"")
    this.slidecontainer();

  }




  ngOnInit() {


  }



  async ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.zoomMap(10);
    this.mapService.createMarkers([{ lat: 27.225184, lng: 75.940427, type: "site" }]);
    for (let index = 0; index < this.lat.length; index++) {
      await this.sleep(this.slider);
      // let lat = 22.00;
      // let lng = 75.00;
      // let increment = 0.01;
      let latLng = { lat: this.lat[index], lng: this.lng[index] };
      // this.mapService.createPolyPathManual(latLng);
      this.mapService.zoomAt(latLng, 10);
    }
    // setTimeout(this.handleLoop.bind(this, 0), 2000);

  }
  slidecontainer() {
    console.log("Slider:", this.slider);
  }

  // handleLoop(index) {
  //   let res = [];
  //   let res1 = [];
  //   //let increment = 0.0002 ;
  //   for (let i = 0; i < lat.length; i++) {
  //     for (let j = 0; j <= i; j++) {
  //       if (i == j) {
  //         res[i] = lat[i];
  //         res1[j] = lng[j]
  //         let latLng = { lat: res[i], lng: res1[j] };
  //         this.mapService.createPolyPathManual(latLng);
  //         this.mapService.zoomAt(latLng, 13);
  //         console.log(lat[i],lat[j])
  //       }
  //     }
  //   }

  //   }

  //   let latLng = { lat: lat[] + (increment * index + 0.004), lng: lng + (increment * index - 0.004) };
  //   this.mapService.createPolyPathManual(latLng);
  //   this.mapService.zoomAt(latLng, 15);
  //   if (index < 1000) setTimeout(this.handleLoop.bind(this, (index) + 1), 100);
  // }
  sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  getvehicleData(vehicle) {
    this.data[0].vehicle = vehicle.regno;
    console.log("Data :", this.data[0].vehicle);
  }
  submitData() {

    // this.(this.data);
    console.log("", this.data);
  }

}
