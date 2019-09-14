import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  agentForm: FormGroup;
  agent = {
    name: '',
    mobileNumber: '',
    location: '',
    email: '',
  };

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder) {
    this.title = this.common.params.title || 'Add Agent';
    this.btn1 = this.common.params.btn1 || 'Add';
    this.btn2 = this.common.params.btn2 || 'Cancel';
  }

  ngOnInit() {
    this.agentForm = this.formBuilder.group({
      name: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      location: [''],
      email: ['',]
    });
    console.log('Agent Form: ', this.agentForm);
  }
  // convenience getter for easy access to form fields
  get f() { return this.agentForm.controls; }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  addNewAgent() {
    const params = {
      x_name: this.agentForm.controls.name.value,
      x_mobileno: this.agentForm.controls.mobileNo.value,
      x_location: this.agentForm.controls.location.value,
      x_email: this.agentForm.controls.email.value
    };

    this.common.loading++;
    this.api.post('Vehicles/addAgent', params)
      .subscribe(res => {
        this.common.loading--;
        this.closeModal(true);
      }, err => {
        this.common.loading--;
        console.error('add agent api: ', err);
      });
  }

}
