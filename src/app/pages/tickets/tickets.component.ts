import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { TicketTrailsComponent } from '../../modals/ticket-trails/ticket-trails.component';
import { TicketInfoComponent } from '../../modals/ticket-info/ticket-info.component';

@Component({
  selector: 'tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss','../pages.component.css']
})
export class TicketsComponent implements OnInit {
  notifications = [];
  status = 0;
  newTickets = [];
  openTickets = [];
  showMsg = false;
  tickets = [];
  countDownFlag = false;

  claimTicketGroups = [];
  claimDrivers = [];
  dis_all = 'new';
  constructor(
    public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    public user: UserService) {
    this.status = localStorage.getItem('STATUS') ? parseInt(localStorage.getItem('STATUS')) : 0;
    console.log('Status:', this.status);
    localStorage.removeItem('STATUS');

    this.getNotifications();
    this.getClaimTickets();

    this.countDownFlag = true;
    this.common.refresh = this.refresh.bind(this);
    setTimeout(this.countDown.bind(this), 30000);
  }

  ngOnInit() {

  }

  refresh() {
    this.getNotifications();
    this.getClaimTickets();
  }

  getNotifications() {
    this.newTickets = [];
    ++this.common.loading;
    let aduserid = this.user._details.id;;
    this.api.get('FoTickets/getPendingTicketList?aduserid=' + aduserid, {})
      .subscribe(res => {
        --this.common.loading;
        console.log(res);
        this.notifications = res['data'] || [];
        this.showMsg = true;
        this.newTickets = [];
        this.openTickets = [];
        this.notifications.map(ticket => {
          if (ticket.status == 0) {
            this.newTickets.push(ticket);
          } else if (ticket.status == 2) {
            this.openTickets.push(ticket);
          }
        });
        this.setTab();
      }, err => {
        --this.common.loading;
        console.error(err);
      });
  }

  getClaimTickets() {
    ++this.common.loading;
    // loader.present();
    let aduserid = this.user._details.id;
    this.api.get('FoTickets/getClaimTickets?aduserid=' + aduserid, {})
      .subscribe(res => {
        --this.common.loading;
        console.log(res);
        if (res['success']) {
          this.tickets = res['data'] ? res['data']: [];
          this.setTab();
        }
      }, err => {
        --this.common.loading;
        console.error(err);
      });
  }

  setTab(){
    this.dis_all = this.newTickets.length>0? 'new' : this.tickets.length>0 ? 'claim' :this.openTickets.length>0?'open':'new'
  }

  claimTicket(ticket) {
    let msg = 'Are you sure to claim this ticket?';

    if (confirm(msg)) {
      this.sendClaimRequest(ticket);
    }
  }

  sendClaimRequest(ticket) {
    let params = {
      ticket_id: ticket.ticket_id,
      msg: ticket.msg,
      aduserid: this.user._details.id
    };
    console.log('Params', params);
    this.common.loading++;
    this.api.post('FoTickets/setClaimInfo', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res);
        this.getNotifications();
        this.getClaimTickets();
      }, err => {
        --this.common.loading;
        console.error(err);
        this.common.showError();
      });
  }

  updateNotificationStatus(id, status, msg, fo_ticket_allocation_id) {
    let params = {
      ticket_id: id,
      fo_ticket_allocation_id: fo_ticket_allocation_id,
      status: status,
      aduserid: this.user._details.id,
      remark: '',
      msg: msg
    };

    ++this.common.loading;
    console.log('Params:', params);
    this.api.post('FoTickets/updateTicketStatus', params)
      .subscribe(res => {
        console.log(res);
        this.common.showToast(res['msg']);
        --this.common.loading;
        this.getNotifications();
      }, err => {
        console.log(err);
        this.common.showError();
        --this.common.loading;
      });

  }



  countDown() {
    if (!this.countDownFlag) return;
    let indexList = [];
    this.notifications.map((notification, index) => {
      notification.remaining_time - 30;
      if (notification.remaining_time < 60) {
        notification.cc = 'red';
      }
      if (notification.remaining_time < 0) {
        indexList.push(index);
      }
    });
    indexList.map(index => {
      // this.notifications.splice(index, 1);
    });
    setTimeout(this.countDown.bind(this), 30000);
  }

  ticketCount(status) {
    let count = 0;
    this.notifications.map(notification => {
      if (notification.status === status) {
        count++;
      }
    });
    return count;
  }

  showTrailList(ticket) {
    ++this.common.loading;

    this.api.get('FoTickets/getTrailLists?ticket_id=' + ticket.ticket_id)
      .subscribe(res => {
        console.log(res);
        --this.common.loading;
        let trailList = res['data'];
        if(trailList){
        let type="trail"
        console.log("DataTrail:",res['data']);
        let headers = ["#", "Employee Name", "Spent Time", "Status"];
        this.common.params = { trailList, headers,type };
        const activeModal = this.modalService.open(TicketTrailsComponent, { size: 'lg', container: 'nb-layout' });
        activeModal.componentInstance.modalHeader = 'Trails';
        }else{
          this.common.showError("No record found for this search criteria.")
        }
      }, err => {
        --this.common.loading;
        console.log(err);
        this.common.showError();
      });
  }

  showDetails(notification) {
    console.log(notification)
    // this.common.renderPage(notification.pri_type, notification.sec_type1, notification.sec_type2, notification);
  }

oprnInfoModel(tkt){
  console.log("ticket",tkt);
  let ticket= {
    id : tkt.ticket_id,
    priType : tkt.pri_type
  }
  this.common.params = { ticket :ticket};
  const activeModal = this.modalService.open(TicketInfoComponent, { size: 'lg', container: 'nb-layout' });
  activeModal.result.then(data => {
    console.log("data",data);
    if(data.response)
    this.refresh();
});
}

}
