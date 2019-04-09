import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockTypeComponent } from '../../acounts-modals/stock-type/stock-type.component';
import { UserService } from '../../@core/data/users.service';


@Component({
  selector: 'stock-types',
  templateUrl: './stock-types.component.html',
  styleUrls: ['./stock-types.component.scss']
})
export class StockTypesComponent implements OnInit {

  stockTypes = [];
  selectedRow = -1;
  activeId = '';
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.getStockTypes();
    this.common.currentPage = 'Stock Types';
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }
  refresh() {
    console.log('Refresh');
    this.getStockTypes();
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

  openStockTypeModal(stockType?) {
    if (stockType) {
      console.log("data:", stockType);
      this.common.params = stockType;
      const activeModal = this.modalService.open(StockTypeComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        if (data.response) {
          const params = {
            foid: 123,
            name: data.stockType.name,
            code: data.stockType.code,
            id: stockType.id
          };
      
          this.common.loading++;
      
          this.api.post('Stock/UpdateStockType', params)
            .subscribe(res => {
              this.common.loading--;
              console.log('res: ', res);
              let result = res['data'][0].save_stocktype;
              if (result == '') {
                this.common.showToast(" Stock Type Update");
              }
              else {
                this.common.showToast(result);
              }
              this.getStockTypes();
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
      const activeModal = this.modalService.open(StockTypeComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        if (data.response) {
          this.addStockType(data.stockType)
        }
      });

    }
  }

  openEditStockTypeModal(id) {
    console.log(id);
  }


  addStockType(stockType) {
    const params = {
      foid: 123,
      name: stockType.name,
      code: stockType.code
    };

    this.common.loading++;

    this.api.post('Stock/InsertStockType', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        let result = res['data'][0].save_stocktype;
        if (result == '') {
          this.common.showToast(" Stock Type Add");
        }
        else {
          this.common.showToast(result);
        }
        this.getStockTypes();
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
    if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.stockTypes.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.stockTypes.length - 1) this.selectedRow++;

    }
  }

}
