import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from './api.service';
import { CommonService } from './common.service';
@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(
    public router: Router,
    public api: ApiService,
    private datePipe: DatePipe,
    public common: CommonService) { }

  dateFormatter(date, type = 'YYYYMMDD', withTime = true) {
    let d = new Date(date);
    let year = d.getFullYear();
    let month = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
    let dat = d.getDate() < 9 ? '0' + d.getDate() : d.getDate();
    let finalDate = '';
    console.log(dat + '/' + month + '/' + year);
    if (type == 'ddMMYYYY') finalDate = dat + '/' + month + '/' + year;
    else finalDate = year + '-' + month + '-' + dat;
    return finalDate + (withTime ? (' ' + this.timeFormatter(date)) : '');
  }

  dateFormatter1(date) {
    let d = new Date(date);
    let year = d.getFullYear();
    let month = d.getMonth() <= 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
    let dat = d.getDate() <= 9 ? '0' + d.getDate() : d.getDate();

    console.log(dat + '-' + month + '-' + year);

    return (year + '-' + month + '-' + dat);

  }

  changeDateformat(date) {
    let d = new Date(date);
    return this.datePipe.transform(date, 'dd-MMM-yyyy hh:mm a')
  }

  changeDateformat1(date) {
    let d = new Date(date);
    return this.datePipe.transform(date, 'dd-MMM-yyyy')
  }

  timeFormatter(date) {
    let d = new Date(date);
    let hours = d.getHours() < 9 ? '0' + d.getHours() : d.getHours();
    let minutes = d.getMinutes() < 9 ? '0' + d.getMinutes() : d.getMinutes();
    return (hours + ':' + minutes + ':00');
  }

  getDate(days = 0, formatt?) {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    if (formatt) {
      return this.dateFormatter(currentDate, formatt);
    }
    return currentDate;
  }

  handleCustomDate(date) {
    console.log('Date:', date);
    let withoutHyphen = new RegExp(/^([0-2][0-9]||3[0-1])(0[0-9]||1[0-2])[0-9]{4}$/i);
    let withHyphen = new RegExp(/^([0-2][0-9]||3[0-1])-(0[0-9]||1[0-2])-[0-9]{4}$/i);
    if (!withHyphen.test(date) && !withoutHyphen.test(date)) {
      return date;
    }
    console.log('Date:: ', date.split('-').reverse().join('-'));
    return date.split('-').reverse().join('-');

  }

}
