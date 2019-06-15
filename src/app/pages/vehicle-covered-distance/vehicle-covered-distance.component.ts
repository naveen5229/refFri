import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { parse } from 'path';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';

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
    this.getData();
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
            _lat: rep[key].lat,
            _long: rep[key].long,
            Regno: rep[key].regno,
            Location: rep[key].currLoc,
            LastSuccessDate: rep[key].successdt,
            haltDur: rep[key].haltDur

          };
          rep[key].slots && rep[key].slots.map((slot, index) => {
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

    console.log('distanceData, length', this.distanceData.length);
    for (var i = 0; i < this.distanceData.length; i++) {
      this.valobj = {};
      console.log('headings, length', this.headings, this.headings.length);
      for (let j = 0; j < this.headings.length; j++) {

        if (this.headings[j] == "Location") {
          this.valobj[this.headings[j]] = { value: this.distanceData[i][this.headings[j]], class: 'black', action: this.showLocation.bind(this, this.distanceData[i]) };
          console.log('distanceData if', this.distanceData[i]);
        }
        else if (this.headings[j] == "LastSuccessDate") {
          this.valobj[this.headings[j]] = { value: this.datePipe.transform(this.distanceData[i][this.headings[j]], 'dd MMM HH:mm '), class: 'black', action: '' };

        }
        else {
          this.valobj[this.headings[j]] = { value: this.distanceData[i][this.headings[j]], class: 'black', action: '' };
          console.log('distanceData else', this.distanceData[i]);

        }
        this.valobj['style'] = { background: this.distanceData[i]._rowcolor };
        //columns.push(this.valobj);

      }
      console.log('valobj', this.valobj);
      columns.push(this.valobj);

      console.log('Columns:', columns);

    }
    return columns;

  }

  showLocation(details) {
    console.log('detail', details);
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
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"], time);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}