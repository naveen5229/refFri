import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { parse } from 'path';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { VehicleDistanceCoveredCompactFormComponent } from '../../modals/vehicle-distance-covered-compact-form/vehicle-distance-covered-compact-form.component';

@Component({
  selector: 'vehicle-covered-distance',
  templateUrl: './vehicle-covered-distance.component.html',
  styleUrls: ['./vehicle-covered-distance.component.scss']
})
export class VehicleCoveredDistanceComponent implements OnInit {
  showTable = false;
  distanceData = [];
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
  today = null;

  constructor(public api: ApiService,
    private datePipe: DatePipe,
    public common: CommonService,
    public modalService: NgbModal,
    public user: UserService) {

    this.today = new Date();
    this.common.refresh = this.refresh.bind(this);

    this.getData();
  }

  ngOnInit() {
  }

  refresh() {
    console.log("Refresh");
    this.today = new Date();
    this.getData();
  }



  getData() {
    this.distanceData = [];
    this.common.loading++;
    this.api.get('Vehicles/foVehiclePerodicDistance')
      .subscribe(res => {
        this.common.loading--;
        let re = JSON.stringify(res['data']);
        if (re == null) {
          return this.data = [];
        }
        console.log("re---", re);
        let rep = JSON.parse(re);
        this.data = JSON.parse(re);
        console.log("response data ", rep);
        let details = [];
        Object.keys(rep).map(key => {
          let detail = {
            _id: key,
            _lat: rep[key].lat,
            _long: rep[key].long,
            Regno: rep[key].regno,
            Location: rep[key].currLoc,
            LastSuccessDate: rep[key].successdt,
            haltDur: rep[key].haltDur,
            group: rep[key].group

          };
          rep[key].slots && rep[key].slots.map((slot, index) => {
            detail['Slot' + (index + 1)] = slot;
          });

          details.push(detail);

        });
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
      let first_rec = this.distanceData[0];

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

        if (this.headings[j] == "Location") {
          this.valobj[this.headings[j]] = { value: this.distanceData[i][this.headings[j]], class: 'black', action: this.showLocation.bind(this, this.distanceData[i]) };
        }
        else if (this.headings[j] == "LastSuccessDate") {
          this.valobj[this.headings[j]] = { value: this.datePipe.transform(this.distanceData[i][this.headings[j]], 'dd MMM HH:mm '), class: 'black', action: '' };

        }
        else {
          this.valobj[this.headings[j]] = { value: this.distanceData[i][this.headings[j]], class: 'black', action: '' };

        }
        this.valobj['style'] = { background: this.distanceData[i]._rowcolor };
        //columns.push(this.valobj);

      }
      columns.push(this.valobj);


    }
    return columns;

  }

  showLocation(details) {
    if (!details._lat) {
      this.common.showToast('Vehicle location not available!');
      return;
    }
    const location = {
      lat: details._lat,
      lng: details._long,
      name: '',
      time: ''
    };
    console.log('Location: ', location);
    this.common.params = { location, title: 'Vehicle Location' };
    const activeModal = this.modalService.open(LocationMarkerComponent, { size: 'lg', container: 'nb-layout' });

  }
  openCompactForm() {
    this.common.params = { data: this.data };
    const activeModal = this.modalService.open(VehicleDistanceCoveredCompactFormComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }


  printPDF(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = fodata['name'];
        let center_heading = "Vehicle Distance(24Hr)";
        let time = this.datePipe.transform(this.today, 'dd-MM-yyyy hh:mm:ss a');
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, null, time);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  printCsv(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = "Customer Name:" + fodata['name'];
        let center_heading = "Report Name:" + "Vehicle Distance(24Hr)";

        let time = "Report Generation Time:" + this.datePipe.transform(this.today, 'dd-MM-yyyy hh:mm:ss a');
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, null, time);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}