import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'stock-types',
  templateUrl: './stock-types.component.html',
  styleUrls: ['./stock-types.component.scss']
})
export class StockTypesComponent implements OnInit {

  stockTypes = [];

  constructor(public api: ApiService,
    public common: CommonService) { 
      this.getStockTypes();
    }

  ngOnInit() {
  }

  getStockTypes() {
    let params = {
      foid: 123
    };
    this.common.loading++;
    this.api.post('Stock/GetStocktype', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res);
        this.stockTypes = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

}
