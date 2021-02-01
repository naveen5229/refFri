import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateTransportAgentComponent } from '../../modals/update-transport-agent/update-transport-agent.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'transport-agents',
  templateUrl: './transport-agents.component.html',
  styleUrls: ['./transport-agents.component.scss','../../pages/pages.component.css']
})
export class TransportAgentsComponent implements OnInit {
  transportAgents = null;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal) { 
      this.getTransportAgent();
      this.common.refresh = this.refresh.bind(this);
    }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.getTransportAgent();
  }

  getTransportAgent(){
    ++this.common.loading;
    this.api.get('company/getTransportAgents',)
      .subscribe(res => {
        --this.common.loading;
        console.log("response",res);
        this.transportAgents = res['data'];
        console.log('this.transportAgents:', this.transportAgents);
        // console.log("Receipt",this.receipts);
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }
  updateTranportAgent(transportAgent){
    console.log("transportAgent",transportAgent);
    this.common.params = {transportAgent: transportAgent }
    const activeModal = this.modalService.open(UpdateTransportAgentComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.getTransportAgent();
    });
  }
}
