import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StockSubtypeComponent } from '../../acounts-modals/stock-subtype/stock-subtype.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { from } from 'rxjs';
@Component({
  selector: 'stock-subtypes',
  templateUrl: './stock-subtypes.component.html',
  styleUrls: ['./stock-subtypes.component.scss']
})
export class StockSubtypesComponent implements OnInit {
  stockSubTypes = [];
  selectedName = '';
  selectedRow = -1;
  activeId = '';
  pageName="";
  constructor(private activeModal: NgbActiveModal,
    public api: ApiService,
    public modalService: NgbModal,
    public common: CommonService) {
      if(this.common.params && this.common.params.pageName){
        this.pageName=this.common.params.pageName;
    }
    this.getStockSubTypes();
    this.common.currentPage = 'Stock Sub Types';
    this.common.refresh = this.refresh.bind(this);

  }
 


  ngOnInit() {
  }
  refresh(){
    this.getStockSubTypes();
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
        }
        else {
          this.common.showToast(result);
        }
        this.getStockSubTypes();
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
        this.getStockSubTypes();
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

  delete(tblid) {
    let params = {
      id: tblid,
      tblidname: 'id',
      tblname: 'stocksubtype'
    };
    if (tblid) {
      console.log('city', tblid);
      this.common.params = {
        title: 'Delete City ',
        description: `<b>&nbsp;` + 'Are you sure want to delete' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("data", data);
          this.common.loading++;
          this.api.post('Stock/deletetable', params)
            .subscribe(res => {
              this.common.loading--;
              console.log('res: ', res);
              this.getStockSubTypes();
              this.common.showToast(" This Value Has been Deleted!");
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
              this.common.showError('This Value has been used another entry!');
            });
        }
      });
    }
  }
  modelCondition() {
    this.activeModal.close({ });
    event.preventDefault();
    return;
  }
}
