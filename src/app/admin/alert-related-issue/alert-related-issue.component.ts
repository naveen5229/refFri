import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ViewListComponent } from '../../modals/view-list/view-list.component';
import { ResolveMissingIndustryComponent } from '../../modals/resolve-missing-industry/resolve-missing-industry.component';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


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
  table = null;
  foid = null;


  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal, ) {
    this.common.refresh = this.refresh.bind(this);
    this.ticket();
  }

  ngOnInit() {
  }
  refresh() {
    console.log('Refresh');
    this.ticket();
  }
  selectFoUser(user) {
    console.log("user", user);
    this.foid = user.id;
    this.ticket();
  }

  ticket() {
    this.common.loading++;
    this.api.get('MissingIndustry' + (this.foid ? ('?foid=' + this.foid) : ''))
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.ticketsData = res['data'];
        this.table = this.setTable();
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

  setTable() {
    let headings = {
      vehicleNumber: { title: 'Vehicle Number', placeholder: 'Vehicle No' },
      regno: { title: 'Regno ', placeholder: 'Regno ' },
      ltime: { title: 'Ltime', placeholder: 'Ltime' },
      ttime: { title: 'Ttime', placeholder: 'Ttime' },
      disa: { title: 'Disa', placeholder: 'Disa' },
      dis: { title: 'Dis', placeholder: 'Dis' },
      ratio: { title: 'Ratio', placeholder: 'Ratio' },
      foname: { title: 'Fo Name', placeholder: 'Fo Name' },
      holdBy: { title: 'Hold By', placeholder: 'Hold By' },
      remark: { title: 'Remark', placeholder: 'Remark' },
      action: { title: 'Action', placeholder: 'Action', hideSearch: true, class: 'text-dark' },
    };


    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "auto"
      }
    }
  }

  getTableColumns() {
    let columns = [];
    this.ticketsData.map(ticket => {

      let column = {
        vehicleNumber: { value: ticket.vehicle_id },
        regno: { value: ticket.regno },
        ltime: { value: ticket.ltime, date: 'dd MMM HH:mm' },
        ttime: { value: ticket.ttime, date: 'dd MMM HH:mm' },
        disa: { value: ticket.disa },
        dis: { value: ticket.dis },
        ratio: { value: ticket.ratio },
        foname: { value: ticket.fo_name },
        holdBy: { value: ticket.hold_by },
        remark: { value: ticket.remark },
        action: { value: `<i class="fa fa-pencil-alt"></i>`, isHTML: true, action: this.enterTicket.bind(this, ticket), class: 'icon text-center del' },
      };


      columns.push(column);
    });
    return columns;
  }



  enterTicket(issue) {
    console.log("Issue :", issue);
    let result;
    let params = {
      tblRefId: 7,
      tblRowId: issue.vehicle_id
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
      id: issue.id,
      vehicle_id: issue.vehicle_id,
      tTime: issue.ttime,
      suggest: null,
      latch_time: issue.ltime,
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
        if (ticket.id != issue.id) {
          newData.push(ticket);
        }
      }
      this.ticketsData = newData;
      this.table = null;
      this.table = this.setTable();
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
