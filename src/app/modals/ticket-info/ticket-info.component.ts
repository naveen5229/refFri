import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HtmlTagDefinition } from '@angular/compiler';
import { LocationMarkerComponent } from '../location-marker/location-marker.component';
import { ReminderComponent } from '../reminder/reminder.component';
import { BuyTimeComponent } from '../buy-time/buy-time.component';
import { GenericSuggestionComponent } from '../generic-modals/generic-suggestion/generic-suggestion.component';
import { TicketForwardComponent } from '../ticket-forward/ticket-forward.component';
import { TicketTrailsComponent } from '../ticket-trails/ticket-trails.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'ticket-info',
  templateUrl: './ticket-info.component.html',
  styleUrls: ['./ticket-info.component.scss']
})
export class TicketInfoComponent implements OnInit {

  numbers = [];
  data = [];
  title = 'Ticket Details';
  ticketId = null;
  priType = null;
  issueInfo = {};
  ticketInfo = null;
  isBtn = false
  constructor(public api: ApiService,
    public user: UserService,
    public common: CommonService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    if (this.common.params && this.common.params.ticket) {
      this.ticketId = this.common.params.ticket.id;
      this.priType = this.common.params.ticket.priType;
      this.viewData();
    }
  }

  ngOnInit() {
  }

  findRemainingTime(time) {
    let minutes = time % 60;
    let hours = Math.floor((time / 60));
    if (hours) {
      return hours + ' hours ' + minutes + ' minutes';
    }
    return minutes + ' minutes ';

  }

  viewData() {
    let params = "ticket_id=" + this.ticketId +
      "&pri_type=" + this.priType
    console.log("this.parameters", params);
    this.common.loading++;
    this.api.get("FoTickets/getSingleTicketInfo?" + params)
      .subscribe(res => {
        this.common.loading--;
        let headings = [];
        //  headings = Object.keys(res['data'].tkt_info[0]);
        let hdg = Object.keys(res['data'].tkt_info[0]);
        this.ticketInfo = res['data'].tkt_info[0];
        this.issueInfo = res['data'].issue_info[0];
        for (let i = 0; i < hdg.length; i++) {
          headings.push(this.formatTitle(hdg[i]));
        }
        console.log("headings", headings);
        for (let index = 0; index < hdg.length; index++) {
          const header = headings[index]
          const key = hdg[index];
          const value = res['data'].tkt_info[0][key];
          if (!header.startsWith("_") && value) {
            this.data.push({ head: header, value: value });
          }
        }
        for (let index = 0; index < Math.ceil(this.data.length / 2); index++) {
          this.numbers.push(index);
        }

        console.log("Data Details", this.data);
      }, err => {
        this.common.loading--;
        console.log(err);
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


  closeModal(isFatal) {
    this.activeModal.close({ response: isFatal });
  }

  showLocation(lat, lng) {

    const location = {
      lat: lat,
      lng: lng,
      name: "",
      time: ""
    };
    this.common.params = { location, title: "Location" };
    const activeModal = this.modalService.open(LocationMarkerComponent, {
      size: "lg",
      container: "nb-layout"
    });

  }

  setReminder() {
    this.common.params = { fo_ticket_allocation_id: this.ticketInfo.fo_ticket_allocation_id };
    // this.notification.fo_ticket_allocation_id
    const activeModal = this.modalService.open(ReminderComponent, {
      size: "sm",
      container: "nb-layout"
    })
    activeModal.result.then(data => {
      console.log("Data:", data);
      // this.closeModal(true);
    });
  }

  getExtraTime() {
    this.common.params = { ticketId: this.ticketInfo.fo_ticket_allocation_id };
    const activeModal = this.modalService.open(BuyTimeComponent, { size: "sm", container: "nb-layout" })
    activeModal.result.then(data => {
      console.log("data:", data);
      // this.closeModal(data);
    });
  }

  forwardTicket() {
    this.common.params = { title: 'Forward Ticket', ticketId: this.ticketInfo.ticket_id, fo_ticket_allocation_id: this.ticketInfo.fo_ticket_allocation_id, msg: this.ticketInfo.msg };
    const activeModal = this.modalService.open(TicketForwardComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        console.log()
      }
    });
  }
  trailList() {
    ++this.common.loading;
    this.api.get('FoTickets/getTrailLists?ticket_id=' + this.ticketInfo.ticket_id)
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

  getComment() {
    ++this.common.loading;
    this.api.get('FoTickets/getTicketComments?ticket_id=' + this.ticketInfo.ticket_id)
      .subscribe(res => {
        console.log(res);
        --this.common.loading;
        let commentList = res['data'];
        let type = 'comments';
        if (commentList) {
          console.log("DataTrail:", res['data']);
          //let headers = ["#", "Employee Name", "Spent Time", "Status"];

          this.common.params = { commentList, type };
          const activeModal = this.modalService.open(TicketTrailsComponent, { size: 'lg', container: 'nb-layout' });
          activeModal.componentInstance.modalHeader = 'Comments';
        } else {
          this.common.showError("No record found for this search criteria.")
        }
      }, err => {
        --this.common.loading;
        console.log(err);
        this.common.showError();
      });
  }


  setComments() {
    let comment = prompt("Comment", "");
    if (comment && comment.length > 1) {
      let params = {
        ticket_id: this.ticketInfo.ticket_id,
        aduserid: this.user._details.id,
        comment: comment,
        status: this.ticketInfo.status
      }
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

  }


  setRemark(status) {
    let remark = prompt("Remark", "");
    if (!remark && status == -5) {
      this.common.showToast('Remark is mandatory in cant do');
      return;
    }
    this.updateNotificationStatus(status, remark);
  }

  updateNotificationStatus(status, remark) {
    let params = {
      ticket_id: this.ticketInfo.ticket_id,
      fo_ticket_allocation_id: this.ticketInfo.fo_ticket_allocation_id,
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
        this.closeModal(true);
      }, err => {
        this.common.loading--;
        console.log(err);
        this.common.showError();
      });
  }
}
