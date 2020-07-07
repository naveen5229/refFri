import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketDetailsComponent } from '../../modals/ticket-details/ticket-details.component';

@Component({
  selector: 'tickets-kpi',
  templateUrl: './tickets-kpi.component.html',
  styleUrls: ['./tickets-kpi.component.scss']
})
export class TicketsKpiComponent implements OnInit {
  kpis = [];
  testData = [];
  type = 'alertwise'
  constructor(public api: ApiService,
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

  getTicketsKPI(type?) {
    this.kpis = [];
    type = type ? type : this.type;
    ++this.common.loading;
    this.api.get('VehicleKpis/getTicketKpis?type=' + type)
      .subscribe(res => {
        --this.common.loading;
        console.log(res);
        this.kpis = res['data'] ? res['data'] : [];
      }, err => {
        --this.common.loading;
        console.error(err);
      });
  }

  openTicketDetails(value, type) {
    console.log("ticket", value, type);
    if (value.split('_')[2] != 0) {
      let ticket = {
        type: type,
        rowId: value.split('_')[2],
        columnId: value.split('_')[1],
      }
      this.common.params = { ticketInfo: ticket };
      const activeModal = this.modalService.open(TicketDetailsComponent, { size: 'lg', container: 'nb-layout' });
      activeModal.result.then(data => {
        console.log("data", data);
        if (data.response)
          this.refresh();
      });
    }else{
      this.common.showError("There is no data");
    }
  }
}
