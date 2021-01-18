import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { ChangeVehicleStatusByCustomerComponent } from '../../modals/change-vehicle-status-by-customer/change-vehicle-status-by-customer.component';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'tripissues',
  templateUrl: './tripissues.component.html',
  styleUrls: ['./tripissues.component.scss']
})
export class TripissuesComponent implements OnInit {
  autoPlay = 'forward';
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      pagination: true
    }
  };
  VehicleStatusAlerts = [];
  filteredIndexes = [];
  firstModal: any;
  secondModal: any;
  activeIndex: number = -1;
  modalRef: any;

  constructor(
    public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal,
    public user: UserService) {
    this.getVehicleStatusAlerts();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    this.getVehicleStatusAlerts();
  }

  getVehicleStatusAlerts() {
    this.filteredIndexes = [];
    this.modalRef = null;
    this.activeIndex = -1;
    this.common.loading++;
    this.api.get('HaltOperations/getFoAdminWiseTripIssues?')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: ', res['data']);
        this.VehicleStatusAlerts = res['data'];
        this.gettingTableHeader(this.VehicleStatusAlerts);
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  gettingTableHeader(tableData) {
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true,
        pagination: true
      }
    };

    let first_rec = tableData[0];
    for (var key in first_rec) {
      if (key.charAt(0) != "_") {
        this.headings.push(key);
        let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        this.table.data.headings[key] = headerObj;
      }
    }

    this.table.data.columns = this.getTableColumns(tableData);
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  getTableColumns(tableData) {
    this.valobj = {};
    let columns = [];
    tableData.map((tbldt, index) => {
      this.valobj = {
        class: 'xyz',
        index
      };
      for (let i = 0; i < this.headings.length; i++) {
        if (this.headings[i] == 'Action') {
          this.valobj[this.headings[i]] = {
            value: '', isHTML: true, action: null,
            icons: this.actionIcons(tbldt, index)
          }
        } else if (this.headings[i] == 'Trip') {
          this.valobj[this.headings[i]] = {
            value: this.common.getTripStatusHTML(tbldt._trip_status_type, tbldt._showtripstart, tbldt._showtripend, tbldt._p_placement_type, tbldt._p_loc_name),
            isHTML: true,
          }
        } else {
          this.valobj[this.headings[i]] = { value: tbldt[this.headings[i]], class: 'black', action: '' };
        }
      }
      if (tbldt['_class']) {
        this.valobj['class'] = "selected";
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  actionIcons(data, index) {
    let icons = [{
      class: 'fa fa-cog delete',
      action: this.handleIconAction.bind(this, data, index)
    }];
    return icons;
  }

  handleIconAction(tripIssue, index) {
    this.openChangeStatusCustomerModal(tripIssue, index);
    //this.modalOpens(index);
  }

  modalOpens(index) {
    if (this.autoPlay == 'forward' && index < this.VehicleStatusAlerts.length) {
      if (this.filteredIndexes.length) {
        let nextIndex = this.filteredIndexes[this.filteredIndexes.indexOf(index) + 1];
        console.log('nextInex', nextIndex);
        if (nextIndex) {
          this.openChangeStatusCustomerModal(this.VehicleStatusAlerts[nextIndex], nextIndex);
        }
      } else {
        this.openChangeStatusCustomerModal(this.VehicleStatusAlerts[index + 1], index + 1);
      }
    } else if (this.autoPlay == 'backward' && index >= 0) {
      if (this.filteredIndexes.length) {
        let previousIndex = this.filteredIndexes[this.filteredIndexes.indexOf(index) - 1];
        console.log('previousIndex', previousIndex);
        if (previousIndex) {
          this.openChangeStatusCustomerModal(this.VehicleStatusAlerts[previousIndex], previousIndex);
        }
      } else {
        this.openChangeStatusCustomerModal(this.VehicleStatusAlerts[index - 1], index - 1);
      }
    }
  }


  openChangeStatusCustomerModal(vs, index) {
    this.VehicleStatusAlerts[index]['_class'] = 'selected';
    this.table.data.columns[index].class = 'selected';
    
    let xClass = this.modalRef ? 'xhide-trip-issue' : '';
    this.common.ref_page = 'vsc';
    this.common.params = {
      loader: xClass ? false : true,
      vehicle_id: vs._vid,
      latch_time: vs.latch_time,
      toTime: vs.ttime,
      suggest: 0,
      status: 1,
      fo_name: vs.group_name,
      regno: vs.vehicle_name,
      tripName: this.common.getTripStatusHTML(vs._trip_status_type, vs._showtripstart, vs._showtripend, vs._p_placement_type, vs._p_loc_name)
    };

    let component = this.user._loggedInBy != "admin" ? ChangeVehicleStatusByCustomerComponent : ChangeVehicleStatusComponent;
    let activeModal = this.modalService.open(
      component, {
      size: 'lg',
      container: 'nb-layout',
      windowClass: xClass,
      backdropClass: xClass
    });

    this.activeIndex = index;
    // this.modalRef = activeModal;

    activeModal.result.then(data => {
      try {
        document.querySelector('.xhide-trip-issue').classList.remove('xhide-trip-issue');
        document.querySelector('.xhide-trip-issue').classList.remove('xhide-trip-issue');
      } catch (e) {
        // console.log('There is some error in removing class name:', e);
      }

      if (data.response && index < this.VehicleStatusAlerts.length && index >= 0) {
        this.modalOpens(this.activeIndex);
      } else {
        this.modalRef = null;
      }
    });

  }

  enterTicket(VehicleStatusData) {
    let result;
    let params = {
      tblRefId: 1,
      tblRowId: VehicleStatusData.vehicle_id
    };
    console.log("params", params);
    this.common.loading++;
    this.api.post('TicketActivityManagment/insertTicketActivity', params)
      .subscribe(res => {
        this.common.loading--;
        result = res;
        console.log(result);
        if (!result['success']) {
          return false;
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  exitTicket(VehicleStatusData) {
    let result;
    var params = {
      tblRefId: 1,
      tblRowId: VehicleStatusData.vehicle_id
    };
    console.log("params", params);
    this.common.loading++;
    this.api.post('TicketActivityManagment/updateActivityEndTime', params)
      .subscribe(res => {
        this.common.loading--;
        result = res
        console.log(result);
        if (!result.sucess) {
          return false;
        } else {
          return true;
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  jrxFiltered(event) {
    console.log('event:', event);
    this.filteredIndexes = event.map(e => e.index);
    console.log('this.filteredIndexes:', this.filteredIndexes)
  }

}
