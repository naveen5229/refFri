import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockSubtypeComponent } from '../../acounts-modals/stock-subtype/stock-subtype.component';
  import { from } from 'rxjs';
@Component({
  selector: 'stock-subtypes',
  templateUrl: './stock-subtypes.component.html',
  styleUrls: ['./stock-subtypes.component.scss']
})
export class StockSubtypesComponent implements OnInit {
  stockSubTypes = [];

  constructor(public api: ApiService,
    public modalService: NgbModal,
    public common: CommonService) { 
      this.getStockSubTypes();
    }

  ngOnInit() {
  }
  getStockSubTypes() {
    let params = {
      foid: 123
    };
    this.common.loading++;
    this.api.post('Stock/getStockSubTypes', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res);
        this.stockSubTypes = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  
  openStockSubTypeModal(stocksubType?) {
    if (stocksubType) this.common.params = StockSubtypeComponent;
    const activeModal = this.modalService.open(StockSubtypeComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
       this.addStockSubType(data.stockSubType)
      
    });
  }

  addStockSubType(stockSubType) {
    //console.log(stockSubType);
    //const params ='';
     const params = {
        foid: stockSubType.user.id,
         name: stockSubType.name,
        code: stockSubType.code,
        stockid: stockSubType.stockType.id
     };
console.log(params);
    this.common.loading++;

    this.api.post('Stock/InsertStocksubType', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.getStockSubTypes();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
}
