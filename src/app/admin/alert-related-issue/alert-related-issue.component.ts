import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ViewListComponent } from '../../modals/view-list/view-list.component';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';


import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'alert-related-issue',
  templateUrl: './alert-related-issue.component.html',
  styleUrls: ['./alert-related-issue.component.scss', '../../pages/pages.component.css']
})
export class AlertRelatedIssueComponent implements OnInit {
  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 30));
  missingIndusrtyData = [];
  ticketsData = [];
  missing = 0;
  backlog = 0;
  tickets = 1;
  foid = null;
  isFo = "true";
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
    private modalService: NgbModal,
    public user: UserService) {
    this.common.refresh = this.refresh.bind(this);
    this.foid = this.user._customer.id;
    console.log("foId", this.foid);

    this.ticket();
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {
    this.ticket();
  }

  ticket() {
    let startTime = this.common.dateFormatter(this.startDate);
    let endTime = this.common.dateFormatter(this.endDate);
    const params = "startDate=" + startTime + "&endDate=" + endTime + "&isFo=" + this.isFo;
    this.common.loading++;
    this.api.get('MissingIndustry?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.ticketsData = res['data'] || [];
        this.ticketsData.length ? this.setTable() : this.resetTable();
        console.log("data:", this.ticketsData);
        if (this.ticketsData) {
          this.tickets = 1;
          this.backlog = 0;
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  resetTable() {
    this.table.data = {
      headings: {},
      columns: []
    };
  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(),
      columns: this.getTableColumns()
    };
    return true;
  }


  generateHeadings() {
    let headings = {};
    for (var key in this.ticketsData[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: key, placeholder: this.formatTitle(key) };
      }
    }
    return headings;
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
    this.ticketsData.map(ticket => {
      let column = {};
      for (let key in this.generateHeadings()) {
        if (key == 'Action') {
          column[key] = {
            value: "",
            isHTML: false,
            action: null,
            icons: this.actionIcons(ticket)
          };
        } else {
          column[key] = { value: ticket[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    })

    return columns;
  }

  actionIcons(ticket) {
    let icons = [
      {
        class: 'fa fa-pencil-alt mr-3',
        action: this.enterTicket.bind(this, ticket),
      },

    ];

    return icons;
  }




  enterTicket(issue) {
    console.log("Issue :", issue);
    let result;
    let params = {
      tblRefId: 7,
      tblRowId: issue._vid
    };
    console.log("params", params);
    this.common.loading++;
    this.api.post('TicketActivityManagment/insertTicketActivity', params)
      .subscribe(res => {
        this.common.loading--;
        result = res;
        console.log(result);
        if (!result['success']) {
          // alert(result.msg);
          this.common.showToast(res['msg']);
          return false;
        }
        else {
          this.openChangeStatusModal(issue);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  openChangeStatusModal(issue) {
    let ltime = new Date(issue.addtime);
    let subtractLTime = new Date(ltime.setHours(ltime.getHours() - 48));
    let latch_time = this.common.dateFormatter(subtractLTime);
    let VehicleStatusData = {
      id: issue._id,
      vehicle_id: issue._vid,
      tTime: issue._ttime,
      suggest: null,
      latch_time: issue._ltime,
      status: 2,
      remark: issue.remark
    }
    console.log("missing open data ", VehicleStatusData);
    this.common.ref_page = 'ari';
    this.common.params = VehicleStatusData;
    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      console.log("after data chnage ");
      if (!this.foid) {
        this.ticket();
      }
      let newData = [];
      for (const ticket of this.ticketsData) {
        if (ticket._id != issue._id) {
          newData.push(ticket);
        }
      }
      this.ticketsData = newData;
      this.resetTable();
      this.setTable();
      this.exitTicket(VehicleStatusData);
    });
  }

  exitTicket(missingIssue) {
    let result;
    var params = {
      tblRefId: 7,
      tblRowId: missingIssue.vehicle_id
    };
    console.log("params", params);
    this.api.post('TicketActivityManagment/updateActivityEndTime', params)
      .subscribe(res => {
        result = res
        console.log(result);
        if (!result.sucess) {
          //  alert(result.msg);
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
