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
  totalRoutes = 0;
  visibleRoutes: boolean[] = [];
  startLat: any;
  startLong: any;
  startPointName: any = "";
  endLat: any;
  endLong: any;
  endPointName: any = "";
  // frechetDistance: any;
  // aerialDistance: any;
  radius: any;
  routeList: string[] = [];
  map1: any;
  loading: boolean = false;
  getButtonVisible = true;
  flightPath: any;
  paths: any;
  zeroRoutes = false;
  colourful = ["#D8BFD8"];//this is responsible for providing different colour to the path


  constructor(private http: HttpClient,
    private fb: FormBuilder,
    private common: CommonService,
    private api: ApiService,
    private map: MapService) {

  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.map.mapIntialize('map')
    this.radiusBoundary();
  }


  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value * 100;
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
  // Google map auto complete predefined function
  // onAutocompleteSelectedOrigin(result:any) {
  //   console.log('onAutocompleteSelected: ',result.formatted_address);
  //   console.log('The result is ',result);
  //   let rr:boolean=false;

  //   let countryname=result.address_components[result.address_components.length-2].long_name;
  //   // for(let i=0;i<result.address_components.length;i++)
  //   // {
  //   //   if(result.address_components[i].long_name=="India")
  //   //   {
  //   //     rr=true;
  //   //   }
  //   // }
  //   // if(rr!=true)
  //   // {
  //   //   window.alert("Please choose Location from India Only")
  //   // }
  // console.log("The country Name is",countryname);
  //   this.startPointName=result.formatted_address;
  // }
  onAutocompleteSelectedDestination(result: any) {
    console.log('onAutocompleteSelected: ', result.formatted_address);
    this.endPointName = result.formatted_address;
  }
  // Above function is used to get the address name of selected location



  mismatchvalue(mismatchslider: any) {
    this.mismatchIndex = mismatchslider;
    console.log(mismatchslider);
  }

  getOriginName = (checker: any) => {
    console.log(checker)
  }

  onLocationSelectedDestination(location: any) {
    console.log('onLocationSelectedDestination: ', location);
    this.endLat = location.latitude; //Ending Latitude
    this.endLong = location.longitude;//Ending Longitude

  }
  clearData() {
    console.log("hello");
    window.location.reload();
  }

  routeChange(event) {
    console.log('event is: ', event)
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
      console.log("The radius is ", this.result[0].radius);
      console.log("The result is ", this.result)

      this.radius = this.result[0].radius;
      if (this.radius == 0) {
        this.loading = false;
        return window.alert("No route found");
      }

      this.radiusBoundary();
      console.log("The path is ", this.paths)
      console.log("the length is ", Object.keys(this.result).length)
      this.totalRoutes = Object.keys(this.result).length
      if (this.totalRoutes == 0) {
        this.zeroRoutes = true;
      }
      this.dropdownroutes(this.totalRoutes);
      console.log(this.result[0].latLongResponseList)
      console.log("the value of point is ", this.result[0].points);
      let pointpath = [this.result[0].points];
      let path2 = [this.result[0].latLongResponseList];
      this.radiusBoundary();
    }, err => {
      this.common.loading--;
      console.log('err is: ', err);
    });

  }



  mapPath3(path2: any[]) {
    console.log("The visible routes is ", this.visibleRoutes)
    this.map1 = new google.maps.Map(document.getElementById("map"),
      {
        zoom: 8,
        center: { lat: path2[0][0].latitude, lng: path2[0][0].longitude },
        mapTypeId: "terrain",
      });
    this.radiusBoundary();
    for (let i = 0; i < this.visibleRoutes.length; i++) {

      if (this.visibleRoutes[i] == true) {
        // let colourfuloutside = ["#64d8fa", "#f26c6f", "#f26caf", "#83dcc1", "#6561fd", "#a3a0fe", "#79e68e", "#9775ea"];
        // let colourfulinside = ["#a2e7fc", "#f7a7a9", "#f7a7cf", "#b4eada", "#a3a0fe", "#f0d0ae", "#aff0bb", "#c1acf2"];
        //let pointInsideRadiusLatLng = [this.result[i].points];
        let pointInsideRadiusLatLngOrigin = [this.result[i].initialPoints];
        let pointInsideRadiusLatLngDestination = [this.result[i].finalPoints];
        this.pointInsideRadius(this.map1, pointInsideRadiusLatLngOrigin, "InsideRadius", this.colourful[i])
        this.pointInsideRadius(this.map1, pointInsideRadiusLatLngDestination, "InsideRadius", this.colourful[i])
        let pathshow = [this.result[i].latLongResponseList]
        pathshow.forEach(flightPlanCoordinate => {
          let path: { lat: any; lng: any; }[] = [];
          let flightPlan = [];
          flightPlan = flightPlanCoordinate;
          flightPlan.map((e: { [x: string]: any; }) => {
            path.push({ 'lat': e['latitude'], 'lng': e['longitude'] });
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

      }
    }//if close statement;

  }
  routesTomodify = []
  dropdownroutes(tr: any) // This control the Route List in front-end, Number of routes will present
  {
    console.log("the value of tr is", tr);
    for (let i = 1; i <= tr; i++) {
      let s = `Route Number ${i}`
      this.routeList.push(s);
      this.visibleRoutes.push(false);

      this.routesTomodify.push(false);
      // let ss=this.getRandomColor();
      this.colourful.push(this.getRandomColor())
      // mat-option-text

    }


  }
  radiusBoundary() {
    console.log("Radius Boundary is called");
    var spherical = google.maps.geometry.spherical;
    var startPoint = new google.maps.LatLng(this.startLat, this.startLong);
    console.log("start point", startPoint);
    console.log("spherical", spherical);
    console.log("StarLat ", this.startLat);
    console.log("start long", this.startLong);
    console.log("radius is ", this.radius);
    var endPoint = new google.maps.LatLng(this.endLat, this.endLong);
    this.createMarker(this.map1, startPoint, "Start Point");
    this.createMarker(this.map1, endPoint, "End Point");

    let r = this.radius;
    for (var i = 0; i <= 180; i += 10) {
      var side = spherical.computeOffset(startPoint, r, i);
      var side1 = spherical.computeOffset(endPoint, r, i);
      this.createMarker(this.map1, side, "side");
      this.createMarker(this.map1, side1, "side1");
    }
    for (var i = 0; i > -180; i -= 10) {
      var side = spherical.computeOffset(startPoint, r, i);
      var side1 = spherical.computeOffset(endPoint, r, i);
      this.createMarker(this.map1, side, "side");
      this.createMarker(this.map1, side1, "side1");
    }


  }
  createMarker(map: any, point: any, title: any) {
    const svgMarker = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "blue",
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(1, 1),
    };
    return new google.maps.Marker({
      icon: svgMarker,
      map: map,
      position: point,
      title: title
    });
  }
  pointInsideRadius(map: any, point: any, title: any, fillColour: any) {
    console.log("Inside Marker", point[0][0].latitude, " and ", point[0][1].longitude);
    console.log("Inside Marker", point[0][0].latitude, " and ", point[0][1].longitude);
    console.log(point);
    // console.log("The length is ()",point.length());

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

      //console.log("I am inside radius",point[0][latlng].latitude,"and",point[0][latlng1].longitude)
      new google.maps.Marker({
        icon: svgMarker,
        map: map,
        position: { lat: point[0][latlng].latitude, lng: point[0][latlng].longitude },
        title: title
      });
    }
  }
  // getdataRoute(route: any) {  // This function is showing working on route paths.
  //   console.log('route data is: ', route)
  //   console.log('result is this.result: ', this.result)
  //   console.log('routelist:  ', this.routeList)

  //   // console.log('this.visibleRoute: ', this.visibleRoutes);
    
    

    

  //   // let localRoutes = JSON.parse(JSON.stringify(this.routesTomodify));



  //   // for (let i = 0; i < route.length; i++) {
  //   //   console.log(route[i]);
  //   //   for (let j = 0; j < localRoutes.length; j++) {
  //   //       if(route[i]===j){
  //   //         localRoutes[i] = true;
  //   //       }else{
  //   //         localRoutes[i] = false;
  //   //       }
  //   //   }
  //     // localRoutes.map((ele, index1) => {
  //     //   console.log(ele, route[i], index1);
  //     //   if (route[i] === index1) {
  //     //     ele = true;
  //     //   } else {
  //     //     ele = false
  //     //   }
  //     // })
  //   }
  //   // route.foreach(index => {
  //   //   this.routesTomodify.map((ele,index1) => {
  //   //     if(index == index1){
  //   //       ele = true;
  //   //     }else{
  //   //       ele = false
  //   //     }
  //   //   })
  //   //   // this.routesTomodify[ele] = true;
  //   // })
  //   // console.log('modified routes:', localRoutes)
  //   // this.visibleRoutes = JSON.parse(JSON.stringify(this.routesTomodify));
  //   // console.log(this.visibleRoutes);
  //   // let pathroute = [this.result[route].latLongResponseList]
  //   // this.mapPath3(pathroute)
  //   // let routes = this.visibleRoutes;
  //   // for(let i=0;i<route.length;i++){
  //   //   this.callAction(route[i],routes);
  //   // }

  //   // for (let i = 0; i < route.length; i++) {
  //   //   let tt;
  //   //   let ss = parseInt(route[i][route[i].length - 1]);
  //   //   let yy = parseInt(route[i][route[i].length - 2]); // The type of yy will be "Not a number" until routes become two digits
  //   //   //Suppose if the routes increased more then 9, we have to handle ss variable logic as we are using inner text which related to the length.
  //   //   if (ss >= 0 && yy >= 0) {
  //   //     ss = (yy * 10) + ss;
  //   //   }
  //   // if (this.visibleRoutes[ss - 1] == true) {
  //   //   this.visibleRoutes[ss - 1] = false;
  //   // }
  //   // else {
  //   //   this.visibleRoutes[ss - 1] = true;
  //   // }

  //   // if (this.visibleRoutes[route] == true) {
  //   //   this.visibleRoutes[route] = false;
  //   // }
  //   // else {
  //   //   this.visibleRoutes[route] = true;
  //   // }

  //   // console.log('visible arra: ', this.visibleRoutes)
  //   // // console.log("The value of s is ", ss);
  //   // let pathroute = [this.result[route].latLongResponseList]
  //   // console.log("The value of path route is", pathroute)
  //   // this.mapPath3(pathroute)
  //   // }// This will call the function for visibilty
  // }

  // callAction(route, routes) {
  //   if (routes[route] == true) {
  //     routes[route] = false;
  //   }
  //   else {
  //     routes[route] = true;
  //   }

  //   this.visibleRoutes = routes;
  //   console.log('visible arra: ', this.visibleRoutes)
  //   // console.log("The value of s is ", ss);

  //   // console.log("The value of path route is", pathroute)
  //   // this.mapPath3(pathroute)
  // }


  getdataRoute(route: any) {  // This function is showing working on route paths.
     let tt;
    let ss = parseInt(route[route.length - 10]);
    let yy=parseInt(route[route.length-11]); // The type of yy will be "Not a number" until routes become two digits
     //Suppose if the routes increased more then 9, we have to handle ss variable logic as we are using inner text which related to the length.
    if(ss>=0&&yy>=0)
    {
      ss=(yy*10)+ss;
    }
    else{}
    if (this.visibleRoutes[ss - 1] == true) {
      this.visibleRoutes[ss - 1] = false;
    }
    else {
      this.visibleRoutes[ss - 1] = true;
    }
    console.log("The value of s is ", ss);
    let pathroute = [this.result[ss - 1].latLongResponseList]
    console.log("The value of path route is",pathroute)
    this.mapPath3(pathroute)
  }
}

