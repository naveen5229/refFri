import { Component, OnInit } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }  from '@angular/core';
import { NbCalendarRange, NbDateService } from '@nebular/theme';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'date-picker2',
  templateUrl: './date-picker2.component.html',
  styleUrls: ['./date-picker2.component.scss','../../pages/pages.component.css']
})
export class DatePicker2Component implements OnInit {
  date = new Date();
  constructor(private activeModal: NgbActiveModal,
    protected dateService: NbDateService<Date>,
    public common: CommonService) {

  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.removeDummy();
  }

  removeDummy() {
    // let allTags = document.getElementsByTagName('nb-card-header');
    // allTags[1]['style'].display = 'none';
    // console.log('All Tags: ', allTags);
  }

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }
  get monthEnd(): Date {
    return this.dateService.getMonthEnd(new Date());
  }

  handleDateChange(){
    
  }
  closeModal() {
  
    setTimeout(() =>{
      console.log('Date: ', this.date);
      this.activeModal.close({ date: this.date });
    }, 100);
  }



}
