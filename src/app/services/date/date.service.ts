import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(
    public datePipe: DatePipe
  ) { }

  dateFormatter(dateToFormat, format = 'DDMMYYYY', seperator = '-') {
    console.log('dateToFormat', dateToFormat);
    dateToFormat = new Date(dateToFormat);
    let year = dateToFormat.getFullYear();
    let date = dateToFormat.getDate();
    let month = dateToFormat.getMonth() + 1;
    if (format == 'YYYYMMDD') {
      return (year + seperator + month + seperator + date);
    }
    // if (format == 'DDMMYYYY') {
    //   return ();
    // }
    // if (format == 'DDMMYY') {
    //   return ( );
    // }
    // else (format == "DDMM"){
    //   return ();
    // }
  }
}
