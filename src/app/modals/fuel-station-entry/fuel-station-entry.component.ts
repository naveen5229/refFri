import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'fuel-station-entry',
  templateUrl: './fuel-station-entry.component.html',
  styleUrls: ['./fuel-station-entry.component.scss']
})
export class FuelStationEntryComponent implements OnInit {

  fuelEntry = [];
  vid;
  startDate;
  showTable = false;
  endDate;
  dateTime;
  today;
  table = null;

  constructor(private activeModal: NgbActiveModal, public common: CommonService,
    private datePipe: DatePipe,
    public api: ApiService,
    private modalService: NgbModal) {
    if (this.common.params) {
      console.log('this.common.params', this.common.params);
      this.vid = this.common.params.vid;
      this.dateTime = this.common.params.datetime;
      console.log('datetime,vid', this.dateTime, this.vid);
      this.getFuelEntry();

    }
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  getFuelEntry() {

    let params = {
      vid: this.vid,
      date: this.dateTime

    };
    this.common.loading++;
    console.log('params', params);
    this.common.api.post('Fuel/getFuelStationEntry', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'].length) {
          this.fuelEntry = res['data'];
          this.showTable = true;
        } else {
          this.common.showToast('No Record Found!!');
        }
        console.log('res', res['data']);
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  setTable() {
    let headings = {
      Lat: { title: 'Lat', placeholder: 'Lat' },
      Long: { title: 'Long', placeholder: 'Lat' },
      Name: { title: 'Name', placeholder: 'Name' },
      Location: { title: 'Location', placeholder: 'Location' },
      EntryTime: { title: 'EntryTime', placeholder: 'EntryTime' },
      Action: { title: 'Action', placeholder: 'Action' }
    };


    return {
      fuelEntry: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true
      }
    }
  }

  getTableColumns() {
    let columns = [];
    this.fuelEntry.map(R => {

      let column = {
        Lat: { value: R.lat },
        Long: { value: R.long },
        Name: { value: R.name },
        Location: { value: R.location },
        EntryTime: { value: this.datePipe.transform(R.entry_time, 'dd MMM HH:mm ') },
        Action: { value: `<i class="fa fa-map-marker"></i>`, isHTML: true, action: this.showLocation.bind(this, R) },
      };

      columns.push(column);

    });
    return columns;
  }

  showLocation(details) {
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

  closeModal() {
    this.activeModal.close();
  }

}
