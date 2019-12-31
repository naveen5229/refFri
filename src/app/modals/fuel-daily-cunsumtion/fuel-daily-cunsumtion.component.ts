import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { FuelDailyCunsumtionConditionComponent } from '../fuel-daily-cunsumtion-condition/fuel-daily-cunsumtion-condition.component';
@Component({
  selector: 'fuel-daily-cunsumtion',
  templateUrl: './fuel-daily-cunsumtion.component.html',
  styleUrls: ['./fuel-daily-cunsumtion.component.scss']
})
export class FuelDailyCunsumtionComponent implements OnInit {
  fuelConsumption = [];
  fueldailycumsionlevel2 = [];
  reportType = 0;
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
    public api: ApiService,
    private modalService: NgbModal, ) {
    if (this.common.params) {
      console.log("After the modal Open:", this.common.params);
      this.fuelConsumption = this.common.params.consumtiondata;
      this.fueldailycumsionlevel2 = this.common.params.fueldailycumsionlevel2;
      this.reportType = this.common.params.reportType;
      let first_rec = this.fuelConsumption[0];
      for (var key in first_rec) {
        if (key.charAt(0) != "_") {
          if (key != 'Is Applicable' && key != 'Median') {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
      }
      this.table.data.columns = this.getTableColumns();
      this.common.handleModalSize('class', 'modal-lg', '1250', 'px', 0);

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

      var colorclass = '';
      if(doc['Median'] !=0 && this.reportType==2){
        colorclass = 'green';
      }
      else  if (doc['Is Applicable'] != 1 && this.reportType==1) {
        colorclass = 'red';
      } else {
        colorclass = 'black';
      }
    
      this.valobj = {
        class: colorclass
      };

      for (let i = 0; i < this.headings.length; i++) {
        if (this.headings[i] != 'Is Applicable') {
          if (this.headings[i] != 'Date') {
            if (this.headings[i] == 'Vehicle') {
              this.valobj[this.headings[i]] = { value: doc[this.headings[i]], action: this.openfueldailycunsumption.bind(this, doc[this.headings[i]], doc['Date'],doc['Model']),class:'blue' };
            } else {
              this.valobj[this.headings[i]] = { value: doc[this.headings[i]], action: '' };
            }
          } else {
            this.valobj[this.headings[i]] = { value: this.common.changeMonthformat((doc[this.headings[i]]), 'MMM yy'), action: '' };
          }
        }
      }
      columns.push(this.valobj);
    });

    return columns;
  }
  dismiss(response) {
    this.activeModal.close({ response: response });
  }
  openfueldailycunsumption(consumtiondata, month,modelno) {

    console.log('consumtiondata', consumtiondata, 'month', month, this.fueldailycumsionlevel2);
    let data = [];

    this.fueldailycumsionlevel2.filter(cumsiondatanew => {
      if (((this.common.changeMonthformat(cumsiondatanew.Date, 'MMM yy')) == (this.common.changeMonthformat(month, 'MMM yy'))) && (cumsiondatanew.Vehicle == consumtiondata)) {
        console.log('after check data**********', cumsiondatanew);
        
        data.push(cumsiondatanew);
        // return true;
      }
      //return false;
    });
    console.log('after check data------', data);
    this.common.params = {
      consumtiondata: data,
      PageHeading: 'Fuel Consumption '+'  Vechicle Name: '+consumtiondata+' ('+modelno+')',
      index: 1
    };
    const activeModal = this.modalService.open(FuelDailyCunsumtionConditionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
    activeModal.result.then(data => {


    });
  }
}
