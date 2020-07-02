import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HtmlTagDefinition } from '@angular/compiler';
import { LocationMarkerComponent } from '../location-marker/location-marker.component';
import { ReminderComponent } from '../reminder/reminder.component';
import { BuyTimeComponent } from '../buy-time/buy-time.component';

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
  issueInfo = null;
  ticketInfo=null;
  isBtn=false
  constructor(public api: ApiService,
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
    this.api.get("FoTickets/getSingleTicketInfo?"+params)
      .subscribe(res => {
        this.common.loading--;
        let headings = [];
        //  headings = Object.keys(res['data'].tkt_info[0]);
        let hdg = Object.keys(res['data'].tkt_info[0]);
        this.ticketInfo=res['data'].tkt_info[0];
        this.issueInfo = res['data'].issue_info[0];
        for(let i=0;i<hdg.length ; i++){
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

  showLocation(lat,lng) {
  
    const location = {
      lat: lat,
      lng: lng,
      name: "",
      time: ""
    };
    this.common.params = { location, title: "Location" };
    const activeModal = this.modalService.open(LocationMarkerComponent , {
      size: "lg",
      container: "nb-layout"
    });
    
  }

  setReminder(){
    this.common.params = { fo_ticket_allocation_id:this.ticketInfo.fo_ticket_allocation_id};
    // this.notification.fo_ticket_allocation_id
    const activeModal = this.modalService.open(ReminderComponent , {
      size: "lg",
      container: "nb-layout"
    })
    activeModal.result.then(data => {
      console.log("Data:",data);
      // this.closeModal(true);
    });
  }

  getExtraTime() {
    this.common.params = { ticketId: this.ticketInfo.fo_ticket_allocation_id };
    const activeModal = this.modalService.open(BuyTimeComponent , {size: "lg",container: "nb-layout"})
    activeModal.result.then(data => {
      console.log("data:",data);
      // this.closeModal(data);
    });
  }
}
