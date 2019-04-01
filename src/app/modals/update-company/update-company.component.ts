import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

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
  ) {
    this.company.name = this.common.params.company.name;
    this.company.pan = this.common.params.company.pan;
    this.company.id = this.common.params.company.id;

   }

  ngOnInit() {
  }

}
