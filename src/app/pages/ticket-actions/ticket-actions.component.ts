import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuyTimeComponent } from '../../modals/buy-time/buy-time.component';
import { TicketTrailsComponent } from '../../modals/ticket-trails/ticket-trails.component';
import { ReminderComponent } from '../../modals/reminder/reminder.component';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';

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
    private modalService: NgbModal,
    public api: ApiService) {
  }

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
    this.modalService.open(BuyTimeComponent, { size: 'lg', container: 'nb-layout' });

  }

  forwardTicket() {
    // console.log('Get Data');
    // let modal = this.modalCtrl.create('ForwardTicketPage', { ticketId: this.notification.ticket_id, fo_ticket_allocation_id: this.notification.fo_ticket_allocation_id, msg: this.ticketInfo.msg });
    // modal.onDidDismiss(data => {
    //   if (data.response) {
    //     this.navCtrl.pop();
    //   }
    // })
    // modal.present();
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
    this.modalService.open(TicketTrailsComponent, { size: 'lg', container: 'nb-layout' });
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
    // const prompt = this.alertCtrl.create({
    //   title: 'Remark',
    //   inputs: [
    //     {
    //       name: 'remark',
    //       placeholder: 'Enter Remark'
    //     },
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       handler: data => {
    //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: 'Save',
    //       handler: data => {
    //         console.log('Saved clicked');
    //         if (!data.remark && status == -5) {
    //           this.common.showToast('Remark is mandatory in cant do');
    //           this.getRemark(status);
    //           return;
    //         }
    //         this.updateNotificationStatus(status, data.remark);
    //       }
    //     }
    //   ]
    // });
    // prompt.present();
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
      }, err => {
        this.common.loading--;
        console.log(err);
        this.common.showError();
      });
  }


  commentPrompt() {

    console.log('Test');
    this.common.params = { title: 'Remarks ' };
    const activeModal = this.modalService.open(RemarkModalComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    console.log('Test');
    activeModal.result.then(data => {
      console.log('Data: ', data);
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
    this.modalService.open(ReminderComponent, { size: 'lg', container: 'nb-layout' });
  }


}
