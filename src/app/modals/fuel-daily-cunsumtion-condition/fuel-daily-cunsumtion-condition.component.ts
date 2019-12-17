import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'fuel-daily-cunsumtion-condition',
  templateUrl: './fuel-daily-cunsumtion-condition.component.html',
  styleUrls: ['./fuel-daily-cunsumtion-condition.component.scss']
})
export class FuelDailyCunsumtionConditionComponent implements OnInit {
  fuelConsumption = [];
  fueldailycumsionlevel2 = [];
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
  PageHeading = '';
  index = 0;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
    if (this.common.params) {
      console.log("After the modal Open:", this.common.params);
      this.fuelConsumption = this.common.params.consumtiondata;
      this.PageHeading = this.common.params.PageHeading;
      if (this.common.params.index) {
        this.index = this.common.params.index;
      }
      let first_rec = this.fuelConsumption[0];
      for (var key in first_rec) {
        if (key.charAt(0) != "_") {
          if (key == 'Model') { } else if (key == 'Vehicle') { }else if (key == 'Rank') {
          } else if (key == 'Is Applicable') { } else {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
      }
      console.log('heading data', this.table.data.headings);
      this.table.data.columns = this.getTableColumns();
      this.common.handleModalSize('class', 'modal-lg', '1250', 'px', this.index);

    }
  }

  ngOnInit() {
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  getTableColumns() {
    let columns = [];
    console.log('fuelConsumption', this.fuelConsumption);
    console.log('Headings:', this.headings);
    this.fuelConsumption.map(doc => {
      console.log("DOC:", doc);
      var colorclass = '';
      let column = {};
      for (let i = 0; i < this.headings.length; i++) {
        if (this.headings[i] == 'Model') {
        } else if (this.headings[i] == 'Vehicle') {

        } else if (this.headings[i] == 'Rank') {
        } else if (this.headings[i] == 'Is Applicable') {

        }else {
          column[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }

      }
      columns.push(column);
    });
    console.log('last time data', columns);
    return columns;
  }
  dismiss(response) {
    this.activeModal.close({ response: response });
  }
}
