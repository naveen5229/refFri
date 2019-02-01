import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'stockitem',
  templateUrl: './stockitem.component.html',
  styleUrls: ['./stockitem.component.scss']
})
export class StockitemComponent implements OnInit {

  stockItem = {
    name: '',
    code: '',
    maxlimit :'',
    minlimit :'',
    isactive :'',
    sales :'',
    purchase:'',
    inventary:'',
    unit: {
      name: '',
      id: ''
    },
    stockSubType: {
      name: '',
      id: ''
    },
    user: {
      name: '',
      id: ''
    }

  };


  showSuggestions = {
    user: false,
    stockType: false
  };

  suggestions = {
    users: [],
    stockTypes: []
  };

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
      console.log(this.common.params);
    if (this.common.params) {
      this.stockItem = {
        name: this.common.params.name,
        code: this.common.params.code,
        unit: {
          name: this.common.params.stockunitname,
          id: this.common.params.stockunit_id
        },
        stockSubType: {
          name: this.common.params.stoctsubtypename,
          id: this.common.params.stocktypeid
        },
        user: {
          name: '',
          id: ''
        },
        maxlimit: common.params.min_limit,
        minlimit : common.params.min_limit,
        isactive : common.params.is_active,
        sales : common.params.for_sales,
        purchase   : common.params.for_purchase,
        inventary : common.params.for_inventory
      }

      console.log('Stock: ', this.stockItem);
    }
  }


  ngOnInit() {
  }

  onSelected(selectedData, type, display) {
    this.stockItem[type].name = selectedData[display];
    this.stockItem[type].id = selectedData.id;
    //console.log('Stock Unit: ', this.stockItem);
  }



  dismiss(response) {
    console.log('Stock Type:', this.stockItem);
    this.activeModal.close({ response: response, stockItem: this.stockItem });
  }
}
