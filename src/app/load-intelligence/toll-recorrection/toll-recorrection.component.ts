import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import 'rxjs/add/operator/first';
declare let google: any;


@Component({
  selector: 'toll-recorrection',
  templateUrl: './toll-recorrection.component.html',
  styleUrls: ['./toll-recorrection.component.scss']
})
export class TollRecorrectionComponent implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
 
  requestData = {
    type: null,
    lat: 22.719568,
    long: 75.857727,
    zoom: 4.5
  }

  changes = {lat: null, lng: null};

  data = [];
  routeData = [];
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

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public mapService: MapService) { 
      this.showData();
    }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.mapService.mapIntialize('map', this.requestData.zoom, this.requestData.lat, this.requestData.long);
     

    }, 200);

  }

  showData() {
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
    this.api.get('LoadIntelligence/getRandomTollPlazas')
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
        action: this.getNearRoutes.bind(this, details),
      },

      {
        class: "fas fa-ban",
        action: this.rejectApprove.bind(this, details, -1),
      },
      {
        class: "fas fa-check",
        action: this.rejectApprove.bind(this, details, 1),
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



getNearRoutes(details) {
    this.changes = {lat: null, lng: null};
    console.log(details);
    let params = {id:  details.id};
    this.common.loading++;
    this.api.post('LoadIntelligence/getNearbyTollPlazas', params)
      .subscribe(res => {
        this.common.loading--;
        this.routeData = [];
        if (!res['data']) return;
        this.mapService.clearAll()
        this.routeData = res['data'];
        let latlng = new google.maps.LatLng(details.lat, details.long);
        this.mapService.createMarkers(this.routeData, false, true, ['id', 'name']);
        this.mapService.createSingleMarker(latlng, ((e) => {
          this.changes.lat = e.latLng.lat();
          this.changes.lng = e.latLng.lng();
          console.log(this.changes);
        } ));

});

}

rejectApprove(details, status) {
  let params = {id: details.id, status: status , changes: this.changes}
  this.common.loading++;
  this.api.post('LoadIntelligence/updateTollPlazaVerifyStatus', params)
  .subscribe(res => {
    this.common.loading--;
    console.log(res);
    this.showData();
});
}

}