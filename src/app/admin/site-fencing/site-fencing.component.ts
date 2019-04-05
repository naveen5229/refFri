import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from "../../services/api.service";
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'site-fencing',
  templateUrl: './site-fencing.component.html',
  styleUrls: ['./site-fencing.component.scss', '../../pages/pages.component.css',]
})
export class SiteFencingComponent implements OnInit {

  mergeSiteId= null;
  typeIds = [];
  typeId = 1;
  moveLoc = '';
  siteLoc = '';
  selectedSite = null;
  siteName = null;
  remainingList = [];
  siteLocLatLng = {lat:0,lng:0};
  siteLatLng = {lat:0,lng:90};
  isUpdate = false;
  constructor(private mapService: MapService,
    private apiService: ApiService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.getTypeIds();
    this.getRemainingTable();
  }
  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.autoSuggestion("moveLoc", (place, lat, lng) => this.mapService.zoomAt({ lat: lat, lng: lng }));
    this.mapService.autoSuggestion("siteLoc", (place, lat, lng) => {this.siteLoc=place;this.siteLocLatLng={lat:lat,lng:lng}});
    this.mapService.createPolygonPath();
    this.mapService.map.setOptions({ draggableCursor: 'crosshair' });
  }
  mergeSite() {
    if(!this.mergeSiteId){
      this.commonService.showToast("Select Old Site!!");
      return;
    }
    if(!this.selectedSite){
      this.commonService.showToast("Select New Site!!");
      return;
    }
    this.apiService.post("SiteFencing/mergeSite", {oldId:this.mergeSiteId,newId:this.selectedSite})
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.commonService.showToast(res['msg']);
      }, err => {
        console.error(err);
        this.commonService.showError();
      });
  }
  getTypeIds() {
    this.apiService.post("SiteFencing/getSiteTypes", {})
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.typeIds = res['data'];
      }, err => {
        console.error(err);
        this.commonService.showError();
      });
  }
  tempData = [];
  gotoSingle() {
    this.commonService.loading++;
    let site = this.selectedSite;
    this.apiService.post("Site/getSingleSite", { siteId: this.selectedSite })
      .subscribe(res => {
        let data = res['data'];
        console.log('Res: ', data);
        this.clearAll(false);
        this.tempData = data;
        this.siteLatLng = {lat:parseFloat(data[0].lat),lng:parseFloat(data[0].long)};
        this.typeId = data[0].type_id;
        this.selectedSite = data[0].id;
        this.siteLoc = data[0].loc_name;
        this.siteName = data[0].name;
        this.selectedSite = site;
        this.getRemainingTable();
        this.apiService.post("SiteFencing/getSiteFences", { siteId: this.selectedSite })
          .subscribe(res => {
            this.commonService.loading++;
            let data = res['data'];
            let count = Object.keys(data).length;
            console.log('Res: ', res['data']);
            if(data[this.selectedSite]){
              this.tempData[0]['color'] = 'f00';
              this.isUpdate=true;
            }
            else
              this.isUpdate=false;
            this.mapService.createMarkers(this.tempData);
            if(count==1){
              this.mapService.createPolygon(data[Object.keys(data)[0]].latLngs);
              console.log("Single",data[Object.keys(data)[0]]);
            }
            else if(count>1){
              let latLngsArray = [];
              let show = "Unknown";
              let isMain = false;
              let isSec = false;
              let minDis=100000;
              let minIndex = -1;
              for (const datax in data) {
                if (data.hasOwnProperty(datax)) {
                  const datav = data[datax];
                  if(datax==this.selectedSite){
                    isMain = true;
                    isSec = false;
                  }
                  else if(minDis>datav.dis){
                    this.mergeSiteId=datax;
                    isMain=false;
                    isSec = false;
                    minDis=datav.dis;
                    minIndex = latLngsArray.length;
                  }
                  latLngsArray.push({data:datav.latLngs,isMain:isMain,isSec:isSec,show:datax});
                  console.log("Multi",datax);
                }
              }
              latLngsArray[minIndex].isSec =true;
              this.mapService.createPolygons(latLngsArray);
            }
            else{
              console.log("Else");
            }
            this.mapService.zoomMap(18.5);
            this.commonService.loading--;
          }, err => {
            console.error(err);
            this.commonService.showError();
            this.commonService.loading--;
          });
      }, err => {
        console.error(err);
        this.commonService.showError();
      });

    this.commonService.loading--;
  }
  clearAll(loadTable = true) {
    this.exitTicket();
    this.mapService.isDrawAllow = false;
    this.siteName = null;
    this.siteLoc = null;
    this.selectedSite = null;
    if(loadTable){
      this.typeId = 1;
      this.getRemainingTable();
    }
    this.mapService.clearAll();
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
        let params = {
          polygon: path,
          siteId: this.selectedSite,
          siteName: this.siteName,
          siteLoc: this.siteLoc,
          typeId: this.typeId
        };
        //  console.log("Poly",this.mapService.polygon);
        if (!this.isUpdate) {
          this.apiService.post("SiteFencing/insertSiteFence", params)
            .subscribe(res => {
              let data = res['data'];
              console.log('Res: ', res['data']);
              this.commonService.showToast("Created");
              this.gotoSingle();
              this.getRemainingTable();
              this.clearAll(false);
            }, err => {
              console.error(err);
              this.commonService.showError();
              this.mapService.isDrawAllow = true;
            });
        }
        else {
          this.apiService.post("SiteFencing/updateSiteFence", params)
            .subscribe(res => {
              let data = res['data'];
              console.log('Res: ', res['data']);
              this.commonService.showToast("Updated");
              this.getRemainingTable();
              this.gotoSingle();
              this.clearAll(false);
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
  getRemainingTable() {
    this.apiService.post("SiteFencing/getRemainingSites", { type: this.typeId })
      .subscribe(res => {
        let data = res['data'];
        console.log('Res: ', res['data']);
        this.remainingList = data;
      }, err => {
        console.error(err);
        this.commonService.showError();
      });
  }

  // getRemainingTable() {
  //     this.commonService.loading++;
  //     let response;
  //     this.apiService.get('Test')
  //       .subscribe(res => {
  //         this.commonService.loading--;
  //         console.log('Res:', res['data']);
  //         // = res['data'];
  //        // console.log('Attendance:',this.driverAttendance);
  //       }, err => {
  //         this.commonService.loading--;
  //         console.log(err);
  //       });
  // }
  submitValidity() {
    if (this.selectedSite) {
      if (this.siteName == 'unknown' || !this.siteName ) {
        return false;
      }
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
      'typeId': this.typeId
    };
    this.apiService.post("VehicleStatusChange/getSiteAndSubSite", bounds)
      .subscribe(res => {
        let data = res['data'];
        console.log('Res: ', res['data']);
        this.clearAll();
        this.mapService.createMarkers(data);
      }, err => {
        console.error(err);
        this.commonService.showError();
      });
  }
  updateLocName(){
    if(this.selectedSite!=null && this.siteLoc!=null){
      let dis = this.commonService.distanceFromAToB(this.siteLatLng.lat,this.siteLatLng.lng,
                this.siteLocLatLng.lat,this.siteLocLatLng.lng,"Mt");
      let distance = parseInt(dis+'')==0?0:parseInt(dis+'');
      console.log("distance:",distance,this.siteLatLng,this.siteLocLatLng);
      
      if(distance>20000){
        this.commonService.showToast("site is far away from loc");
        return;
      }
      let params = {
        siteId:this.selectedSite,
        siteLoc:this.siteLoc
      };
    this.commonService.loading++;

      this.apiService.post('SiteFencing/updateSiteDetails', params)
          .subscribe(res => {
            this.commonService.loading--;
              this.commonService.showToast(res['msg']);
          }, err => {
            this.commonService.loading--;
            console.log(err);
          });
    }
  }
  enterTicket() {
    if (this.selectedSite) {
      if (!this.mapService.isDrawAllow) {
        let params = {
          tblRefId: 2,
          tblRowId: this.selectedSite
        };
        this.commonService.loading++;
        this.apiService.post('TicketActivityManagment/insertTicketActivity', params)
          .subscribe(res => {
            this.commonService.loading--;
            if (!res['success']) {
              this.commonService.showToast(res['msg']);
            }
            else {
              this.mapService.isDrawAllow = true;
              if(this.isUpdate){
                this.commonService.showToast('Already Exists');
              }
            }
          }, err => {
            this.commonService.loading--;
            console.log(err);
          });
      }
      if (this.mapService.isDrawAllow)
        this.submitPolygon();
    } else {
      this.commonService.showToast('Select Site First..');
    }
  }
  exitTicket() {
    let result;
    var params = {
      tblRefId: 2,
      tblRowId: this.selectedSite
    };
    console.log("params", params);
    this.commonService.loading++;
    this.apiService.post('TicketActivityManagment/updateActivityEndTime', params)
      .subscribe(res => {
        this.commonService.loading--;
        result = res
        console.log(result);
        if (!result.sucess) {
          // alert(result.msg);
          return false;
        }
        else {
          return true;
        }
      }, err => {
        this.commonService.loading--;
        console.log(err);
      });
    return false;
  }
  ignoreSite() {
    if(!this.selectedSite){
      alert("Select Site First!!!");
      return;
    }
    this.commonService.loading++;
    this.apiService.post('SiteFencing/ignoreSite',{siteId:this.selectedSite})
      .subscribe(res => {
        this.commonService.loading--;
        this.commonService.showToast(res['msg']);
      }, err => {
        this.commonService.loading--;
        console.log(err);
      });
    this.clearAll();
  }
}
