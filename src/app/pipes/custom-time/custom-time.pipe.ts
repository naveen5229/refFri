import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Pipe({
  name: 'customTime'
})
export class CustomTimePipe implements PipeTransform {
  constructor(public common: CommonService) {

  }
  transform(value: any, args?: any): any {

    String.prototype['splice'] = function (idx, rem, str) {
      return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };
    let withColon = new RegExp(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9])$/i);

    console.log('Value:', value);
    if (value.length == 5) {
      if (!withColon.test(value)) {
        this.common.showError("Enter inValid Time :" + value);
        return value = null;
      }
    }

    if ((value.match(/:/g) || []).length == 1) return value;
    if (value.length == 2) return value + ':';
    if (value.length > 2 && value[2] != ':') return value.splice(2, 0, ':');

    return value;
  }
}
