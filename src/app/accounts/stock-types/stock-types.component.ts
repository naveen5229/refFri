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

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
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

  openStockTypeModal(stockType?) {
    if (stockType) this.common.params = stockType;
    const activeModal = this.modalService.open(StockTypeComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        if (stockType) {
          this.updateStockType(stockType.id, data.stockType);
          return;
        }
        this.addStockType(data.stockType)
      }
    });
  }

  openEditStockTypeModal(id) {
    console.log(id);
  }


  addStockType(stockType) {
    const params = {
      foid: stockType.user.id,
      name: stockType.name,
      code: stockType.code
    };

    this.common.loading++;

    this.api.post('Stock/InsertStockType', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.getStockTypes();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  updateStockType(id, stockType) {
    const params = {
      foid: stockType.user.id,
      name: stockType.name,
      code: stockType.code,
      id: id
    };

    this.common.loading++;

    this.api.post('Stock/UpdateStockType', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.getStockTypes();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

}
