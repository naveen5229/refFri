import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss']
})
export class RangeComponent implements OnInit {
  startdate =(this.accountService.fromdate)?this.accountService.fromdate: this.common.dateFormatternew(new Date());
  enddate = (this.accountService.todate)?this.accountService.todate:this.common.dateFormatternew(new Date());
  allowBackspacerange = true;
  constructor(public api: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    public user: UserService,
    public router: Router,
    public modalService: NgbModal,
    public accountService: AccountService,
    private activeModal: NgbActiveModal,) { 
    this.common.handleModalSize('class', 'modal-lg', '1250','px',0);
    this.setFoucus('voucher-date-f2');
    }

  ngOnDestroy(){}
ngOnInit() {
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
   let activeId = document.activeElement.id;
    console.log('Active event', event);
    
    if (key == 'enter') {
      this.allowBackspacerange = true;
      if (activeId.includes('voucher-date-f2')) {
      this.startdate= this.common.handleVoucherDateOnEnter(this.startdate);
        this.setFoucus('voucher-end-date-f2');
      } else if (activeId.includes('voucher-end-date-f2')) {
      this.enddate= this.common.handleVoucherDateOnEnter(this.enddate);
        this.setFoucus('submitf2');
      }
    } else if (key == 'backspace' && this.allowBackspacerange) {
      event.preventDefault();
      console.log('active 1', activeId);
      if (activeId == 'voucher-end-date-f2') this.setFoucus('voucher-date-f2');
    } else if (key.includes('arrow')) {
      this.allowBackspacerange = false;
    } else if (key != 'backspace') {
      this.allowBackspacerange = false;
    }
  }
  
  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
  }

  dismiss(response) {
    //console.log('Accounts:', this.Branches);
    if(response){
      this.startdate= this.common.handleVoucherDateOnEnter(this.startdate);
      this.enddate= this.common.handleVoucherDateOnEnter(this.enddate);
      this.accountService.fromdate=this.startdate;
      this.accountService.todate=this.enddate;
      console.log('range date',this.accountService.fromdate);
    this.activeModal.close({ response: response, startdate:this.startdate,enddate:this.enddate });
    }else{
       this.activeModal.close({ response: response});
    }
  }
}
