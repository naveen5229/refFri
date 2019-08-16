import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketTrailsComponent } from '../../modals/ticket-trails/ticket-trails.component';

@Component({
  selector: 'tickets-all',
  templateUrl: './tickets-all.component.html',
  styleUrls: ['./tickets-all.component.scss', '../pages.component.css']
})
export class TicketsAllComponent implements OnInit {

  status = 0;
  showMsg = false;


  allClaimTickets = [];
  allClaimTicketGroups = [];
  allClaimDrivers = [];

  allOpenTickets = [];
  allOpenTicketGroups = [];
  allOpenDrivers = [];

  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getAllOpenTickets();
    this.getAllClaimTickets();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {

  }

  refresh() {
    this.getAllOpenTickets();
    this.getAllClaimTickets();
  }


  getAllClaimTickets() {
    ++this.common.loading;
    let aduserid = this.user._details.id;
    this.api.get('FoTickets/getAllClaimTickets?aduserid=' + aduserid, {})
      .subscribe(res => {
        --this.common.loading;
        console.log(res);
        this.allClaimTickets = res['data'];
        this.allClaimTicketGroups = _.groupBy(res['data'], 'regno');
        console.log('allClaimTicketGroups', this.allClaimTicketGroups);
        this.allClaimDrivers = Object.keys(this.allClaimTicketGroups);
        console.log('keys', this.allClaimDrivers);

      }, err => {
        --this.common.loading;
        console.error(err);
      });
  }

  getAllOpenTickets() {
    ++this.common.loading;
    let aduserid = this.user._details.id;
    this.api.get('FoTickets/getAllOpenTickets?aduserid=' + aduserid, {})
      .subscribe(res => {
        --this.common.loading;
        console.log(res);
        this.allOpenTickets = res['data'];
        this.allOpenTicketGroups = _.groupBy(res['data'], 'regno');
        console.log('allOpenTicketGroups', this.allOpenTicketGroups);
        this.allOpenDrivers = Object.keys(this.allOpenTicketGroups);
        console.log('keys', this.allOpenDrivers);
        this.showMsg = true;
      }, err => {
        --this.common.loading;
        console.error(err);
      });
  }


  // showDetails(notification) {
  //   this.navCtrl.push('NotificationDetailsPage', { notification: notification });
  // }


  showTrailList(ticket) {
    ++this.common.loading;

    this.api.get('FoTickets/getTrailLists?ticket_id=' + ticket.ticket_id)
      .subscribe(res => {
        console.log(res);
        --this.common.loading;

        let data = [];
        res['data'].map((trail, index) => {
          data.push([index, trail.employeename, trail.spent_time, trail.status]);
        });

        this.common.params = { title: 'Trail List', headings: ["#", "Employee Name", "Spent Time", "Status"], data };
        this.modalService.open(TicketTrailsComponent, { size: 'lg', container: 'nb-layout' });

      }, err => {
        --this.common.loading;
        console.log(err);
        this.common.showError();
      });
  }

  forwardClaimTickets(driver) {
    console.log('Get Data');
    let tickets = [];
    this.allClaimTicketGroups[driver].map(ticket => {
      tickets.push({
        ticketId: ticket.ticket_id,
        msg: ticket.msg
      });
    });
    // let modal = this.modalCtrl.create('ForwardTicketPage', { tickets: tickets, type: 'multiple' });
    // modal.present();
  }
  test(event) {
    console.log("Event", event);
  }
}
