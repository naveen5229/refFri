import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { MapService } from '../../services/map.service';
import { UserService } from '../../services/user.service';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
@Component({
  selector: 'sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {
  table = null;
  showTable = false;
  LatLongData = null;
  path = '';
  companyId = null;
  Sites = [];
  companies = [];
  site = {
    sitename: null,
    sitetype: 1,
    company_id: null,
    name: null,
    id: null
  }
  remainingList = [];
  circle = null;
  routeId = null;
  siteLatLng = { lat: 0, lng: 90 };
  typeId = 1;
  siteLoc = '';
  siteName = null;
  tempData = [];
  isUpdate = false;
  mergeSiteId = null;
  position = null;
  final = null;
  meterRadius = 20;
  currentCenter = null;
  lat = null;
  long = null;
  isHeatAble = false;
  kmsShow = null;
  Location = null;
  typeIds = [{
    description: 'loading/unloading',
    id: '1'
  }, {
    description: 'Petrol Pump',
    id: '101'
  },
  {
    description: 'Dhaba',
    id: '111'
  }, {
    description: 'My Office Site',
    id: '121'
  },
  {
    description: 'Workshop',
    id: '131'
  }, {
    description: 'otherSite',
    id: '201'

  }];
  typeID = null;

  constructor(public common: CommonService,
    public api: ApiService,
    public mapService: MapService,
    public user: UserService) {
    if (user._details.userType != 'U') {
      this.companyDetails();
    } else {
      this.site.company_id = this.user._details.company_id;
      this.companySites();
    }
    this.site.name = "Add";
  }

  ngOnInit() {
  }

  getRemainingTable() {
    // this.Location = null;
    // this.site.sitename = null;
  }

  ngAfterViewInit() {
    this.mapService.mapIntialize("map", 10);
    setTimeout(() => {
      this.mapService.setMapType(0);
    }, 2000);
    this.mapService.isDrawAllow = true;
    this.mapService.createPolygonPath();
    this.mapService.addListerner(this.mapService.map, 'click', (event) => {

      if (this.mapService.isDrawAllow) {
        console.log("Event", event);
        this.currentCenter = event.latLng;
      }
    })

    setTimeout(() => {
      if (this.common.params != null) {
        let latitude = this.common.params.vehicle.latitude;
        let longitude = this.common.params.vehicle.longitude;
        let marker = [{
          lat: latitude,
          long: longitude,
          address: this.common.params.vehicle.Address,
        }];
        this.mapService.createMarkers(marker, false, true, ["address"]);
      }
    }, 3000);

  }

  // showMarker()
  // {
  //   let markers=""
  //   this.mapService.createMarkers(this.LatLongData)
  // }


  companyDetails() {
    // this.companies = [];
    // this.common.loading++;
    // this.api.get('Company/getCompanies')
    //   .subscribe(res => {
    //     this.common.loading--;
    //     console.log(res);
    //     this.companies = res['data'];
    //     if (res != []) {
    //       this.site.company_id = this.companies[0].company_id;
    //       this.companySites();
    //     }
    //   }, err => {
    //     this.common.loading--;
    //     console.log(err);
    //   });
  }

  //Save Sites
  submitPolygon() {
    let url;
    if (this.mapService.polygonPath) {
      this.path = "(";
      var latLngs = this.mapService.polygonPath.getPath().getArray();
      if (latLngs.length < 4) {
        this.common.showError("Site Should Have More Than 3 points Atleast");
        this.mapService.isDrawAllow = true;
        return;
      }

      for (var i = 0; i < latLngs.length; i++) {
        //if (i == Math.floor(latLngs.length / 2))
        this.lat = latLngs[i].lat();
        this.long = latLngs[i].lng();
        this.path += latLngs[i].lat() + " " + latLngs[i].lng() + ",";
      }
      this.path += latLngs[0].lat() + " " + latLngs[0].lng() + ",";
      this.path = this.path.substr(0, this.path.length - 1);
      this.path += ")";
      console.log("latlong:", this.path)
    }
    if (this.site.sitename == "") {
      this.common.showError("Please fill Site Name.")
    } else {
      let params = {
        siteName: this.site.sitename,
        polygon: this.path,
        siteLoc: this.Location,
        typeId: this.typeID
      };

      this.common.loading++;
      this.api.post('SiteFencing/createSiteAndFenceWrtFo', params)
        .subscribe(res => {
          this.common.loading--;
          console.log("Success:", res);
          if (res['code'] > 0) {
            this.common.showToast("success!!");
            this.mapService.clearAll();
            this.site.name = "Add";
            this.Location = null;
            this.typeID = null;
            this.site.sitename = '';
            this.companySites();
          }
          if (res['code'] < 0) {
            this.common.showError(res['msg']);
            this.companySites();
          }
        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
  }

  clearMapServices() {
    if (this.site.name == "Update") {
      this.mapService.resetPolygons();
      this.mapService.clearAll();
      this.path = "";
    } else {
      this.mapService.clearAll();
    }
  }

  cancelMapServices() {
    this.site.sitename = "";
    this.path = "";
    this.site.id = "";
    this.mapService.resetPolygons();
    this.site.name = "Add";
    this.Location = null;
    this.typeID = null;
  }

  //Display Sites record in table 
  companySites() {
    this.mapService.clearAll();
    this.common.loading++;
    this.api.get('SiteFencing/getLocalFoSites')
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.Sites = res['data'];
        if (this.Sites != null) {
          this.showTable = true;
          this.table = this.setTable();
        } else {
          this.showTable = false;
          this.common.showToast('Record Not Found!!');
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  showdata(datas) {
    this.mapService.resetPolygons();
    this.path = datas.latlongs;
    let latlong = datas.latlongs;
    this.mapService.setMultiBounds(latlong, true);

    for (let index = 0; index < latlong.length; index++) {
      const thisData = latlong[index];
      latlong[index] = { lat: thisData.lat, lng: thisData.lng };
    }

    let latLngsMulti = [{
      data: latlong,
      isMain: true,
      isSec: false,
      show: datas.name
    }];
    this.site.name = "Update";
    this.site.sitename = datas.name;
    this.site.sitetype = datas.type;
    this.site.id = datas.id;
    console.log("Latlong:", (latLngsMulti));
    this.mapService.resetPolygons();
    this.mapService.createPolygons(latLngsMulti);
  }

  setTable() {
    let headings = {
      name: { title: 'Site Name', placeholder: 'Site Name' },
      loc_name: { title: 'Loc Name', placeholder: 'Loc Name' },
      Type: { title: 'SiteType', placeholder: 'SiteType' },
      Delete: { title: 'Delete', placeholder: 'Delete', hideSearch: true, class: 'tag' },
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "auto"

      }
    }
  }

  getTableColumns() {
    let columns = [];
    this.Sites.map(res => {
      let column = {
        name: { value: res.name, action: this.showdata.bind(this, res) },
        loc_name: { value: res.loc_name, action: this.showdata.bind(this, res) },
        Type: { value: res.Type, action: this.showdata.bind(this, res) },
        Delete: { value: '<i class="fa fa-trash text-danger"></i>', isHTML: true, action: this.deleteRecord.bind(this, res), class: 'icon text-center del' },
        rowActions: {
          click: 'selectRow'
        }
      };
      columns.push(column);
    });
    return columns;
  }

  //Delete Sites
  deleteRecord(row) {
    console.log("cId:", this.site.company_id)
    if (confirm("do you really want to delete this Site: " + row.name + "?")) {
      let params = {
        rowId: row.id,
      }
      this.mapService.clearAll();
      this.common.loading++;
      this.api.post('SiteFencing/deleteSiteAndFenceWrtFo', params)
        .subscribe(res => {
          this.common.loading--;
          console.log(res);
          this.Sites = res['data'];
          if (res['code'] > 0) {
            this.common.showToast("site deleted !!");
            this.companySites();
          }
          else {
            this.common.showError(res['msg']);
          }
        }, err => {
          this.common.loading--;
          this.common.showError(err);
          console.log(err);
        });
    }
  }
  selectLocation(res) {
    this.Location = res.location;
  }

}
