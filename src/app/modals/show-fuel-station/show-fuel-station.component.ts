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
  selector: 'show-fuel-station',
  templateUrl: './show-fuel-station.component.html',
  styleUrls: ['./show-fuel-station.component.scss']
})
export class ShowFuelStationComponent implements OnInit {

  fuelStation = [];
  table = null;
  showTable = false;
  constructor(private activeModal: NgbActiveModal, public common: CommonService,
    private datePipe: DatePipe,
    public api: ApiService,
    private modalService: NgbModal) {
    //this.common.handleModalSize('class', 'modal-lg', '1200');
    this.getFuelStation();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  getFuelStation() {
    this.common.api.get('Fuel/getFuelStation', null)
      .subscribe(res => {
        console.log('res', res['data']);
        if (res['data'].length) {
          this.fuelStation = res['data'];
          this.showTable = true;
        } else {
          this.common.showToast('No Record Found !!');
        }
        this.table = this.setTable();

      }, err => {
        this.common.showError();
      })
  }

  setTable() {
    let headings = {
      Name: { title: 'Name', placeholder: 'Name' },
      Location: { title: 'Location', placeholder: 'Location' },
      SiteId: { title: 'SiteId', placeholder: 'SiteId' },
      count: { title: 'count', placeholder: 'count' },
      // Lat: { title: 'lat', placeholder: 'lat' },
      // Long: { title: 'long', placeholder: 'long' }
    };


    return {
      fuelStation: {
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
    this.fuelStation.map(R => {

      let column = {
        Name: { value: R.name },
        Location: { value: R.location },
        SiteId: { value: R.site_id },
        count: { value: R.count },
        // Lat: { value: R.lat },
        // Long: { value: R.long },
      };

      columns.push(column);

    });
    return columns;
  }


  closeModal() {
    this.activeModal.close();
  }

}
