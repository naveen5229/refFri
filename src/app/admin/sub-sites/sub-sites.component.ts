import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'sub-sites',
  templateUrl: './sub-sites.component.html',
  styleUrls: ['./sub-sites.component.scss', '../../pages/pages.component.css']
})
export class SubSitesComponent implements OnInit {
  siteId = null;
  siteName = null;
  siteLoc = null;
  subSites = null;
  subSiteName = null;
  btn = 'Create Fencing';
  typeIds = [];
  typeId = null;
  subSiteId = null;
  subSiteLatLng = null;
  sitepoly = null;
  subsitepolys = [];
  constructor(
    public common: CommonService,
    public api: ApiService,
    public mapService: MapService
  ) {
    this.common.refresh = this.refresh.bind(this);
    this.getTypeIds();

  }

  ngOnInit() {
  }

  refresh() {
    this.getTypeIds();
    console.log('refresh');
  }
  selectSite(site) {
    this.siteId = site.id;
    this.getFencing();
    // this.mapService.zoomAt({ lat: parseFloat(site.lat), lng: parseFloat(site.long) });
  }

  getTypeIds() {
    this.api.get("Suggestion/getTypeMaster?typeId=5")
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.typeIds = res['data'];
        this.typeIds.push({ id: 0, description: "All" });
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  createFinishFencing() {
    this.mapService.isDrawAllow = !this.mapService.isDrawAllow;
    if (!this.mapService.isDrawAllow) {
      this.submitPolygon();
    }
  }

  getSubSites() {
    // this.getFencing();
    let params = "siteId=" + this.siteId;
    this.common.loading++;
    this.api.get('SubSiteOperation/getSubSites?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.subSites = res['data']['markers'];
        this.mapService.clearAll();
        this.markerCreate();
        let data = res['data']['fences'];
        console.log('Res: ', res['data']);
        this.createFences(data);
        this.getFencing(false);
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  getFencing(isclear=true) {
    let params = {
      strictSelected:true,
      siteId : this.siteId,
    };
    isclear && this.mapService.clearAll();
    this.common.loading++;
    this.api.post("SiteFencing/getSiteFences", params)
      .subscribe(res => {
        this.common.loading--;
        let data = res['data'];
        console.log('Res: ', res['data']);
        this.mapService.createMarkers([data[Object.keys(data)[0]].marker],false,true,['id','name']);
        let Options = {
          paths: data[Object.keys(data)[0]].latLngs,
          strokeColor: '#D2691E',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          clickable: false,
          fillColor: '#b5651d',
          fillOpacity: 0.35
        };
        this.sitepoly && this.sitepoly.setMap(null);
      this.sitepoly = this.mapService.createPolygon(data[Object.keys(data)[0]].latLngs,Options);
      this.mapService.setPolyBounds(this.mapService.polygon.getPath(),true);
      // this.mapService.zoomMap(17);

      }, err => {
        this.common.loading--;
        this.common.showError();
      });

  }

  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.createPolygonPath();
    this.mapService.map.setOptions({ draggableCursor: 'crosshair' });
  }

  markerCreate() {
    this.mapService.createMarkers(this.subSites);
    let markerIndex = 0;
    for (const marker of this.mapService.markers) {
      let event = this.subSites[markerIndex];
      markerIndex++;
    }
  }

  rotateBounce(i, bounce) {
    console.log("index", i);
    this.mapService.toggleBounceMF(i, bounce);
  }


  submitValidity() {
    if (!this.subSiteName || !this.siteId) {
      return false;
    }
    return true;
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
          siteId: this.siteId,
          subSiteName: this.subSiteName,
          typeId: this.typeId,
          subSiteId: this.subSiteId
        };
        let url = this.subSiteId ? "SubSiteOperation/updateSiteFence" : "SubSiteOperation/insertSiteFence"
        this.api.post(url, params)
          .subscribe(res => {
            if (!res['success']) {
              this.common.showError(res['msg']);
              this.mapService.isDrawAllow = true;
              return;
            }
            this.subSiteId = res['data'];
            this.common.showToast("Created subsite");

            this.gotoSingle();
          }, err => {
            console.error(err);
            this.common.showError();
            this.mapService.isDrawAllow = true;
          });

      } else {
        alert("No polyLine Was Drawn..");
        this.mapService.isDrawAllow = true;
      }
    } else {
      alert("Please Enter Fields with Valid Name And Not Keep Them Null... ");
      this.mapService.isDrawAllow = true;
    }
  }
  clearAll() {
    this.mapService.isDrawAllow = false;
    this.subSiteName = null;
    this.siteId = null;
    this.siteName = null;
    this.siteLoc = null;
    this.subSiteId = null;
    this.typeId = null;
    if(this.subsitepolys.length>0) {
      this.subsitepolys.forEach(e=>{
        e.setMap(null);
      });
      this.subsitepolys = [];
    }
    this.sitepoly && this.sitepoly.setMap(null);
    this.mapService.clearAll();
  }

  tempData = [];
  gotoSingle() {
    this.common.loading++;
    let subSiteId = this.subSiteId;
    this.api.post("SubSiteOperation/getSubSite", { subSiteId: subSiteId })
      .subscribe(res => {
        if (!res['success']) {
          this.common.showError(res['msg']);
          return;
        }
        let data = res['data'];
        console.log('Res: ', data);
        this.clearAll();
        this.tempData = data;
        this.subSiteLatLng = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].long) };
        this.typeId = data[0].type_id;
        this.subSiteId = data[0].id;
        this.subSiteName = data[0].name;
        this.siteId = data[0].site_id;
        this.siteName = data[0].sname;
        this.siteLoc = data[0].slname;
        this.getFencing();
        this.api.post("SubSiteOperation/getSubSiteFences", { subSiteId: this.subSiteId })
          .subscribe(res => {
            this.common.loading++;
            let data = res['data'];
            let count = Object.keys(data).length;
            console.log('Res: ', res['data']);
            this.createFences(data);
            this.common.loading--;
          }, err => {
            console.error(err);
            this.common.showError();
            this.common.loading--;
          });
      }, err => {
        console.error(err);
        this.common.showError();
      });

    this.common.loading--;
  }

  createFences(data) {
    if(this.subsitepolys.length>0) {
      this.subsitepolys.forEach(e=>{
        e.setMap(null);
      });
      this.subsitepolys = [];
    }
    let count = Object.keys(data).length;
    if (data[this.subSiteId]) {
      this.tempData[0]['color'] = 'f00';
    }

    this.mapService.createMarkers(this.tempData);
    if (count == 1) {
      this.subsitepolys.push( this.mapService.createPolygon(data[Object.keys(data)[0]].latLngs));
      console.log("Single", data[Object.keys(data)[0]]);
    }
    else if (count > 1) {
      let latLngsArray = [];
      let show = "Unknown";
      let isMain = false;
      let isSec = false;
      let minDis = 100000;
      let minIndex = -1;
      for (const datax in data) {
        isMain = false;
        if (data.hasOwnProperty(datax)) {
          const datav = data[datax];
          if (datax == this.subSiteId) {
            isMain = true;
          }
          else if (minDis > datav.dis) {
            isMain = false;
            minDis = datav.dis;
            minIndex = latLngsArray.length;
          }
          latLngsArray.push({
            data: datav.latLngs, isMain: isMain, isSec: isSec, show:
              `
          Id: ${datax}<br>
          Name:${datav.name}<br>
          Location:${datav.loc_name}<br>
          `
          });
        }
      }
      if (minIndex != -1)
        latLngsArray[minIndex].isSec = true;
        this.subsitepolys.push(...this.mapService.createPolygons(latLngsArray));
    }
    else {
      console.log("Else");
    }
  }
}