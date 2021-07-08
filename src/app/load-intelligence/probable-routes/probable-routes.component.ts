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
      document.getElementById('get-btn').innerHTML = 'Clear All'
      console.log('data is: ', data)
      this.result = data;
      this.radius = this.result[0].radius;

      this.radiusBoundary();
      this.totalRoutes = this.result.length;
      console.log('total routes: ', this.totalRoutes);

      // this.dropdownroutes(this.totalRoutes, this.result);
      // console.log(this.result[0].latLongResponseList)
      // console.log("the value of point is ", this.result[0].points);
      // let pointpath = [this.result[0].points];
      // let path2 = [this.result[0].latLongResponseList];
      // this.radiusBoundary();
    }, err => {
      this.common.loading--;
      console.log('err is: ', err);
    });
  }

  mapPath3(path, i) {
  //   console.log("The visible routes is ", this.visibleRoutes)
  //   this.map1 = new google.maps.Map(document.getElementById("map"),
  //     {
  //       zoom: 8,
  //       center: { lat: path2[0][0].latitude, lng: path2[0][0].longitude },
  //       mapTypeId: "terrain",
  //     });
  //   this.radiusBoundary();
  //   for (let i = 0; i < this.visibleRoutes.length; i++) {

      // if (this.visibleRoutes[i] == true) {
        let pointInsideRadiusLatLngOrigin = [this.result[i].initialPoints];
        let pointInsideRadiusLatLngDestination = [this.result[i].finalPoints];
        this.pointInsideRadius(this.map1, pointInsideRadiusLatLngOrigin, "InsideRadius", '#FF0000')
        this.pointInsideRadius(this.map1, pointInsideRadiusLatLngDestination, "InsideRadius", '#FF0000')
        let pathshow = [this.result[i].latLongResponseList]
        pathshow.forEach(flightPlanCoordinate => {
          let path: { lat: any; lng: any; }[] = [];
          let flightPlan = [];
          flightPlan = flightPlanCoordinate;
          flightPlan.map((e: { [x: string]: any; }) => {
            path.push({ 'lat': e['lat'], 'lng': e['lng'] });
          });
          this.flightPath = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: this.colourful[i],
            strokeOpacity: 1.0,
            strokeWeight: 2,
            title: i
          });
          this.flightPath.setMap(this.map1);
        });

      // }
  //   }
  }

  // dropdownroutes(tr: any, result) {
  //   console.log("the value of tr is", tr);
  //   for (let i = 1; i <= tr; i++) {
  //     let s = `Route Number ${i}`
      
  //     this.routeStrength = this.result[i]['routeStrength']
  //     console.log('this.routeStrength : ', this.routeStrength)
  //     this.routeList.push({
  //       name: s,
  //       routeStrength: this.routeStrength
  //     });

  //     this.visibleRoutes.push(false);
  //     this.routesTomodify.push(false);
  //     this.colourful.push(this.getRandomColor())
  //   }
  // }

  // showCircle(){
  //   this.map.createCirclesOnPostion()
  // }

  radiusBoundary() {
    console.log("Radius Boundary is called");
    var spherical = google.maps.geometry.spherical;
    var startPoint = new google.maps.LatLng(this.startLat, this.startLong);
    var endPoint = new google.maps.LatLng(this.endLat, this.endLong);
    this.map.createCirclesOnPostion(startPoint, this.radius, '#0000FF', '#FFFFFF');
    this.map.createCirclesOnPostion(endPoint, this.radius, '#FF0000', '#FFFFFF');
    // this.map.zoomAt(endPoint, 8);
    // this.map.setBounds(endPoint)
  }

  // createMarker(map: any, point: any, title: any) {
  //   const svgMarker = {
  //     path: google.maps.SymbolPath.CIRCLE,
  //     fillColor: "blue",
  //     fillOpacity: 0.6,
  //     strokeWeight: 0,
  //     rotation: 0,
  //     scale: 2,
  //     anchor: new google.maps.Point(1, 1),
  //   };
  //   return new google.maps.Marker({
  //     icon: svgMarker,
  //     map: map,
  //     position: point,
  //     title: title
  //   });
  // }

  pointInsideRadius(map: any, point: any, title: any, fillColour: any) {
    console.log("Inside Marker", point[0][0].latitude, " and ", point[0][1].longitude);
    console.log("Inside Marker", point[0][0].latitude, " and ", point[0][1].longitude);
    console.log(point);

    console.log("Object keys is ", Object.keys(point[0]).length);
    let sizeofobject = Object.keys(point[0]).length;
    console.log("The size of object is", sizeofobject)
    const svgMarker = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: fillColour,
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(1, 1),
    };

    for (var latlng = 0; latlng < sizeofobject; latlng++) {
      new google.maps.Marker({
        icon: svgMarker,
        map: map,
        position: { lat: point[0][latlng].latitude, lng: point[0][latlng].longitude },
        title: title
      });
    }
  }
  
  // getdataRoute(route: any) { 
  //    let tt;
  //   let ss = parseInt(route[route.length - 10]);
  //   let yy=parseInt(route[route.length-11]); 
  //   if(ss>=0&&yy>=0)
  //   {
  //     ss=(yy*10)+ss;
  //   }
  //   else{}
  //   if (this.visibleRoutes[ss - 1] == true) {
  //     this.visibleRoutes[ss - 1] = false;
  //   }
  //   else {
  //     this.visibleRoutes[ss - 1] = true;
  //   }
  //   console.log("The value of s is ", ss);
  //   let pathroute = [this.result[ss - 1].latLongResponseList]
  //   console.log("The value of path route is",pathroute)
  //   this.mapPath3(pathroute)
  // }

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
        if(index == ele){
          dataList.push({data: ele1.latLongResponseList});
        }});
    } )
    console.log('checkData is: ', this.checkData,dataList)

    let i = this.checkData.toString();
    console.log('index is: ', i)
    let pathRoute = this.result[i].latLongResponseList;
    console.log('index & pathRoute : ', pathRoute)

    this.mapPath3(pathRoute,i)

    // if(this.polylines[index]){
    //   if(!data.isSelected){
    //     this.polylines[index].setMap(null);
    //   }else{
    //     this.polylines[index].setMap(this.map.map);
    //   }
    // }else{
    //   let poly = this.map.createPolyline(data.latLongResponseList);
    //   this.polylines[index] = poly;
    //   if(!data.isSelected){
    //     poly.setMap(null);
    //   }
    // }
    
    
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

