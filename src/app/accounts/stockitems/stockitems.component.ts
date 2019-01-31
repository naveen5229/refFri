import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockitemComponent} from '../../acounts-modals/stockitem/stockitem.component';
import { UserService } from '../../@core/data/users.service';

@Component({
  selector: 'stockitems',
  templateUrl: './stockitems.component.html',
  styleUrls: ['./stockitems.component.scss']
})
export class StockitemsComponent implements OnInit {
  StockItems = [];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) { 
    this.getStockItems();
    }

  ngOnInit() {
  }
  getStockItems() {
    let params = {
      foid: 123
    };
    this.common.loading++;
    this.api.post('Stock/GetStockItem', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.StockItems = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  openStockItemModal (stockitem?) {
    if (stockitem) this.common.params = stockitem;
    const activeModal = this.modalService.open(StockitemComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
       
        if (stockitem) {
         
        //  this.updateStockSubType(stockitem.id, data.stockSubType);
        //  return;
        }
       this.addStockItem(data.stockSubType)
      }
    });
  }

  addStockItem(stockItem) {
    console.log(stockItem);
   // const params ='';
     const params = {
        foid: stockItem.user.id,
         name: stockItem.name,
        code: stockItem.code,
        //stockid: stockItem.stockType.id
     };
//console.log(params);
    this.common.loading++;

    this.api.post('Stock/InsertStockItem', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.getStockItems();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
}
