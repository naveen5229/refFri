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

  typeIds = [];
  typeId = 1;
  moveLoc = '';
  siteLoc = '';
  selectedSite = null;
  siteName = null;
  remainingList = [];
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
    this.mapService.autoSuggestion("siteLoc", (place, lat, lng) => this.siteLoc=place);
    this.mapService.createPolygonPath();
    this.mapService.map.setOptions({ draggableCursor: 'crosshair' });
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
  gotoSingle() {
    this.commonService.loading++;
    let site = this.selectedSite;
    this.apiService.post("Site/getSingleSite", { siteId: this.selectedSite })
      .subscribe(res => {
        let data = res['data'];
        console.log('Res: ', data);
        this.clearAll();
        this.mapService.createMarkers(data);
        this.typeId = data[0].type_id;
        this.selectedSite = data[0].id;
        this.siteLoc = data[0].loc_name;
        this.siteName = data[0].name;
        this.selectedSite = site;
        this.apiService.post("SiteFencing/getSiteFences", { siteId: this.selectedSite })
          .subscribe(res => {
            let data = res['data'];
            console.log('Res: ', res['data']);
            if(data['siteId']){
              this.mapService.createPolygon(data.latLngs);
              this.isUpdate=true;
            }
            else
             this.isUpdate=false;
          }, err => {
            console.error(err);
            this.commonService.showError();
          });
      }, err => {
        console.error(err);
        this.commonService.showError();
      });

    this.commonService.loading--;
  }
  clearAll() {
    this.exitTicket();
    this.mapService.isDrawAllow = false;
    this.siteName = null;
    this.siteLoc = null;
    this.typeId = 1;
    this.selectedSite = null;
    this.getRemainingTable();
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
              this.clearAll();
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
              this.clearAll();
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
  submitValidity() {
    if (this.selectedSite) {
      if (this.siteName == 'unknown' || this.siteLoc == 'unknown' || !this.siteName || !this.siteLoc) {
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
