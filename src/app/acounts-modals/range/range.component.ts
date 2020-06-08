import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss']
})
export class RangeComponent implements OnInit {
  startdate =(this.accountService.fromdate)?this.accountService.fromdate: this.common.dateFormatternew(new Date());
  enddate = (this.accountService.todate)?this.accountService.todate:this.common.dateFormatternew(new Date());
  constructor(public api: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    public user: UserService,
    public router: Router,
    public modalService: NgbModal,
    public accountService: AccountService,
    private activeModal: NgbActiveModal,) { 
    this.common.handleModalSize('class', 'modal-lg', '650','px',0);
    }

  ngOnInit() {
  }

  dismiss(response) {
    //console.log('Accounts:', this.Branches);
    if(response){
      this.accountService.fromdate=this.startdate;
      this.accountService.todate=this.enddate;
      console.log('range date',this.accountService.fromdate);
    this.activeModal.close({ response: response, startdate:this.startdate,enddate:this.enddate });
    }else{
       this.activeModal.close({ response: response});
    }
  }
}
