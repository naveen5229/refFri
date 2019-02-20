import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss', '../../../pages/pages.component.css']
})
export class AddAgentComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';
  isFormSubmit = false;

  agent = {
    name: '',
    mobileNumber: '',
    location: '',
    email: '',
  };

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title || 'Add Agent';
    this.btn1 = this.common.params.btn1 || 'Add';
    this.btn2 = this.common.params.btn2 || 'Cancel';
  }

  ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  addNewAgent() {
    const params = {
      x_name: this.agent.name,
      x_mobileno: this.agent.mobileNumber,
      x_location: this.agent.location,
      x_email: this.agent.email
    };
    console.info("Params: ", params);

    this.common.loading++;
    this.api.post('Vehicles/addAgent', params)
      .subscribe(res => {
        this.common.loading--;
        console.info("api result: ", res);
        this.closeModal(true);
      }, err => {
        this.common.loading--;
        console.error('add agent api: ', err);
      });
  }

}
