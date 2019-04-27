import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockitemComponent } from '../../acounts-modals/stockitem/stockitem.component';

@Component({
  selector: 'tyre-modals',
  templateUrl: './tyre-modals.component.html',
  styleUrls: ['./tyre-modals.component.scss','../../pages/pages.component.css', '../tyres.component.css']
})
export class TyreModalsComponent implements OnInit {
public modals =[];
public items = [];
public selectedModal="0";
  constructor(
    public api:ApiService,
    public common:CommonService,
    public modalService:NgbModal
  ) {
    this.getModals();
    this.getStockItems()
   }

  ngOnInit() {
  }

  getModals() {
    let params = "typeId=-1";
    console.log("params ", params)
    this.api.get('Stock/getModals?'+ params)
      .subscribe(res => {
        this.modals = res['data'];
        console.log("getTyreModals",this.selectedModal = this.modals[0].name, this.modals);
       // this.selectedModal = ''+this.modals[0].name;
      }, err => {
        console.error(err);
        this.common.showError();
      });

  }

  getStockItems() {
    let params = "typeId=-1&stockSubTypeId="+this.selectedModal;
    console.log("params ", params)
    this.api.get('Stock/getStockItems?'+ params)
      .subscribe(res => {
        this.items = res['data'];
        console.log("getItems", this.items);

      }, err => {
        console.error(err);
        this.common.showError();
      });

  }
  openStockItemModal (stockitem?) {
    console.log('stockitem',stockitem);
       if (stockitem){ this.common.params = stockitem;
       }else {
        this.common.params = { stockType: { name: 'Tyre', id: -1 } };
       }
       console.log("this.common.params",this.common.params);
      const activeModal = this.modalService.open(StockitemComponent, { size: 'lg',  container: 'nb-layout', backdrop: 'static',keyboard :false });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        if (data.response) {
          if (stockitem) {
            this.updateStockItem(stockitem.id, data.stockitem);
            return;
          }
         this.addStockItem(data.stockItem);
        }
      });
    }

    addStockItem(stockItem) {
      console.log(stockItem);
     // const params ='';
       const params = {
          //foid: stockItem.user.id,
           name: stockItem.name,
          code: stockItem.code,
          stocksubtypeid: stockItem.stockSubType.id,
          sales: stockItem.sales,
          purchase: stockItem.purchase,
          minlimit: stockItem.minlimit,
          maxlimit: stockItem.maxlimit,
          isactive: stockItem.isactive,
          inventary: stockItem.inventary,
          stockunit  : stockItem.unit.id
         
       };
  
       console.log('params: ',params);
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
  
    updateStockItem(stockItemid,stockItem) {
      console.log(stockItem);
     // const params ='';
       const params = {
          //foid: stockItem.user.id,
           name: stockItem.name,
          code: stockItem.code,
          stocksubtypeid: stockItem.stockSubType.id,
          sales: stockItem.sales,
          purchase: stockItem.purchase,
          minlimit: stockItem.minlimit,
          maxlimit: stockItem.maxlimit,
          isactive: stockItem.isactive,
          inventary: stockItem.inventary,
          stockunit  : stockItem.unit.id,
          stockItemid :stockItemid
       };
  
       console.log('paramsans: ',params);
      this.common.loading++;
  
      this.api.post('Stock/UpdateStockItem', params)
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
