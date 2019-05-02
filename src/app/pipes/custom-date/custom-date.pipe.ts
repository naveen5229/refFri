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
    let yyymmdd = new RegExp(/^[0-9]{4}-(0[0-9]||1[0-2])-([0-2][0-9]||3[0-1])$/i);

    // let newrehx = new RegExp(/(^(((0[1-9]|1[0-9]|2[0-8])[-](0[1-9]|1[012]))|((29|30|31)[-](0[13578]|1[02]))|((29|30)[-](0[4,6,9]|11)))[-](19|[2-9][0-9])\d\d$)|(^29[-]02[-](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/);
    // console.log("with Hyphen", newrehx.test(value));

    // if (newrehx.test(value)) {
    //   this.common.showError("Entered Valid Format  dd-mm-yyyy");
    //   return value = null;
    // }

    console.log('Value:', value);
    if (value.length == 10) {
      console.log('Regx:', yyymmdd.test(value));
      if (yyymmdd.test(value)) return value.split('-').reverse().join('-');
      if (!withHyphen.test(value) && !withoutHyphen.test(value)) return value;

      return value.split('-').reverse().join('-');
    }



    if (value.length == 2 || value.length == 5) return value + '-';
    if (value.length > 2 && value[2] != '-') return value.splice(2, 0, '-');
    if (value.length > 5 && value[5] != '-') return value.splice(5, 0, '-');

    return value;
  }



}
