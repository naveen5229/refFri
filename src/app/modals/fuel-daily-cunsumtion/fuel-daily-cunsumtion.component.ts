import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'fuel-daily-cunsumtion',
  templateUrl: './fuel-daily-cunsumtion.component.html',
  styleUrls: ['./fuel-daily-cunsumtion.component.scss']
})
export class FuelDailyCunsumtionComponent implements OnInit {
  fuelConsumption=[];
  fueldailycumsionlevel2=[];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
      if (this.common.params) {
        console.log("After the modal Open:", this.common.params);
        this.fuelConsumption=this.common.params.consumtiondata;
        this.fueldailycumsionlevel2=this.common.params.fueldailycumsionlevel2;
        let first_rec = this.fuelConsumption[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        console.log('heading data', this.table.data.headings);
        this.table.data.columns = this.getTableColumns();
        this.common.handleModalSize('class', 'modal-lg', '1250','px',0);

      }
     }

  ngOnInit() {
  }

  
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  getTableColumns(fuel_daily_cumsion?) {
    let columns = [];
    if (!fuel_daily_cumsion)
      fuel_daily_cumsion = this.fuelConsumption;
    fuel_daily_cumsion.map(doc => {
      
      console.log('color class',doc['Is Applicable']);
      var colorclass= '';
      if(doc['Is Applicable']==1){
        colorclass ='black';
      }else {
        colorclass='red';
      }
      this.valobj = {
        class: colorclass
      };
      console.log('colorclass111',colorclass);
      for (let i = 0; i < this.headings.length; i++) {
        if(this.headings[i]!='Date'){
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]] , action: '' };
        }else{
          this.valobj[this.headings[i]] = { value: this.common.changeMonthformat((doc[this.headings[i]]),'MMM yy'), action: '' };
        }
      }
      columns.push(this.valobj);
    });

    return columns;
  }
  dismiss(response) {
    this.activeModal.close({ response: response});
  }
}
