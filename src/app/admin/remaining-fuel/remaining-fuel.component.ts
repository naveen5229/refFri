import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';

import { DatePipe } from '@angular/common';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'remaining-fuel',
  templateUrl: './remaining-fuel.component.html',
  styleUrls: ['./remaining-fuel.component.scss']
})
export class RemainingFuelComponent implements OnInit {

  remainingFuel = [];
  table = null;
  // showTable = false;

  constructor(public common: CommonService,
    private datePipe: DatePipe,
    public api: ApiService,
    private modalService: NgbModal) {
    this.getRemainingFuel();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {
    console.log('Refresh');
    this.getRemainingFuel();
  }
  getRemainingFuel() {
    let params = {};
    this.common.api.post('Fuel/getRemaningFuels', params)
      .subscribe(res => {

        if (res['data'].length) {
          this.remainingFuel = res['data'];
          // this.showTable = true;
        } else {
          this.common.showToast('No Record Found !!');
        }
        console.log('res', res['data']);
        this.table = this.setTable();

      }, err => {
        this.common.showError();
      })
  }

  setTable() {
    let headings = {
      RegNO: { title: 'RegNO', placeholder: 'RegNO' },
      startdate: { title: 'startdate', placeholder: 'Start Date' },
      TotalDistance: { title: 'TotalDistance', placeholder: 'Total Distance' },
      LoadingDistance: { title: 'LoadingDistance', placeholder: 'Loading Distance' },
      UnloadingDistance: { title: 'UnloadingDistance', placeholder: 'Unloading Distance' },
      RemainingFuel: { title: 'RemainingFuel', placeholder: 'Remaining Fuel' },

      // Lat: { title: 'lat', placeholder: 'lat' },
      // Long: { title: 'long', placeholder: 'long' }
    };


    return {
      remainingFuel: {
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
    this.remainingFuel.map(R => {

      let column = {
        RegNO: { value: R.reg_number },
        startdate: { value: this.datePipe.transform(R.startdate, 'dd MMM HH:mm a') },
        TotalDistance: { value: R.total_distance },
        LoadingDistance: { value: R.loading_distance },
        UnloadingDistance: { value: R.unloading_distance },
        RemainingFuel: { value: R.rem_fuel },
        // Lat: { value: R.lat },
        // Long: { value: R.long },
      };

      columns.push(column);

    });
    return columns;
  }

}
