import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentHistoryComponent } from '../documentation-modals/agent-history/agent-history.component';
import { from } from 'rxjs';
@Component({
  selector: 'documentation-details',
  templateUrl: './documentation-details.component.html',
  styleUrls: ['./documentation-details.component.scss', '../../pages/pages.component.css']
})
export class DocumentationDetailsComponent implements OnInit {
data = [];
  title :'';
  vehicle = {
    id: '',
    number: '',
    engineNumber: '',
    gvw: '',
    manufactureDate: '',
    chassis: '',
    maker: '',
    modal: ''
  };

  document = {
    number: '',
    type: '',
    permitId: '',
    dates: {
      start: '',
      expired: ''
    },
    image: '',
    remark: '',
    agent: {
      name: '',
      id: ''
    },
  };

  selectedVehicle = null;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal ) { }

  ngOnInit() {
  }

  getvehicleData(vehicle) {
    console.log('Vehicle Data: ', vehicle);
    this.selectedVehicle = vehicle;
    console.log("selected id", this.selectedVehicle.id);

    this.common.loading++;
    this.api.post('Vehicles/getVehicleDocumentsById', { x_vehicle_id: vehicle.id })
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.extractData(res['data'][0]);
        //this.agentHistory();
        // this.document.remark = res['data'][0].remarks;
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  extractData(data) {
    this.vehicle = {
      id : data.vehicle_id,
      number:data.regno,
      engineNumber:data.engine_no,
      gvw:data.gvw,
      manufactureDate:data.manufacture_date,
      chassis:data.chassis_no,
      maker:data.vehicle_maker,
      modal:data.vehicle_model
    };

    this.document = {
      number: data.document_numer,
      type: data.document_type_id,
      permitId: data.permit_state_id,
      dates: {
        start: data.from_date,
        expired: data.expiry_date
      },
      image:data.img_url,
      remark: data.remarks,
      agent: {
        name: '',
        id:data.document_agent_id,
      },
    };

  }

  agentHistory(){
    this.common.loading++;
    this.api.post('Vehicles/getAgentHistoryByVehicleId',{x_agent_id :this.document.agent.id,  x_vehicle_id:this.vehicle.id})
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
      
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  
    
    this.common.params = {  title: 'Agent_Details' };
    const activeModal = this.modalService.open(AgentHistoryComponent, { size: 'lg', container: 'nb-layout' });
  }

}
