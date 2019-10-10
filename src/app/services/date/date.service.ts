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
    let shortyear = year.toString().substr(year.toString().length - 2);
    if (month < 9) {
      month = '0' + (month);
    }
    if (date < 9) {
      date = '0' + (date)
    }

    console.log("shortyear=", shortyear);
    if (format == 'YYYYMMDD') {
      return (year + seperator + month + seperator + date);
    }
    if (format == 'DDMMYYYY') {
      return (date + seperator + month + seperator + year);
    }
    if (format == 'DDMMYY') {
      return (date + seperator + month + seperator + shortyear);
    }
    else (format == "DDMM")
    {
      return (month + seperator + date);
    }
  }

  timeFormatter(timeToFormat, format = 'HH:MM', seperator = ':') {
    timeToFormat = new Date(timeToFormat);
    let hours = timeToFormat.getHours();
    let minutes = timeToFormat.getMinutes();
    console.log("hours= ", hours);
    console.log("minutes=", minutes);
    if (format == 'HH:MM') {
      if (hours > 12) {
        hours = (hours) - 12;
        if (hours < 9) {
          hours = '0' + (hours);
        }
        return (hours + seperator + minutes + ' PM');
      }
      if (hours < 12) {
        if (hours < 9) {
          hours = '0' + (hours);
        }
        return (hours + seperator + minutes + ' AM');
      }
    }
    if (format == 'HHMM') {
      if (hours < 12) {
        hours = (hours) + 12;
      }

      return (hours + seperator + minutes);
    }
  }

  /**
   * Date Formatter For Any Date Formatt. For more details read angular date format pipe doc.
   * https://angular.io/api/common/DatePipe
   * @param date {type: string | DateObject}
   * @param format {type: string} Example: for "09 Oct 2019" => "dd MMM yyyy", "2019/10/09" => "yyyy/mm/dd" for more formats please read doc
   * 
   */
  format(date, format: string = 'dd MMM yyyy') {
    return this.datePipe.transform(date);
  }
}
