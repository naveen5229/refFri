import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockitemComponent } from '../../acounts-modals/stockitem/stockitem.component';
import { StockSubtypeComponent } from '../../acounts-modals/stock-subtype/stock-subtype.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'battery-modals',
  templateUrl: './battery-modals.component.html',
  styleUrls: ['./battery-modals.component.scss']
})
export class BatteryModalsComponent implements OnInit {

  public modals = [];
  public items = [];
  public selectedModal = {
    id: 0,
    name: ''
  };
  constructor(
    public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal
  ) {
    this.common.refresh = this.refresh.bind(this);
    this.getModals();
    //this.getStockItems()
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    this.getModals();
  }

  getModals() {
    let params = "typeId=-2";
    console.log("params ", params)
    this.api.get('Stock/getModals?' + params)
      .subscribe(res => {
        this.modals = res['data'];
        console.log("getbatteryModals", this.selectedModal.id = this.modals[0].name, this.modals);
        // this.selectedModal = ''+this.modals[0].name;
      }, err => {
        console.error(err);
        this.common.showError();
      });

  }

  modalSelected() {
    console.log("selectedModal ", this.selectedModal, this.selectedModal.id, this.selectedModal.name);

    this.getStockItems();
  }

  getStockItems() {

    let params = "typeId=-2&stockSubTypeId=" + this.selectedModal.id;
    console.log("params ", params);
    this.api.get('Stock/getStockItems?' + params)
      .subscribe(res => {
        this.items = res['data'];
        console.log("getItems", this.items);

      }, err => {
        console.error(err);
        this.common.showError();
      });

  }
  openStockItemModal(stockitem?) {
    console.log('stockitem', stockitem);
    if (stockitem) {
      this.common.params = stockitem;
    } else {

      this.common.params = { stocktype_name: 'battery', stocktype_id: -2, stoctsubtypename: this.selectedModal.name, stocksubtype_id: this.selectedModal.id };
    }
    console.log("this.common.params", this.common.params);
    const activeModal = this.modalService.open(StockitemComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
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
      stockunit: stockItem.unit.id,
      gst:stockItem.gst,
      details:stockItem.hsndetail,
      hsnno:stockItem.hsnno,
      isnon:stockItem.isnon,
      cess:stockItem.cess,
     igst:stockItem.igst,
     taxability:stockItem.taxability,
     calculationtype:stockItem.calculationtype,
     openinngbal:stockItem.openingbal,
    openingqty:stockItem.openingqty
    };

    console.log('params: ', params);
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

  updateStockItem(stockItemid, stockItem) {
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
      stockunit: stockItem.unit.id,
      stockItemid: stockItemid
    };

    console.log('paramsans: ', params);
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

  //
  openStockSubTypeModal(stocksubType?) {
    if (stocksubType) {
      this.common.params = stocksubType;
    }
    else {
      this.common.params = { stocktypename: "battery", stocktype_id: -2 };
    }
    const activeModal = this.modalService.open(StockSubtypeComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
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
        let result = res['data'][0].save_stocksubtype;
        if (result == '') {
          this.common.showToast(" Stock SubType Add");
          this.getModals();
        }
        else {
          this.common.showToast(result);

        }
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
        let result = res['data'][0].save_stocksubtype;
        if (result == '') {
          this.common.showToast(" Stock SubType Update");
        }
        else {
          this.common.showToast(result);
        }
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

}
