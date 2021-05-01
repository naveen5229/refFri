import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleTripUpdateComponent } from '../../modals/vehicle-trip-update/vehicle-trip-update.component';
import { RouteMapperComponent } from '../../modals/route-mapper/route-mapper.component';
import { AddShortTargetComponent } from '../../modals/add-short-target/add-short-target.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'placement-delay-faults',
  templateUrl: './placement-delay-faults.component.html',
  styleUrls: ['./placement-delay-faults.component.scss']
})
export class PlacementDelayFaultsComponent implements OnInit {

  showTable = false;

  delayFaults = [];
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
    this.getDelayFaults();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {

    this.getDelayFaults();
  }

  getDelayFaults() {

    this.delayFaults = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    //  console.log('params: ', params);
    this.common.loading++;
    this.api.get('Placement/placementDelayFaults?')
      .subscribe(res => {
        this.common.loading--;
        this.delayFaults = JSON.parse(res['data'][0].fn_placements_getfaults);
        if (this.delayFaults != null) {
          console.log('delayFaults', this.delayFaults);
          let first_rec = this.delayFaults[0];
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
    for (var i = 0; i < this.delayFaults.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        if (this.headings[j] == "endpt") {
          console.log("headings[j]", this.headings[j]);
          this.valobj[this.headings[j]] = { value: this.delayFaults[i][this.headings[j]], class: 'blue', action: this.openPlacementModal.bind(this, this.delayFaults[i]) };
        }
        else if (this.headings[j] == "%Dist") {
          console.log("headings[j]", this.headings[j]);
          this.valobj[this.headings[j]] = { value: this.delayFaults[i][this.headings[j]], class: 'blue', action: this.openRouteMapper.bind(this, this.delayFaults[i]) };
        }
        else if (this.headings[j] == "vehicle") {
          console.log("headings[j]", this.headings[j]);
          this.valobj[this.headings[j]] = { value: this.delayFaults[i][this.headings[j]], class: 'blue', action: this.addShortTarget.bind(this, this.delayFaults[i]) };
        }
        else {
          this.valobj[this.headings[j]] = { value: this.delayFaults[i][this.headings[j]], class: 'black', action: '' };
        }

      }
      this.valobj['style'] = { background: this.delayFaults[i]._rowcolor };
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

  openPlacementModal(placement) {
    console.log("openPlacementModal", placement);
    let tripDetails = {
      vehicleId: placement._vid,
      siteId: placement._site_id ? placement._site_id : -1
    }
    this.common.params = { tripDetils: tripDetails, ref_page: 'placements' };
    console.log("vehicleTrip", tripDetails);
    const activeModal = this.modalService.open(VehicleTripUpdateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      //console.log("data", data.respone);

    });
  }

  openRouteMapper(defaultFault) {
    console.log("defaultFault", defaultFault);
    let fromTime = this.common.dateFormatter(defaultFault._start_time);
    let toTime = this.common.dateFormatter(new Date());
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = {
      vehicleId: defaultFault._vid,
      vehicleRegNo: defaultFault.vehicle,
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
  addShortTarget(target) {
    this.common.params = {
      vehicleId: target._vid,
      vehicleRegNo: target.vehicle

    };

    const activeModal = this.modalService.open(AddShortTargetComponent, {
      size: "sm",
      container: "nb-layout"
    });
  }
}

