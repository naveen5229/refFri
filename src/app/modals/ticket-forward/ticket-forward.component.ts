import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'ticket-forward',
  templateUrl: './ticket-forward.component.html',
  styleUrls: ['./ticket-forward.component.scss', '../../pages/pages.component.css']
})
export class TicketForwardComponent implements OnInit {
  title = '';
  forward = {
    user: {
      name: '',
      id: -1
    },
    remark: ''
  };
  showSuggestions = false;
  suggestions = [];
  loader = null;

  constructor(public common: CommonService,
    public api: ApiService,
    private activeModal: NgbActiveModal,
    public user: UserService) {
    this.title = this.common.params.title;
  }

  ngViewDidLoad() {
    console.log('ionViewDidLoad ForwardTicketPage');
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  searchUser() {
    this.forward.user.id = -1;
    this.showSuggestions = true;
    let params = 'search=' + this.forward.user.name;
    this.api.get('Suggestion/getFoAdminList?' + params) // Customer API
      // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
      .subscribe(res => {
        console.log(res);
        this.suggestions = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  } 20

  selectUser(user) {
    this.forward.user.name = user.employeename;
    this.forward.user.id = user.id;
    this.showSuggestions = false;
  }

  dismiss(response) {
    this.activeModal.close({ response });
  }

  forwardTicket() {

    if (!this.forward.user.id || this.forward.user.id == -1 || !this.forward.user.name) {
      this.common.showToast('Select a user before forward a ticket');
      return;
    }

    this.common.loading++;
    if (this.common.params.type === 'multiple') {
      this.handleMultipleForward();
      return;
    }
    this.sendForwardRequest(this.common.params.ticketId, this.common.params.fo_ticket_allocation_id, this.common.params.msg, true);
  }

  handleMultipleForward() {
    let tickets = this.common.params.tickets;
    tickets.map((ticket, index) => {
      this.sendForwardRequest(ticket.ticketId, ticket.fo_ticket_allocation_id, ticket.msg, index == tickets.length - 1 ? true : false);
    });
  }


  sendForwardRequest(ticketId, fo_ticket_allocation_id, msg, isLast) {
    let params = {
      fo_ticket_allocation_id: fo_ticket_allocation_id,
      ticket_id: ticketId,
      forward_user_id: this.forward.user.id,
      msg: msg,
      remark: this.forward.remark,
      aduserid: this.user._details.id
    };
    console.log('Params:', params);

    this.api.post('FoTickets/forwardTickets', params)
      .subscribe(res => {
        console.log(res);
        if (isLast) {
          this.common.loading--;
          this.dismiss(true);
        }
      }, err => {
        console.error(err);
        this.common.showError();
        this.common.loading--;
      });
  }


}
