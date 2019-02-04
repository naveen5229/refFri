import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddDocumentComponent } from '../../documents/documentation-modals/add-document/add-document.component';
import { from } from 'rxjs';
@Component({
  selector: 'documentation-details',
  templateUrl: './documentation-details.component.html',
  styleUrls: ['./documentation-details.component.scss', '../../pages/pages.component.css']
})
export class DocumentationDetailsComponent implements OnInit {



  title: '';
  data = [];


  selectedVehicle = null;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  getvehicleData(vehicle) {
    console.log('Vehicle Data: ', vehicle);
    this.selectedVehicle = vehicle;
    this.common.loading++;
    this.api.post('Vehicles/getVehicleDocumentsById', { x_vehicle_id: vehicle.id })
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);

        this.data = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  // extractData(data) {
  //   letvehicle = [{
  //     id: data.vehicle_id,
  //     number: data.regno,
  //     engineNumber: data.engine_no,
  //     gvw: data.gvw,
  //     manufactureDate: data.manufacture_date,
  //     chassis: data.chassis_no,
  //     maker: data.vehicle_maker,
  //     modal: data.vehicle_model
  //   }];

  //   this.document = [{
  //     number: data.document_number,
  //     type_id: data.document_type_id,
  //     type : data.document_type,
  //     permitId: data.permit_state_id,
  //     dates: {
  //       issue : data.issue_date,
  //       wef : data.wef_date,
  //       start: data.from_date,
  //       expired: data.expiry_date
  //     },
  //     image: data.img_url,
  //     remark: data.remarks,
  //     agent: {
  //       name: data.agent,
  //       id: data.document_agent_id,
  //     },
  //   }];


  getDocumentsData() {
    this.common.loading++;
    this.api.post('Vehicles/getAddVehicleFormDetails', { x_vehicle_id: this.selectedVehicle.id })
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.openModal(res['data']);
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  openModal(details) {
    this.common.params = { details, title: 'Add Document' };
    const activeModal = this.modalService.open(AddDocumentComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getvehicleData(this.selectedVehicle);
      }
    });

  }

  // getDocument(data) {
  //   console.log(data);
  //   let document_agents_info = [{
  //     id: data.id,
  //     name :data.name,
  //     location: data.location,
  //     mobileno: data.mobileno,
  //     email : data.email
  //   }];

  //   let document_types_info =[{
  //     id: data.id,
  //     document_type: data.document_type
  //   }];
  //   // let vehicle_info=[{

  //   // }];
  //   console.log("document_agents_info:", document_agents_info);
  //   console.log("document_types_info",document_types_info);
  //   // console.log("vehicle_info",vehicle_info);

  // }

}
