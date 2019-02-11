import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAgentComponent } from '../add-agent/add-agent.component';
import { DatePickerComponent } from '../../../modals/date-picker/date-picker.component';
@Component({
  selector: 'edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.scss','../../../pages/pages.component.css']
})
export class EditDocumentComponent implements OnInit {
 
  title = '';
  btn1 = '';
  btn2 = '';
  vehicleId = '';

  document = {
    image: '',
    base64Image: null,
    type: {
      id: '',
      name: ''
    },
    dates: {
      issue: '',
      wef: '',
      expiry: ''
    },
    number: '',
    remark: '',
    rto: '',
    agent: {
      id: '',
      name: '',
    },
    amount: '',
  }

  agents = [];
  docTypes = [];
  vehicle = null;


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title;
    this.btn1 = this.common.params.btn1 || 'Update';
    this.btn2 = this.common.params.btn2 || 'Cancel';

    this.vehicleId = this.common.params.vehicleId;
    console.log("data");
  
  }
  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  ngOnInit() {
  }

 
}
