import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketForwardComponent } from '../ticket-forward/ticket-forward.component';
import { TicketTrailsComponent } from '../ticket-trails/ticket-trails.component';

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
     console.log("+++",this.type,this.rowId,this.coulmnId);
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
      "&columnId=" + this.coulmnId;
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
console.log("this.headings[j]",this.headings[j]);
        if (this.headings[j] == "Action" || this.headings[j] == "action") {
          this.valobj[this.headings[j]] = {
            value: '', isHTML: true, action: null,
            icons: this.actionIcons(this.tickets[i])
          }      
        } else {
          this.valobj[this.headings[j]] = { value: this.tickets[i][this.headings[j]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }

  actionIcons(ticket) {
    let icons = [
      { class: 'fa fa-share', action: this.forwardTicket.bind(this, ticket) },
      { class: 'fa fa-list-alt', action: this.trailList.bind(this, ticket) },
    ];
   
    return icons;
  }
  trailList(ticketInfo) {
    ++this.common.loading;
    this.api.get('FoTickets/getTrailLists?ticket_id=' + ticketInfo._ticket_id)
      .subscribe(res => {
        console.log(res);
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
  }
