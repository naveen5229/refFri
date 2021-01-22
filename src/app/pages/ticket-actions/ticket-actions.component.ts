import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuyTimeComponent } from '../../modals/buy-time/buy-time.component';
import { TicketTrailsComponent } from '../../modals/ticket-trails/ticket-trails.component';
import { ReminderComponent } from '../../modals/reminder/reminder.component';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';
import { Router } from '@angular/router';
import { TicketForwardComponent } from '../../modals/ticket-forward/ticket-forward.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'ticket-actions',
  templateUrl: './ticket-actions.component.html',
  styleUrls: ['./ticket-actions.component.scss']
})
export class TicketActionsComponent implements OnInit {
  @Input() ticketInfo: any;
  @Input() notification: any;

  constructor(
    public common: CommonService,
    public user: UserService,
    public router: Router,
    private modalService: NgbModal,
    public api: ApiService) {
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  getExtraTime() {
    // let modal = this.modalCtrl.create('BuyTimePage', { ticketId: this.notification.fo_ticket_allocation_id });
    // modal.onDidDismiss(data => {
    //   if (data.response) {
    //     // this.getNotificationDetails();
    //     this.navCtrl.pop();
    //   }
    // });
    // modal.present();
    this.common.params = { ticketId: this.notification.fo_ticket_allocation_id };
    this.modalService.open(BuyTimeComponent, { size: 'lg', container: 'nb-layout',backdrop:'static' });

  }

  forwardTicket() {
    this.common.params = { title: 'Forward Ticket', ticketId: this.notification.ticket_id, fo_ticket_allocation_id: this.notification.fo_ticket_allocation_id, msg: this.ticketInfo.msg };
    const activeModal = this.modalService.open(TicketForwardComponent, { size: 'sm', container: 'nb-layout', backdrop:'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.router.navigate(['/pages/tickets']);
      }
    });
  }

  getTrailList() {
    this.common.loading++;
    this.api.get('FoTickets/getTrailLists?ticket_id=' + this.notification.ticket_id)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        let data = [];
        res['data'].map((trail, index) => {
          data.push([index, trail.employeename, trail.spent_time, trail.status]);
        });
        this.showList('Trail List', ["#", "Employee Name", "Spent Time", "Status"], data);
      }, err => {
        this.common.loading--;
        console.log(err);
        this.common.showError();
      });
  }

  showList(title, headings, data) {
    this.common.params = { title, headings, data };
    this.modalService.open(TicketTrailsComponent, { size: 'lg', container: 'nb-layout',backdrop:'static' });
  }

  getComments() {
    this.common.loading++;
    this.api.get('FoTickets/getTicketComments?ticket_id=' + this.notification.ticket_id)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;

        if (!res['data'].length) {
          this.common.showToast("No Comment Found!");
          return;
        }
        let data = [];
        res['data'].map((comment, index) => {
          data.push([index, comment.employeename, comment.status, comment.comment, comment.addtime]);
        });
        this.showList('Trail List', ["#", "Name", "Status", "Comment", "Time"], data);
      }, err => {
        this.common.loading--;
        console.log(err);
        this.common.showError();
      });
  }

  getRemark(status) {
    this.common.params = { title: 'Remarks ', isMandatory: status == 5 ? false : true };
    const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.updateNotificationStatus(status, data.remark);
      }
    });
  }

  updateNotificationStatus(status, remark) {
    let params = {
      ticket_id: this.notification.ticket_id,
      fo_ticket_allocation_id: this.notification.fo_ticket_allocation_id,
      status: status,
      aduserid: this.user._details.id,
      remark: remark,
      msg: this.ticketInfo.msg
    };
    console.log(params);
    this.common.loading++;
    this.api.post('FoTickets/updateTicketStatus', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.common.showToast(res['msg']);
        this.router.navigate(['/pages/tickets']);
      }, err => {
        this.common.loading--;
        console.log(err);
        this.common.showError();
      });
  }


  commentPrompt() {
    this.common.params = { title: 'Remarks ' };
    const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.addComment(data.remark)
      }
    });
  }

  addComment(comment) {
    let params = {
      ticket_id: this.notification.ticket_id,
      aduserid: this.user._details.id,
      comment: comment,
      status: this.notification.status
    };
    console.log(params);
    this.common.loading++;
    this.api.post('FoTickets/setTicketComments', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.common.showToast(res['msg']);
      }, err => {
        this.common.loading--;
        console.log(err);
        this.common.showError();
      });
  }

  setReminder() {
    this.common.params = { fo_ticket_allocation_id: this.notification.fo_ticket_allocation_id };
    this.modalService.open(ReminderComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
}
