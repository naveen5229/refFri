import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DateService } from '../../services/date.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'uj-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss']
})
export class DateTimePickerComponent implements OnInit {

  @Output() onChanged = new EventEmitter();
  @Input() dateFormat: string = "dd-MM-yyyy";
  @Input() timeFormat: string = "HH:mm";
  @Input() isTime: boolean;
  @Input() isStart: boolean;
  @Input() isDate: boolean;
  @Input() isForm: boolean;
  @Input() maxd: Date;
  @Input() mind: Date;
  @Input() maxt: Date;
  @Input() mint: Date;
  @Input() dateTimeValue: Date;


  constructor(private dateService: DateService) {
    this.isDate = true;
    this.isTime = true;
    this.isForm = true;
    this.isStart = true;

  }

  ngOnDestroy(){}
ngOnInit() {

  }

  ngAfterViewInit() {
    if (!this.isTime && this.dateTimeValue) {
      if (this.isStart)
        this.onChanged.emit(new Date(this.dateTimeValue.setHours(0, 0, 0, 0)));
      else
        this.onChanged.emit(new Date(this.dateTimeValue.setHours(23, 59, 59, 0)));
    }
  }

  setDate(event: Date, type) {
    if (!event) return;
    if (!this.isTime && this.dateTimeValue && this.dateTimeValue.getTime() !== event.getTime()) {
      if (this.isStart)
        this.onChanged.emit(new Date(event.setHours(0, 0, 0, 0)));
      else
        this.onChanged.emit(new Date(event.setHours(23, 59, 59, 0)));
      this.dateTimeValue = event;
    } else {
      event.setSeconds(0)
      this.onChanged.emit(event);
    }
  }

}
