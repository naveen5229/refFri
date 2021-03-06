import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {
  constructor(public common: CommonService) {

  }

  transform(value: any, args?: any): any {

    String.prototype['splice'] = function (idx, rem, str) {
      return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };

    let withoutHyphen = new RegExp(/^([0-2][0-9]||3[0-1])(0[0-9]||1[0-2])[0-9]{4}$/i);
    let withHyphen = new RegExp(/^([0-2][0-9]||3[0-1])-(0[0-9]||1[0-2])-[0-9]{4}$/i);
    let withHyphenReverse = new RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/i);
    let yyymmdd = new RegExp(/^[0-9]{4}-(0[0-9]||1[0-2])-([0-2][0-9]||3[0-1])$/i);
    console.log('Value:', value);
    if (value.length == 10) {
      if (!withHyphenReverse.test(value.split('-').reverse().join('-'))) {
        this.common.showError("Enter inValid date dd-mm-yyyy :" + value);
        return value = null;
      }
      console.log('Regx:', yyymmdd.test(value));
      if (yyymmdd.test(value)) return value.split('-').reverse().join('-');
      if (!withHyphen.test(value) && !withoutHyphen.test(value)) return value;
      return value.split('-').reverse().join('-');
    }

    console.log("Double Hyphen", value.match(/-/g));

    if ((value.match(/-/g) || []).length == 2) return value;
    if (value.length == 2 || value.length == 5) return value + '-';
    if (value.length > 2 && value[2] != '-') return value.splice(2, 0, '-');
    if (value.length > 5 && value[5] != '-') return value.splice(5, 0, '-');

    return value;
  }



}
