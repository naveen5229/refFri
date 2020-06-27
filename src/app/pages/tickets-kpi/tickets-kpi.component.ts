import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tickets-kpi',
  templateUrl: './tickets-kpi.component.html',
  styleUrls: ['./tickets-kpi.component.scss']
})
export class TicketsKpiComponent implements OnInit {
kpis = [];
testData = [{
  tkt : "vehicle Halt 20 mins",
  unacklt30mins : 35,
  unackgt30mins : 36,
  unclmlt30mins : 37,
  unclmgt30mins : 38,
  uncallt1hr : 39,
  uncalgt1hr : 40,
  openlt3hr : 20,
  opengt3hr : 30,
  cmptin6hr :200
},
{
  tkt : "loading Halt 40 mins",
  unacklt30mins : 35,
  unackgt30mins : 36,
  unclmlt30mins : 37,
  unclmgt30mins : 38,
  uncallt1hr : 39,
  uncalgt1hr : 40,
  openlt3hr : 20,
  opengt3hr : 30,
  cmptin6hr :200

},
{
  tkt : "unloading Halt 45 mins",
  unacklt30mins : 35,
  unackgt30mins : 36,
  unclmlt30mins : 37,
  unclmgt30mins : 38,
  uncallt1hr : 39,
  uncalgt1hr : 40,
  openlt3hr : 20,
  opengt3hr : 30,
  cmptin6hr :200
}]
  constructor(  public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
      // this.kpis = this.testData;
     this.getTicketsKPI();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {

  }

  refresh() {
    this.getTicketsKPI();
  }

  getTicketsKPI() {
    ++this.common.loading;
    this.api.get('VehicleKpis/getTicketKpis?')
      .subscribe(res => {
        --this.common.loading;
        console.log(res);
        this.kpis = res['data'] ? res['data'] : [];
      }, err => {
        --this.common.loading;
        console.error(err);
      });
  }

}
