import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { MapService } from '../../services/map.service';

declare let google: any;
declare let MarkerClusterer: any;
let map: any;

@Component({
  selector: 'probable-routes',
  templateUrl: './probable-routes.component.html',
  styleUrls: ['./probable-routes.component.scss']
})

export class ProbableRoutesComponent implements OnInit {

  routeListForm = new FormControl();
  aerial: number = 1.4;
  frechet: number = 10000;
  mismatchIndex = 0;
  origin: any;
  startname: any;
  destination: any;
  result: any;
  visibleRoutes: boolean[] = [];
  startLat: any;
  startLong: any;
  startPointName: any = "";
  endLat: any;
  endLong: any;
  endPointName: any = "";
  radius: any;
  routeList;
  map1: any;
  loading: boolean = false;
  getButtonVisible = true;
  flightPath: any;
  totalRoutes = 0;
  routeStrength = '';
  routes:any = [];
  routesTomodify = [];
  tollData:any = [];
  checkData = [];
  showTollFlag: boolean = false;
  toggleClass: boolean = false;
  // distance;
  colourful = ["#D8BFD8"];//this is responsible for providing different colour to the path


  constructor(private http: HttpClient,
    private fb: FormBuilder,
    private common: CommonService,
    private api: ApiService,
    public map: MapService) {}

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.map.mapIntialize('map', 11)
    this.radiusBoundary();
  }

  createSelect(){
   this.toggleClass = true;
  }

  selectLocation(event, type) {
    console.log('on seletion event is: ', event)
    if (type == 'origin') {
      this.startLat = event['lat'];
      this.startLong = event['long'];
      this.origin = event['location'];
    } else if (type == 'destination') {
      this.endLat = event['lat'];
      this.endLong = event['long'];
      this.destination = event['location'];
    }
  }

  takeAction(event, type) {
    console.log('take event is: ', event)
    if (type == 'origin') {
      this.startLat = "";
      this.startLong = "";
      this.origin = event['search']
    } else if (type == 'destination') {
      this.endLat = "";
      this.endLong = "";
      this.destination = event['search']
    }
  }

  misMatchChanges(event) {
    console.log('event mismatch is: ', event)
    this.mismatchIndex = event.target.value
  }


  getRandomColor() { // This function helps to get the random colour on string array colourful
    let letters: string = '0123456789ABCDEF';
    let color: string = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  clearData() {
    console.log("hello");
    window.location.reload();
  }

  getData() {
    let params = {
      aerial: this.aerial,
      endLatitude: this.endLat,
      endLongitude: this.endLong,
      endPointName: this.destination,
      frechet: this.frechet,
      mismatchIndex: this.mismatchIndex / 100,
      startLatitude: this.startLat,
      startLongitude: this.startLong,
      startPointName: this.origin
    }

    let headers = {
      "Accept": "application/json"
    }

    console.log('params is: ', params)
    this.common.loading++;

    this.http.post<any>('http://198.20.124.18:8081/api/v0/load/intelligence/snappedData', params, { headers }).subscribe(data => {
      this.common.loading--;
      this.getButtonVisible = false
      // document.getElementById('get-btn').innerHTML = 'Clear All'
      console.log('data is: ', data)
      this.result = data;
      this.radius = this.result[0].radius;

      this.radiusBoundary();
      this.totalRoutes = this.result.length;
      console.log('total routes: ', this.totalRoutes);
    }, err => {
      this.common.loading--;
      console.log('err is: ', err);
    });
  }

  radiusBoundary() {
    console.log("Radius Boundary is called");
    var spherical = google.maps.geometry.spherical;
    var startPoint = new google.maps.LatLng(this.startLat, this.startLong);
    var endPoint = new google.maps.LatLng(this.endLat, this.endLong);
    this.map.createCirclesOnPostion(startPoint, this.radius, '#0000FF', '#FFFFFF');
    this.map.createCirclesOnPostion(endPoint, this.radius, '#FF0000', '#FFFFFF');
    this.map.zoomAt(endPoint, 8);
  }

  polylines = {};
  getRoutes(event, data, index){
    console.log('event is: ', event, data, index,this.polylines)

    let dataList = [];
    if(this.checkData.length > 0 && this.checkData.includes(index)){
      this.checkData.splice(this.checkData.indexOf(index), 1)
    } else{
      this.checkData.push(index)
    }

    this.checkData.map(ele => {
      this.result.forEach((ele1,index) => {
        if((index) == ele){
          dataList.push({data: ele1.latLongResponseList});
        }});
    } )
    console.log('checkData is: ', this.checkData,dataList)
    this.map.resetPolyLines();
    this.map.createPolyLines(dataList);
  }

  showTolls(data){
    this.showTollFlag = true;
    console.log('data is: ', data)
    this.tollData = data['tolls']

    console.log('this.tollData: ', this.tollData)
    this.map.clearAll();
    this.map.createMarkers(this.tollData)
    
  }
}

