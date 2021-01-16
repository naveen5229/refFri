import { Component, OnInit } from '@angular/core';
import { NbCalendarRange, NbDateService } from '@nebular/theme';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss', '../../pages/pages.component.css']
})
export class DatePickerComponent implements OnInit {
  date = new Date();
  timeType = "lTime";
  ref_page = null;
  constructor(private activeModal: NgbActiveModal,
    protected dateService: NbDateService<Date>,
    public common: CommonService) {

    this.ref_page = this.common.params.ref_page ? this.common.params.ref_page : 'all';
  }



  ngOnDestroy(){}
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
    return this.dateService.getMonthStart(new Date(this.date));
  }
  get monthEnd(): Date {
    return this.dateService.getMonthEnd(new Date(this.date));
  }

  handleDateChange() {

  }
  closeModal(properClose) {
    if (properClose) {
      setTimeout(() => {
        console.log('Date: ', this.date);
        this.activeModal.close({ date: this.date, timeType: this.timeType });
      }, 100);
    }
    else {
      this.activeModal.close({ date: this.date, timeType: this.timeType });
    }
  }


}
