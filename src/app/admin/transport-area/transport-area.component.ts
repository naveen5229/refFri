import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from "../../services/api.service";
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'transport-area',
  templateUrl: './transport-area.component.html',
  styleUrls: ['./transport-area.component.scss', '../../pages/pages.component.css']
})
export class TransportAreaComponent implements OnInit {

  isUpdate = false;
  selectedArea = {
    lat:null,
    long:null,
    id:null,
    loc_name:null
  };
  locName = null;
  locLatLng = {lat:0,lng:0};
  constructor(public mapService: MapService,
    private apiService: ApiService,
    private commonService: CommonService) { 
      this.commonService.refresh = this.refresh.bind(this);
    }

  ngOnInit() {
  }

  refresh(){
    console.log('Refresh');
  }
  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.autoSuggestion("siteLoc", (place, lat, lng,placeF) => {
      this.commonService.loading++;
      this.mapService.zoomAt({lat:lat,lng:lng},10);
      this.clearAll();
      this.locLatLng={lat:lat,lng:lng};
      let placeT = placeF.split(",");
      console.log("PlaceT",placeT,"pLACE",placeF);
      
      this.locName=placeT[0]+"("+placeT[1].substr(0,3)+")";
      this.gotoSingle(false);
      this.commonService.loading--;
    });
    this.mapService.createPolygonPath();
    // this.mapService.setMapType(1);
    this.mapService.map.setOptions({ draggableCursor: 'crosshair' });
  }
  tempData = [];
  gotoSingle(isClear=true) {
    this.commonService.loading++;
    this.apiService.post("SiteFencing/getTransportationAreaFences", { lat: this.locLatLng.lat , lng: this.locLatLng.lng  })
    .subscribe(res => {
      let data = res['data'];
      if(!data){
        this.isUpdate=false;
        this.commonService.loading--;
        return;
      }
      if(!data[this.locName])
        this.isUpdate = false;
      else
        this.isUpdate = true;
      let count = Object.keys(data).length;
      console.log('Res: ', res['data']);
      if(count==1){
        if(isClear)
          this.clearAll();
          let datay = [{data:data[Object.keys(data)[0]].latLngs,isMain:this.isUpdate,isSec:!this.isUpdate,show:Object.keys(data)[0]}];
        this.mapService.createPolygons(datay);
        console.log("Single",data[Object.keys(data)[0]]);
      }
      else if(count>1){
        let latLngsArray = [];
        let isMain = false;
          let isSec = false;
          let minDis=100000;
          let minIndex = -1;
          for (const datax in data) {
            isMain= false;
            if (data.hasOwnProperty(datax)) {
              const datav = data[datax];
              if(datax==this.locName){
                isMain = true;
              }
              else if(minDis>datav.dis){
                isMain=false;
                minDis=datav.dis;
                minIndex = latLngsArray.length;
              }
              latLngsArray.push({data:datav.latLngs,isMain:isMain,isSec:isSec,show:datax});
              console.log("Multi",datax);
            }
          }
          if(minIndex != -1)
            latLngsArray[minIndex].isSec =true;
        if(isClear)
          this.clearAll();
        this.mapService.createPolygons(latLngsArray);
        }
        this.commonService.loading--;
      }, err => {
        console.error(err);
        this.commonService.showError();
        this.commonService.loading--;
      });
  }
  selectArea(search){
    console.log("Srearch",search);
    
    this.commonService.loading++;
    this.clearAll();
    this.isUpdate= true;
    this.locName = search.loc_name;
    search.lat = parseFloat(search.lat);
    search.long = parseFloat(search.long);
    this.locLatLng = {lat:search.lat,lng:search.long};
    this.mapService.zoomAt(this.locLatLng,10);
    this.gotoSingle(false);
    this.selectedArea = search;
    this.commonService.loading--;
  } 
  clearAll(isButton=false) {
    this.exitTicket();
    this.mapService.isDrawAllow = false;
    this.locName=null;
    this.locLatLng = null;
    this.isUpdate = false;
    this.selectedArea = null;
    isButton?this.mapService.clearAll():this.mapService.clearAll(true,true,{marker:false,polygons:true,polypath:true});
  }
  submitPolygon() {
    let valid = this.submitValidity();
    if (valid) {
      if (this.mapService.polygonPath) {
        var path = "(";
        var latLngs = this.mapService.polygonPath.getPath().getArray();
        if (latLngs.length < 4) {
          alert("Site Should Have More Than 3 points Atleast");
          this.mapService.isDrawAllow = true;
          return;
        }
        for (var i = 0; i < latLngs.length; i++) {
          path += latLngs[i].lat() + " " + latLngs[i].lng() + ",";
        }
        path += latLngs[0].lat() + " " + latLngs[0].lng() + ",";
        path = path.substr(0, path.length - 1);
        path += ")";
        
        //  console.log("Poly",this.mapService.polygon);
        if (!this.isUpdate) {
          let params = {
            polygon: path,
            locName: this.locName,
            lat:this.locLatLng.lat,
            long:this.locLatLng.lng
          };
          this.apiService.post("SiteFencing/insertTransportAreaFence", params)
            .subscribe(res => {
              let data = res['data'];
              console.log('Res: ', res['data']);
              this.commonService.showToast("Created");
              this.gotoSingle();
            }, err => {
              console.error(err);
              this.commonService.showError();
              this.mapService.isDrawAllow = true;
            });
        }
        else {
          let params = {
            polygon: path,
            locName: this.selectedArea.loc_name,
            lat:this.selectedArea.lat,
            long:this.selectedArea.long
          };
          this.apiService.post("SiteFencing/updateTA", params)
            .subscribe(res => {
              let data = res['data'];
              console.log('Res: ', res['data']);
              this.commonService.showToast("Updated");
              this.gotoSingle();
            }, err => {
              console.error(err);
              this.commonService.showError();
              //alert("Please Enter Fields with Valid Name And Not Keep Them Null... ");
              this.mapService.isDrawAllow = true;
            });
        }
      } else {
        alert("No polyLine Was Drawn..");
        this.mapService.isDrawAllow = true;
      }
    } else {
      alert("Please Enter Fields with Valid Name And Not Keep Them Null... ");
      this.mapService.isDrawAllow = true;
    }
  }
  DeleteArea(){
    console.log("Selected  Area",this.selectedArea);
    
    if(!this.selectedArea.loc_name){
      this.commonService.showError("Load Area!!");
      return;
    }
    this.apiService.post("SiteFencing/deleteArea", {locName : this.selectedArea.loc_name})
            .subscribe(res => {
              let data = res['data'];
              console.log('Res: ', res['data']);
              this.commonService.showToast("Deleted");
              this.clearAll();
            }, err => {
              console.error(err);
              this.commonService.showError();
              //alert("Please Enter Fields with Valid Name And Not Keep Them Null... ");
              this.mapService.isDrawAllow = true;
            });

  }
  submitValidity() {
    if (this.locName) {
      return true;
    }
    return false;
  }

  loadMarkers() {
    let boundBox = this.mapService.getMapBounds();
    let bounds = {
      'lat1': boundBox.lat1,
      'lng1': boundBox.lng1,
      'lat2': boundBox.lat2,
      'lng2': boundBox.lng2,
      'typeId': 1
    };
    this.apiService.post("VehicleStatusChange/getSiteAndSubSite", bounds)
      .subscribe(res => {
        let data = res['data'];
        console.log('Res: ', res['data']);
        this.mapService.clearAll(true,true,{marker:true,polygons:false,polypath:false});
        this.mapService.createMarkers(data);
      }, err => {
        console.error(err);
        this.commonService.showError();
      });
  }

  enterTicket() {
    if (this.locName) {
      if (!this.mapService.isDrawAllow) {
        let params = {
          tblRefId: 9,
          tblRowId: this.locName
        };
        // this.commonService.loading++;
        // this.apiService.post('TicketActivityManagment/insertTicketActivity', params)
        //   .subscribe(res => {
        //     this.commonService.loading--;
        //     if (!res['success']) {
        //       this.commonService.showToast(res['msg']);
        //     }
        //     else {
              this.mapService.isDrawAllow = true;
        //       if(this.isUpdate){
        //         this.commonService.showToast('Already Exists');
        //       }
        //     }
        //   }, err => {
        //     this.commonService.loading--;
        //     console.log(err);
        //   });
      }else
        this.submitPolygon();
    } else {
      this.commonService.showToast('Select Location First..');
    }
  }
  exitTicket() {
    let result;
    var params = {
      tblRefId: 9,
      tblRowId: this.locName
    };
    console.log("params", params);
    // this.commonService.loading++;
    // this.apiService.post('TicketActivityManagment/updateActivityEndTime', params)
    //   .subscribe(res => {
    //     this.commonService.loading--;
    //     result = res
    //     console.log(result);
    //     if (!result.sucess) {
    //       // alert(result.msg);
    //       return false;
    //     }
    //     else {
    //       return true;
    //     }
    //   }, err => {
    //     this.commonService.loading--;
    //     console.log(err);
    //   });
    return false;
  }
}
