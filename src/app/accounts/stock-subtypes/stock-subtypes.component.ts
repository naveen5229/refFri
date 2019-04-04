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
  selectedName = '';
  constructor(public api: ApiService,
    public modalService: NgbModal,
    public common: CommonService) { 
      this.getStockSubTypes();
      this.common.currentPage = 'Stock Sub Types';
    }
    selectedRow = -1;
    activeId='';
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
    if (stocksubType) this.common.params = stocksubType;
    const activeModal = this.modalService.open(StockSubtypeComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static',keyboard :false, windowClass : "accountModalClass" });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
       
        if (stocksubType) {
          this.updateStockSubType(stocksubType.id, data.stockSubType);
          return;
        }
       this.addStockSubType(data.stockSubType);
      }
    });
  }

  addStockSubType(stockSubType) {
    //console.log(stockSubType);
    //const params ='';
     const params = {
      //  foid: stockSubType.user.id,
         name: stockSubType.name,
        code: stockSubType.code,
        stockid: stockSubType.stockType.id
     };
//console.log(params);
    this.common.loading++;

    this.api.post('Stock/InsertStocksubType', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.getStockSubTypes();
        this.common.showToast('Stock Sub Type Are Saved');
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  updateStockSubType(id, stockSubType) {
           console.log('test');
          console.log(stockSubType);
    const params = {
    //  foid: stockSubType.user.id,
      name: stockSubType.name,
      code: stockSubType.code,
      stockid: stockSubType.stockType.id,
      id: id
    };

    this.common.loading++;

    this.api.post('Stock/updateStocksubType', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.getStockSubTypes();
        this.common.showToast('Stock Sub Type Are Updated');
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event, this.activeId);
  if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.stockSubTypes.length) {
    /************************ Handle Table Rows Selection ********************** */
    if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
    else if (this.selectedRow != this.stockSubTypes.length - 1) this.selectedRow++;

  }
}
  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }
}
