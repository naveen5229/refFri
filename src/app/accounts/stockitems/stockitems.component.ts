import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockitemComponent } from '../../acounts-modals/stockitem/stockitem.component';
import { UserService } from '../../@core/data/users.service';

@Component({
  selector: 'stockitems',
  templateUrl: './stockitems.component.html',
  styleUrls: ['./stockitems.component.scss']
})
export class StockitemsComponent implements OnInit {
  StockItems = [];
  selectedRow = -1;
  activeId = '';
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.getStockItems();
    this.common.currentPage = 'Stock Item';
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }
  refresh(){
    this.getStockItems();
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

  openStockItemModal(stockitem?) {
    console.log('stockitem', stockitem);
    if (stockitem) {
      this.common.params = stockitem;
      const activeModal = this.modalService.open(StockitemComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("after modal close :", data.stockItem);
          const params = {
            foid: 123,
            name: data.stockItem.name,
            code: data.stockItem.code,
            stocksubtypeid: data.stockItem.stockSubType.id,
            sales: data.stockItem.sales,
            purchase: data.stockItem.purchase,
            minlimit: data.stockItem.minlimit,
            maxlimit: data.stockItem.maxlimit,
            isactive: data.stockItem.isactive,
            inventary: data.stockItem.inventary,
            stockunit: data.stockItem.unit.id,
            stockItemid: stockitem.id
          };
          console.log('paramsans: ', params);
          this.common.loading++;

          this.api.post('Stock/UpdateStockItem', params)
            .subscribe(res => {
              this.common.loading--;
              console.log('res: ', res['data'][0].save_stockitem);
              let result=res['data'][0].save_stockitem;
              if(result==''){
                this.common.showToast(" Stock item Update");
              }
              else{
                this.common.showToast(result);
              }

              this.getStockItems();
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
              this.common.showError();
            });
        }
      });
    }
    else {
      this.common.params = null;
      const activeModal = this.modalService.open(StockitemComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.addStockItem(data.stockItem);
        }
      });
    }

  }

  addStockItem(stockItem) {
    console.log(stockItem);
    // const params ='';
    const params = {
      foid: 123,
      name: stockItem.name,
      code: stockItem.code,
      stocksubtypeid: stockItem.stockSubType.id,
      sales: stockItem.sales,
      purchase: stockItem.purchase,
      minlimit: stockItem.minlimit,
      maxlimit: stockItem.maxlimit,
      isactive: stockItem.isactive,
      inventary: stockItem.inventary,
      stockunit: stockItem.unit.id

    };

    console.log('params: ', params);
    this.common.loading++;

    this.api.post('Stock/InsertStockItem', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        let result=res['data'][0].save_stockitem;
        if(result==''){
          this.common.showToast(" Stock item Add");
        }
        else{
          this.common.showToast(result);
        }
        this.getStockItems();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  updateStockItem(stockItemid, stockItem) {
    console.log("update in stock item:", stockItem);
    console.log("update in stock id:", stockItemid);
    // const params ='';
    // const params = {
    //   name: stockItem.name,
    //   code: stockItem.code,
    //   stocksubtypeid: stockItem.stockSubType.id,
    //   sales: stockItem.sales,
    //   purchase: stockItem.purchase,
    //   minlimit: stockItem.minlimit,
    //   maxlimit: stockItem.maxlimit,
    //   isactive: stockItem.isactive,
    //   inventary: stockItem.inventary,
    //   stockunit: stockItem.unit.id,
    //   stockItemid: stockItemid
    // };

    // console.log('paramsans: ', params);
    // this.common.loading++;

    // this.api.post('Stock/UpdateStockItem', params)
    //   .subscribe(res => {
    //     this.common.loading--;
    //     console.log('res: ', res);
    //     this.getStockItems();
    //   }, err => {
    //     this.common.loading--;
    //     console.log('Error: ', err);
    //     this.common.showError();
    //   });

  }
  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event, this.activeId);
    if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.StockItems.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.StockItems.length - 1) this.selectedRow++;

    }
  }
}
