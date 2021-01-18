import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { RouteMapperComponent } from '../../modals/route-mapper/route-mapper.component';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'onward-kmpd',
  templateUrl: './onward-kmpd.component.html',
  styleUrls: ['./onward-kmpd.component.scss']
})
export class onwardKmpdComponent implements OnInit {

  showTable = false;
  onwardKmpd = [];
  headings = [];
  valobj = {};
  startDate = '';
  endDate = '';
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(public api: ApiService, public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    let today, start;
    today = new Date();
    this.startDate = this.common.dateFormatter(today.setDate(today.getDate() - 6));
    console.log('today startdate', today, this.startDate);
    today = new Date();
    this.endDate = this.common.dateFormatter(today.setDate(today.getDate() - 1));
    console.log('default date', this.startDate, this.endDate);
    this.getonwardKmpd();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {

    this.getonwardKmpd();
  }

  getonwardKmpd() {

    this.startDate = this.common.dateFormatter(this.startDate).split(' ')[0];
    this.endDate = this.common.dateFormatter(this.endDate).split(' ')[0];
    this.onwardKmpd = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    let params = {
      startdate: this.startDate,
      enddate: this.endDate
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('VehicleTrips/getFleetOnwardsKmpd', params)
      .subscribe(res => {
        this.common.loading--;
        //this.onwardKmpd = JSON.parse(res['data']);
        this.onwardKmpd = res['data'];
        if (this.onwardKmpd != null) {
          let first_rec = this.onwardKmpd[0];
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


      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.onwardKmpd.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        if (this.headings[j] == "y_regno") {
          this.valobj[this.headings[j]] = { value: this.onwardKmpd[i][this.headings[j]], class: 'blue', action: this.showLocation.bind(this, this.onwardKmpd[i]) };

        } else if (this.headings[j] == "y_kms") {
          this.valobj[this.headings[j]] = { value: this.onwardKmpd[i][this.headings[j]], class: 'blue', action: this.openRouteMapper.bind(this, this.onwardKmpd[i]) };

        } else {
          this.valobj[this.headings[j]] = { value: this.onwardKmpd[i][this.headings[j]], class: 'black', action: '' };
        }

      }
      this.valobj['style'] = { background: this.onwardKmpd[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  getDate(type) {

    this.common.params = { ref_page: 'onward-kmpd' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {
          this.startDate = '';
          this.startDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('startDate', this.startDate);
        }
        else {
          this.endDate = '';
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.endDate);
        }

      }

    });


  }

  showLocation(loc) {
    if (!loc._lat) {
      this.common.showToast("Vehicle location not available!");
      return;
    }
    const location = {
      lat: loc._lat,
      lng: loc._long,
      name: "",
      time: ""
    };
    //console.log("Location: ", location);
    this.common.params = { location, title: "Vehicle Location" };
    const activeModal = this.modalService.open(LocationMarkerComponent, {
      size: "lg",
      container: "nb-layout"
    });
  }


  openRouteMapper(defaultFault, timeFrom = 'Trip Start') {
    console.log("defaultFault", defaultFault)
    let fromTime = this.common.dateFormatter(this.startDate);
    let toTime = this.common.dateFormatter(this.endDate);
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = {
      vehicleId: defaultFault._vid,
      vehicleRegNo: defaultFault.y_regno,
      fromTime: fromTime,
      toTime: toTime
    };
    console.log("open Route Mapper modal", this.common.params);
    const activeModal = this.modalService.open(RouteMapperComponent, {
      size: "lg",
      container: "nb-layout",
      windowClass: "myCustomModalClass"
    });
    activeModal.result.then(
      data => console.log("data", data)
      // this.reloadData()
    );
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
        let center_heading = "Onward KMPD";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
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
        let left_heading = "FoName:" + fodata['name'];
        let center_heading = "Report:" + "Onward KMPD";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }
}
