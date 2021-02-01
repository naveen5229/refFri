import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationMarkerComponent } from '../location-marker/location-marker.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-distance-covered-compact-form',
  templateUrl: './vehicle-distance-covered-compact-form.component.html',
  styleUrls: ['./vehicle-distance-covered-compact-form.component.scss']
})
export class VehicleDistanceCoveredCompactFormComponent implements OnInit {
  data = [];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  tableData = [];
  constructor(
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal
  ) {
    this.common.handleModalSize('class', 'modal-lg', '1250');
    this.data = this.common.params.data;
    console.log("this is data-->", this.data);
    this.getTable();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }
  getTable() {
    let rep = this.data
    let details = [];
    Object.keys(rep).map(key => {
      let detail = {
        _lat: { value: rep[key].lat },
        _long: { value: rep[key].long },
        Regno: { value: rep[key].regno },
        Location: { value: rep[key].currLoc ,action: this.showLocation.bind(this, rep[key])},
        LastSuccessDate: { value: rep[key].successdt },
        haltDuration: { value: rep[key].haltDur },
        Group: { value: rep[key].group }

      };
      details.push(detail);

    });
    this.tableData = details;
    this.smartTableWithHeadings();
  }
  smartTableWithHeadings() {
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    if (this.tableData != null) {
      let first_rec = this.tableData[0];

      for (var key in first_rec) {
        if (key.charAt(0) != "_") {
          this.headings.push(key);
          let headerObj = { title: key, placeholder: this.formatTitle(key) };
          this.table.data.headings[key] = headerObj;
        }

      }
      this.table.data.columns = this.tableData;
      console.log("table:");
      console.log(this.table);
    } else {
      this.common.showToast('No Record Found !!');
    }

  }
  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }
  getTableColumns() {
    let columns = [];
    this.data.map(req => {
      let column = {
        regno: { value: req.regno  },
        currentLocation: { value: req.currLoc },
        successdt: { value: req.successdt },
        haltDur: { value: req.successdt },
        group: { value: req.group },
        
      };
      for (var i = 0; i < this.tableData.length; i++) {
        this.valobj = {};
        for (let j = 0; j < this.headings.length; j++) {
  
          if (this.headings[j] == "Location") {
            this.valobj[this.headings[j]] = { value: this.tableData[i][this.headings[j]], class: 'black', action: this.showLocation.bind(this, this.tableData[i]) };
          }
  
        }
      }
      columns.push(column);
    });
    return columns;
  }

  showLocation(details) {
    console.log("Details-->" , details);
    if (!details.lat) {
      this.common.showToast('Vehicle location not available!');
      return;
    }
    const location = {
      lat: details.lat,
      lng: details.long,
      name: '',
      time: ''
    };
    console.log('Location: ', location);
    this.common.params = { location, title: 'Vehicle Location' };
    const activeModal = this.modalService.open(LocationMarkerComponent, { size: 'lg', container: 'nb-layout' });

  }
}
