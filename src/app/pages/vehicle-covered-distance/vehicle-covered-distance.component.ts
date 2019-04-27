import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { parse } from 'path';

@Component({
  selector: 'vehicle-covered-distance',
  templateUrl: './vehicle-covered-distance.component.html',
  styleUrls: ['./vehicle-covered-distance.component.scss']
})
export class VehicleCoveredDistanceComponent implements OnInit {
  showTable = false;

  distanceData = [];
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

  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal) {
    this.getData();
  }

  ngOnInit() {
  }



  getData() {
    this.distanceData = [];
    this.common.loading++;
    this.api.get('Vehicles/foVehiclePerodicDistance')
      .subscribe(res => {
        this.common.loading--;
        let re = JSON.stringify(res['data']);
        console.log("re---", re);
        let rep = JSON.parse(re);
        console.log("response data ", rep);
        let details = [];
        Object.keys(rep).map(key => {
          let detail = {
            _id: key,
            Regno: rep[key].regno,
            Location: rep[key].currLoc
          };

          rep[key].slots.map((slot, index) => {
            detail['Slot' + (index + 1)] = slot;
          });
          details.push(detail);
        });
        console.log('Details:', details);
        this.distanceData = details;
        this.smartTableWithHeadings();

      }, err => {
        this.common.loading--;
        this.common.showError();
      });
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
    if (this.distanceData != null) {
      console.log('distanceData', this.distanceData);
      let first_rec = this.distanceData[0];
      console.log("first_Rec", first_rec);

      for (var key in first_rec) {
        if (key.charAt(0) != "_") {
          this.headings.push(key);
          let headerObj = { title: key, placeholder: this.formatTitle(key) };
          this.table.data.headings[key] = headerObj;
        }

      }

      this.table.data.columns = this.getTableColumns();
      console.log("table:");
      console.log(this.table);
      this.showTable = true;
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
    for (var i = 0; i < this.distanceData.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {

        this.valobj[this.headings[j]] = { value: this.distanceData[i][this.headings[j]], class: 'black', action: '' };


      }
      this.valobj['style'] = { background: this.distanceData[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }
}