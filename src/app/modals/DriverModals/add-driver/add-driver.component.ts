import { Component, OnInit } from '@angular/core';
import { Driver } from 'selenium-webdriver/edge';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { CommonService } from '../../../services/common.service';
@Component({
  selector: 'add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss']
})
export class AddDriverComponent implements OnInit {
  driver = {
    name: null,
    doj: this.common.dateFormatter(new Date()),
    mobileno: null,
    photo: null,
    lisenceNumber: null,
    lisencePhoto: null,
    adharNumber: null,
    adharPhoto: null,
    salary: null,
    guranter: null,
    guranterMobileNo: null
  };

  constructor(public common: CommonService,
    public modalService: NgbModal) {
    console.log('Driver: ', this.common.params);
    if (this.common.params.driver) {
      this.driver.name = this.common.params.driver.empname;
      this.driver.mobileno = this.common.params.driver.mobileno;
      this.driver.doj = this.common.params.driver.doj;
    }
  }

  ngOnInit() {
  }
  getDate() {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.driver.doj = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.driver.doj);
    });
  }
}
