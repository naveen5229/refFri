import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketForwardComponent } from '../ticket-forward/ticket-forward.component';
import { TicketTrailsComponent } from '../ticket-trails/ticket-trails.component';
import { ChangeVehicleStatusByCustomerComponent } from '../change-vehicle-status-by-customer/change-vehicle-status-by-customer.component';

@Component({
  selector: 'ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit {
  tickets = [];
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

  type = null;
  rowId = null;
  coulmnId = null;
  date = null;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal) {
      this.common.handleModalSize('class', 'modal-lg', '1400');
   if(this.common.params && this.common.params.ticketInfo){
     this.type = this.common.params.ticketInfo.type;
     this.rowId = this.common.params.ticketInfo.rowId;
     this.coulmnId = this.common.params.ticketInfo.columnId;
     this.date = this.common.params.ticketInfo.date;
     console.log("+++",this.type,this.rowId,this.coulmnId,this.date);
    this.getDetails();

   }

  }
  closeModal(isFatal) {
    this.activeModal.close({ response: isFatal });
  }

  ngOnInit() {
  }

 
  getDetails() {
    this.tickets = [];
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
   
    let params = "type=" + this.type +
      "&rowId=" + this.rowId +
      "&columnId=" + this.coulmnId+
      "&fromDate="+this.common.dateFormatter(this.date,"YYYYMMDD", false);
    console.log('params', params);
    ++this.common.loading;
    this.api.get('VehicleKpis/getTicketKpisDrillDown?' + params)
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res['data']);
        // this.vehicleId = -1;
        // this.tickets = res['data'];
        //this.tickets = JSON.parse(res['data']);
        this.tickets = res['data'];
        //this.table = this.setTable();
        if (this.tickets != null) {
          console.log('tickets', this.tickets);
          let first_rec = this.tickets[0];
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
        } else {
          this.common.showToast('No Record Found !!');
        }
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
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
    for (var i = 0; i < this.tickets.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        if (this.headings[j] == "Action" || this.headings[j] == "action") {
          this.valobj[this.headings[j]] = {
            value: '', isHTML: true, action: null,
            icons: this.actionIcons(this.tickets[i])
          }      
        }else if(this.headings[j] == "Trip" || this.headings[j] == "trip"){
          this.valobj[this.headings[j]] = {
            value: this.common.getTripStatusHTML(this.tickets[i]._trip_status_type, this.tickets[i]._showtripstart, this.tickets[i]._showtripend, this.tickets[i]._p_placement_type, this.tickets[i]._p_loc_name), isHTML: true, action: null,
          }
        }
         else {
          this.valobj[this.headings[j]] = { value: this.tickets[i][this.headings[j]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }

  actionIcons(ticket) {
    let icons = [];
    if(ticket['Action'].is_forward)
    icons.push({ class: 'fa fa-share icon', title : "Forward", action: this.forwardTicket.bind(this, ticket) })
    if(ticket['Action'].is_trail)
    icons.push({ class: 'fa fa-list-alt icon', title : "Trail", action: this.trailList.bind(this, ticket)  })
    if(ticket['Action'].is_vsc)
    icons.push({class: 'fa fa-chart-pie icon', title : "VSC", action: this.openChangeStatusCustomerModal.bind(this, ticket) } )
   
    return icons;
  }
  trailList(ticketInfo) {
    ++this.common.loading;
    this.api.get('FoTickets/getTrailLists?ticket_id=' + ticketInfo._ticket_id)
      .subscribe(res => {
        --this.common.loading;
        let trailList = res['data'];
        let type = 'trail';
        if (trailList) {
          console.log("DataTrail:", res['data']);
          let headers = ["#", "Employee Name", "Spent Time", "Status"];

          this.common.params = { trailList, headers, type };
          const activeModal = this.modalService.open(TicketTrailsComponent, { size: 'lg', container: 'nb-layout' });
          activeModal.componentInstance.modalHeader = 'Trails';
        } else {
          this.common.showError("No record found for this search criteria.")
        }
      }, err => {
        --this.common.loading;
        console.log(err);
        this.common.showError();
      });
  }

  forwardTicket(ticketInfo) {
    this.common.params = { title: 'Forward Ticket', ticketId: ticketInfo._ticket_id, fo_ticket_allocation_id:ticketInfo._fo_ticket_allocation_id, msg: ticketInfo._msg };
    const activeModal = this.modalService.open(TicketForwardComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getDetails();
      }
    });
  }

  
  openChangeStatusCustomerModal(vs) {
    let VehicleStatusData = {
      vehicle_id: vs._vid,
      latch_time: vs.latch_time,
      toTime: vs.ttime,
      suggest: 0,
      status: 1,
      fo_name: vs.group_name,
      regno: vs.vehicle_name,
      tripName: this.common.getTripStatusHTML(vs._trip_status_type, vs._showtripstart, vs._showtripend, vs._p_placement_type, vs._p_loc_name)
    }
    console.log("VehicleStatusData", VehicleStatusData);
    this.common.params = VehicleStatusData;
    this.common.ref_page = 'vsc';
    const activeModal = this.modalService.open(ChangeVehicleStatusByCustomerComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      console.log("data", data.respone);
      // this.getVehicleStatusAlerts();
      // this.exitTicket(vs);
    });
  }
  }
