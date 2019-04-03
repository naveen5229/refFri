import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'update-transport-agent',
  templateUrl: './update-transport-agent.component.html',
  styleUrls: ['./update-transport-agent.component.scss']
})
export class UpdateTransportAgentComponent implements OnInit {
  transportAgent = {
    name: null,
    pan: null,
    id:null,
    gstin:null
  };
  constructor(public common : CommonService,
    public api : ApiService,
    public activeModal: NgbActiveModal) {
      console.log("this.common.params.tranportAgent",this.common.params.transportAgent);
      this.transportAgent.name = this.common.params.transportAgent.name;
      this.transportAgent.pan = this.common.params.transportAgent.pan;
      this.transportAgent.gstin = this.common.params.transportAgent.gstin;
      this.transportAgent.id = this.common.params.transportAgent.id;
     }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  updateTransportAgent(){
    let params = {
      name : this.transportAgent.name,
      id : this.transportAgent.id,
      pan : this.transportAgent.pan,
      gstin : this.transportAgent.gstin
    }
    console.log("params", params);
    ++this.common.loading;
    this.api.post('Company/updateTransportAgent', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['msg']);
        this.common.showToast(res['msg']);
        this.activeModal.close();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
}

}
