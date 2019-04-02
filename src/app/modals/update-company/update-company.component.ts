import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'update-company',
  templateUrl: './update-company.component.html',
  styleUrls: ['./update-company.component.scss']
})
export class UpdateCompanyComponent implements OnInit {
  isFormSubmit = false;
  Form: FormGroup;
  company = {
    name: null,
    pan: null,
    id:null
  };
  constructor(
    public common : CommonService,
    public api : ApiService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) {
    this.company.name = this.common.params.company.name;
    this.company.pan = this.common.params.company.pan;
    this.company.id = this.common.params.company.id;

   }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  updateCompany(){
    let params = {
      name : this.company.name,
      id : this.company.id,
      pan : this.company.pan
    }
    console.log("params", params);
    ++this.common.loading;
    this.api.post('Company/updateCompanyDetails', params)
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


