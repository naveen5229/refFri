import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'uj-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss']
})
export class DateTimePickerComponent implements OnInit {

  @Output() onChanged = new EventEmitter();
  @Input() dateFormat: string = "dd-MM-yyyy";
  @Input() timeFormat: string = "HH:mm";
  @Input() isTime: boolean = true;
  @Input() isDate: boolean = true;
  @Input() dateTimeValue: Date;


  constructor() {

  }

  ngOnInit() {

  }

  setDate(event: Date, type) {
    console.log("Event", event, "Type", type);
    this.onChanged.emit(event);
    // let dateSend = (event.getMonth() + 1) + "-" + event.getDate() + "-" + event.getFullYear();
    // let time = (this.timeValue.getHours()) + ":" + this.timeValue.getMinutes() + ":" + this.timeValue.getSeconds();
  }

}
