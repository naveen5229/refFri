import { Component, OnInit } from '@angular/core';
import { Driver } from 'selenium-webdriver/edge';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss']
})
export class AddDriverComponent implements OnInit {
  driverForm: FormGroup;
  isForSubmit: false;
  
  driver ={
    name: null,
    doj: this.common.dateFormatter(new Date()),
    mobileno:null,
    driverphoto:null,
    lisencenumber:null,
    lisencephoto:null,
    aadharnumber:null,
    aadharphoto:null,
    salary:null,
    guranter:null,
    gurantermobileN0:null

  }
  constructor(
    public common: CommonService,
    public modalService:NgbModal ,
    private formbuilder:FormBuilder ) {
    
     }

  ngOnInit() {
     this.driverForm = this.formbuilder.group({
      name: ['', Validators.required ,Validators.minLength(3)],
       mobileno: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(10)]],
     })
  }
  
  
  
  getDate() {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.driver.doj = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.driver.doj);
    });
  }
}

