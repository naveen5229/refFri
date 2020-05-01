import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { async } from '@angular/core/testing';
declare var google: any;

@Component({
  selector: 'populate-altitude',
  templateUrl: './populate-altitude.component.html',
  styleUrls: ['./populate-altitude.component.scss']
})
export class PopulateAltitudeComponent implements OnInit {

    data =[];
    alti = null;
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
    isRecurssion = false;
    exceptIds = [];

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public mapService: MapService) { 
        this.getUnpopAltitude();
    }

  ngOnInit() {
  }

  getUnpopAltitude() {
    // this.table = {
    //   data: {
    //     headings: {},
    //     columns: []
    //   },
    //   settings: {
    //     hideHeader: true
    //   }
    // };
    // this.headings = [];
    // this.valobj = {};

    let params = {exceptIds: this.isRecurssion ? this.exceptIds : null}; 
    this.common.loading++;
    this.api.post('LoadIntelligence/getUnpopAlt', params)
      .subscribe(res => {
        this.common.loading--;
        if (!res['data']) return;
        this.data = res['data'];
        console.log(this.data);
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        // let action = { title: this.formatTitle('Action'), placeholder: this.formatTitle('Action'), hideHeader: true };
        // this.table.data.headings['action'] = action;

        this.table.data.columns = this.getTableColumns();
        console.log(this.table.data.columns);
        setTimeout (() => {
          console.log(this.table.data.columns);
          this.saveAltitude(this.data);
          console.log("Hello from setTimeout");
       }, 2000);
        // this.saveAltitude(this.table.data.columns);
  }, err => {
    this.common.loading--;
    this.common.showError();
  });
}


getTableColumns() {
  this.exceptIds = [];
  let columns = [];
   this.data.map( (doc, index) => {
     console.log(doc);
    // let test = this.mapService.displayLocationElevation(doc.lat, doc.long);
    // this.alti = await test; 
    // console.log(this.alti);
    // console.log(this.alti['elevation']);
    // doc['altitude'] = this.alti['elevation'];
    this.exceptIds.push(doc['routedataid']);
  
    this.valobj = {};

    for (let i = 0; i < this.headings.length; i++) {
      // console.log(this.headings[i]);
      // if (this.headings[i] == 'altitude') {
        // console.log(this.alti);
        // this.valobj[this.headings[i]] = { value: this.alti['elevation'], class: 'black', action: '' };
      // } else {
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      // }
    }
    this.valobj['action'] = { class: '', icons: this.actionIcons(doc, index) };

    columns.push(this.valobj);

  });
 
// console.log(columns);


  return columns;
}


actionIcons(details, index) {
  // console.log("details:", details);

  let icons = [];

  icons.push(

    {
      class: details.isShow ? "far fa-eye green" : "far fa-eye red",
      action: this.getapopulateAltitude.bind(this, details, index),
    },

    {
      class: "fas fa-user-check",
      // action: this.clearAdvices.bind(this, details),
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

getapopulateAltitude(details) {
  console.log(details);
}

startRecurssion(getaltitudeData?) {
  this.isRecurssion = true;
  this.getUnpopAltitude();
console.log(getaltitudeData);
}

stopRecurssion() {
  this.isRecurssion = false;
}

saveAltitude(getaltitudeData) {
  console.log(getaltitudeData);
  if (this.isRecurssion) {
    setTimeout(() => {
      this.getUnpopAltitude();
    }, 2000);
  }
  // this.getUnpopAltitude();
  this.common.loading++;
  let params = {altitudeData: getaltitudeData};
  this.api.post('LoadIntelligence/savePopulatedAlt', params)
    .subscribe(res => {
      this.common.loading--;
      console.log(res);
      // setTimeout(() => {
      // }, 2000)
      // if (!res['data']) return;
      // this.data = res['data'];
    
}, err => {
  this.common.loading--;
  this.common.showError();
});
}

}
