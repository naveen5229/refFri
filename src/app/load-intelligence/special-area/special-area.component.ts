import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from "../../services/api.service";
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'special-area',
  templateUrl: './special-area.component.html',
  styleUrls: ['./special-area.component.scss']
})
export class SpecialAreaComponent implements OnInit {

 
  isUpdate = false;
  selectedArea = {
    lat:null,
    long:null,
    id:null,
    loc_name:null
  };
  id = null;
  locName = null;
  locLatLng = {lat:0,lng:0};
  types = [1,2,3,4,5,6,7,8,9,10];
  type = 1;
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
    }, ['(regions)']);
    this.mapService.createPolygonPath();
    // this.mapService.setMapType(1);
    this.mapService.map.setOptions({ draggableCursor: 'crosshair' });
  }
  tempData = [];

  gotoSingle(isClear=true) {
    this.commonService.loading++;
    this.apiService.post("LoadIntelligence/getSpecialAreaFences", { lat: this.locLatLng.lat , lng: this.locLatLng.lng  })
    .subscribe(res => {
      let data = res['data'];
      let latLngs  = [];
      Object.keys(data).map( e => {
        latLngs.push({lat: data[e]['lat'], lng: data[e]['lng'], type: data[e]['type'], loc_name: e, id: data[e]['id'], subType: 'marker', color: 'FF0000'});
      });
      let infoKeys = ['id', 'type', 'loc_name']
      this.mapService.createMarkers(latLngs, false, true, infoKeys);
      console.log(latLngs);
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
    this.type = search.type;
    this.id = search.id;
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
    this.type = 1;
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
            long:this.locLatLng.lng,
            type: this.type
          };
          this.apiService.post("LoadIntelligence/insertSpecialAreaFence", params)
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
          console.log(this.selectArea);
          let params = {
            id: this.id,
            type: this.type,
            polygon: path,
            locName: this.selectedArea.loc_name,
            lat:this.selectedArea.lat,
            long:this.selectedArea.long
          };
          this.apiService.post("LoadIntelligence/updateSA", params)
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
    this.apiService.post("LoadIntelligence/deleteSpecialArea", {locName : this.selectedArea.loc_name, id: this.id})
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
