import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { ChangeVehicleStatusByCustomerComponent } from '../../modals/change-vehicle-status-by-customer/change-vehicle-status-by-customer.component';

@Component({
  selector: 'tripissues',
  templateUrl: './tripissues.component.html',
  styleUrls: ['./tripissues.component.scss']
})
export class TripissuesComponent implements OnInit {

  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      pagination:true
    }
  };
  VehicleStatusAlerts =[];
  constructor(
    public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal,
    public user: UserService 
  ) {

    this.getVehicleStatusAlerts();
    this.common.refresh = this.refresh.bind(this);


  }

  ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.getVehicleStatusAlerts();
  }

  getVehicleStatusAlerts() {
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
        pagination:true
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
    // this.headings.push('Action');
    // this.table.data.headings['Action'] = { title: 'Action', placeholder: 'Action' };
    this.valobj = {};
    let columns = [];
    tableData.map(tbldt => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        if (this.headings[i] == 'Action') {
          this.valobj[this.headings[i]] = {
            value: '', isHTML: true, action: null,
            icons: this.actionIcons(tbldt)
          }
        } else if(this.headings[i] == 'Trip'){
          this.valobj[this.headings[i]] = {
            value: this.common.getTripStatusHTML(tbldt._trip_status_type, tbldt._showtripstart, tbldt._showtripend, tbldt._p_placement_type, tbldt._p_loc_name),
           
            isHTML: true,
          }
        }
        else {
          this.valobj[this.headings[i]] = { value: tbldt[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  actionIcons(data) {
    let icons = [{ class: 'fa fa-cog delete',
     action: this.openChangeStatusCustomerModal.bind(this, data)
     }];
    return icons;
  }
 

  

  openChangeStatusCustomerModal(vs) {
    let VehicleStatusData = {
      vehicle_id : vs._vid,
      latch_time : vs.latch_time,
      toTime : vs.ttime,
      suggest : 0,
      status : 1,
      fo_name : vs.group_name,
      regno : vs.vehicle_name,
      tripName : this.common.getTripStatusHTML(vs._trip_status_type, vs._showtripstart, vs._showtripend, vs._p_placement_type, vs._p_loc_name)     
    }
    console.log("VehicleStatusData", VehicleStatusData);
    this.common.params = VehicleStatusData;
    this.common.ref_page = 'vsc';
    const activeModal = this.modalService.open(ChangeVehicleStatusByCustomerComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      //console.log("data", data.respone);
       this.getVehicleStatusAlerts();
      this.exitTicket(VehicleStatusData);
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
          //alert(result.msg);
          return false;
        }
        else {
          
            this.openChangeStatusCustomerModal(VehicleStatusData);
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
          // alert(result.msg);
          this.getVehicleStatusAlerts();
          return false;
        }
        else {
          return true;
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

}
