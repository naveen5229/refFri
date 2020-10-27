import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
declare var google: any;

@Component({
  selector: 'show-routes',
  templateUrl: './show-routes.component.html',
  styleUrls: ['./show-routes.component.scss']
})
export class ShowRoutesComponent implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef;

  routes = [];
  route = {
        routeId: null,
        color: '',
        latLngs: []
  };
  data = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};
  showLoader = true;

  requestData = {
    type: null,
    lat: 22.719568,
    long: 75.857727,
    zoom: 4.5
  }
  coordinates = [];
  counter = 0;

  isView = 'red';
  poly = null;
  
  lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
  };

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public mapService: MapService) { 
      this.showLoader = true;
      this.searchData();
    }

  ngOnInit() {
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.mapService.mapIntialize('map', this.requestData.zoom, this.requestData.lat, this.requestData.long);
    }, 200);

  }


  searchData() {
    this.data = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    this.headings = [];
    this.valobj = {};
  
    this.common.loading++;
    this.api.get('LoadIntelligence/getRouteNames')
      .subscribe(res => {
        this.common.loading--;
        this.data = [];

        if (!res['data']) return;
        this.data = res['data'];
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        let action = { title: this.formatTitle('Action'), placeholder: this.formatTitle('Action'), hideHeader: true };
        this.table.data.headings['action'] = action;

        this.table.data.columns = this.getTableColumns();

      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }


  getTableColumns() {

    let columns = [];
    this.data.map((doc, index) => {
      this.valobj = {};

      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };

      }
      this.valobj['action'] = { class: '', icons: this.actionIcons(doc, index) };

      columns.push(this.valobj);

    });

    return columns;
  }


  actionIcons(details, index) {

    let icons = [];

    icons.push(

      {
        class: details.isShow ? "far fa-eye green" : "far fa-eye red",
        action: this.getRoutes.bind(this, details, index),
      },

      {
        class: "fas fa-user-check",
      }
    )
    if (details.Status == "Accept" || details.Status == "Reject") {
      icons.pop();
    }

    return icons;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }


async getRoutes(row, index) {
 


    if (row.poly) {

          if(row.isShow) {
              row.poly.setMap(null);
              row.isShow = false;
              this.table.data.columns[index]['action']['icons'][0]['class'] = "far fa-eye red";
          } else {
              row.isShow = true;
              this.table.data.columns[index]['action']['icons'][0]['class'] = "far fa-eye green";
              row.poly.setMap(this.mapService.map);
          }
  

    } else {
          this.counter++;
         let x = await this.api.get('LoadIntelligence/getRouteLatLngs?' + 'routeId=' + row.route_id).toPromise();
      

         if(x) {

            this.routes = x['data'];
            // console.log(this.routes);
            this.table.data.columns[index]['action']['icons'][0]['class'] = "far fa-eye green";
            const polygonOptions = {
              strokeColor: row._color,
              strokeOpacity: 1,
              strokeWeight: 1,
              icons: [{
                offset: '100%'
              }]
            }
            let poly = null;

            this.routes.forEach(async e => {
              let latLng = {lat: e[0], lng: e[1]}
               poly  = this.mapService.createPolyPathDetached(latLng, polygonOptions, null, poly, row['route_name']);
          });
          this.counter--;
          row['poly'] = poly;
          row['isShow'] = true;
          
      
         }
         
    }
    return index;
}


async viewAllRoutes() {

    this.data.forEach(  async(e, index) => {
        if (!e.isShow) {
            await this.getRoutes(e, index);
        }
  });

}

}

