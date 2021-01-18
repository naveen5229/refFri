import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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

  ngOnDestroy(){}
ngOnInit() {
    this.Form = this.formBuilder.group({
      name: ['', Validators.required],
      panNo: ['', [Validators.required, Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]$")]],
      gstin: ['', [Validators.required, Validators.pattern("^([0][1-9]|[1-2][0-9]|[3][0-7])([A-Z]{5})([0-9]{4})([A-Z]{1}[1-9A-Z]{1})([Z]{1})([0-9A-Z]{1})+$")]],
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.Form.controls; }


  closeModal() {
    this.activeModal.close();
  }

  checkFormat() {
    this.transportAgent.pan = (this.transportAgent.pan).toUpperCase();

  }

  checkFormatGst() {
    this.transportAgent.gstin = (this.transportAgent.gstin).toUpperCase();

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
