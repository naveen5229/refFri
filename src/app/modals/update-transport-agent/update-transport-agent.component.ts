import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'update-transport-agent',
  templateUrl: './update-transport-agent.component.html',
  styleUrls: ['./update-transport-agent.component.scss']
})
export class UpdateTransportAgentComponent implements OnInit {
  isFormSubmit = false;
  Form: FormGroup;

  transportAgent = {
    name: null,
    pan: null,
    id: null,
    gstin: null
  };
  constructor(public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder) {
    console.log("this.common.params.tranportAgent", this.common.params.transportAgent);
    this.transportAgent.name = this.common.params.transportAgent.name;
    this.transportAgent.pan = this.common.params.transportAgent.pan;
    this.transportAgent.gstin = this.common.params.transportAgent.gstin;
    this.transportAgent.id = this.common.params.transportAgent.id;
  }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      name:['',Validators.required],
      panNo: ['', [Validators.required, Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]$")]],
      gstin:['',[Validators.required, Validators.pattern("/^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$/")]],
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.Form.controls; }
  

  closeModal() {
    this.activeModal.close();
  }
  
  checkFormat(){
    this.transportAgent.pan =  (this.transportAgent.pan).toUpperCase();
 
   }

  updateTransportAgent() {
    let params = {
      name: this.transportAgent.name,
      id: this.transportAgent.id,
      pan: this.transportAgent.pan,
      gstin: this.transportAgent.gstin
    }
    console.log("params", params);
    return;
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
