import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'stockitem',
  templateUrl: './stockitem.component.html',
  styleUrls: ['./stockitem.component.scss']
})
export class StockitemComponent implements OnInit {
  showConfirm = false;
  showExit = false;
  StockTypeItemsdata = [];
  stockItem = {
    name: '',
    maxlimit: null,
    minlimit: null,
    isactive: true,
    sales: false,
    purchase: false,
    inventary: true,
    unit: {
      name: '',
      id: ''
    },
    stockType: {
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
    },
    isnon:true,
    hsnno:0,
    hsndetail:'',
    gst:false,
    cess:0,
    igst:0,
    taxability:'',
    calculationtype:'',
    openingbal:0,
    openingqty:0

  };
  activeId='stockType';
  suggestionIndex = -1;
  showSuggestions = {
    user: false,
    stockType: false
  };
  autoSuggestion = {
    data: [],
    targetId: '',
    display: ''
  };
  // suggestions = {
  //   users: [],
  //   stockTypes: []
  // };

  allowBackspace = true;
  stockTypeName = '';
  stockSubType = [];
  unitData =[];
  sizeIndex=0;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
      console.log("open data model data:",this.common.params);
    if (this.common.params) {
      this.sizeIndex =this.common.params.sizeIndex;
      this.stockItem = {
        name: this.common.params.name,
        unit: {
          name: this.common.params.stockunitname,
          id: this.common.params.stockunit_id
        },
        stockSubType: {
          name: this.common.params.stoctsubtypename,
          id: this.common.params.stocksubtype_id
        },
        stockType:{
          id:this.common.params.stocktype_id,
          name:this.common.params.stocktype_name
        } ,
        user: {
          name: '',
          id: ''
        },
        maxlimit: this.common.params.max_limit,
        minlimit: common.params.min_limit,
        isactive: common.params.is_active,
        sales: common.params.for_sales,
        purchase: common.params.for_purchase,
        inventary: common.params.for_inventory,
        isnon:common.params.gst_is_non,
        hsnno:common.params.gst_hsn_sac_no,
        hsndetail:common.params.gst_hsn_sac_desc,
        gst:common.params.gst_is_applicable,
        cess:common.params.gst_cess_per,
        igst:common.params.gst_igst_per,
        taxability:common.params.gst_taxability,
        calculationtype:common.params.gst_calculation_type,
        openingbal:common.params.opening_balance,
        openingqty:common.params.opening_qty
      }

      console.log('Stock: ', this.stockItem);
    }
    console.log('testing purpose', this.stockTypeName);
    this.getStockType();
    this.setFoucus('stockType');
    this.setAutoSuggestion();
    this.getUnit();
    this.common.handleModalSize('class', 'modal-lg', '1150','px',this.sizeIndex)
  }


  ngOnInit() {
  }

  // handleArrowUpDown(key) {
  //   const suggestionIDs = this.generateIDs();
  //   console.log('Key:', key, suggestionIDs, suggestionIDs.indexOf(this.activeId));
  //   if (suggestionIDs.indexOf(this.activeId) == -1) return;

  //   if (key == 'arrowdown') {
  //     if (this.suggestionIndex != this.suggestions.list.length - 1) this.suggestionIndex++;
  //     else this.suggestionIndex = 0;
  //   } else {
  //     if (this.suggestionIndex != 0) this.suggestionIndex--;
  //     else this.suggestionIndex = this.suggestions.list.length - 1;
  //   }

  //   // this.voucher.amountDetails[index].ledger.name = this.ledgers.suggestions[this.activeLedgerIndex].y_ledger_name;
  //   // this.voucher.amountDetails[index].ledger.id = this.ledgers.suggestions[this.activeLedgerIndex].y_ledger_id;
  // }
  suggestions = {
    underGroupdata: [],
    supplierLedgers: [],
    state: [],
    salutiondata: [],
    city: [],
    list: [],
    gstcalcution:[
      {
        name:'On Value',
        id:'value'
      },
      {
        name:'On Time Rate',
        id:'rate'
      }
    ],
    taxability:[
      {
        name:'Unknown',
        id:'Unknown'
      },
      {
        name:'Exempt',
        id:'Exempt'
      },
      {
        name:'Nil Rated',
        id:'rated'
      },
      {
        name:'Taxable',
        id:'Taxable'
      }
    ]
  };
  generateIDs() {
    let IDs = ['stockType','taxability','calculationtype'];
   
    return IDs;
  }

  getStockType() {
    let params = {
      search: 123
    };

    this.common.loading++;
    this.api.post('Suggestion/GetTypeOfStock', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('StockTypeItemsdata 22:', res['data']);
        this.StockTypeItemsdata = res['data'];
        
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getUnit() {
    let params = {
      search: 123
    };

    this.common.loading++;
    this.api.post('Suggestion/getUnit', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('StockTypeItemsdata 22:', res['data']);
        this.unitData = res['data'];
        
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  
  getStockSubType(stocktypeid) {
    let params = {
      stocktype: stocktypeid
    };

    this.common.loading++;
    this.api.post('Suggestion/GetSearchStockType', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.stockSubType = res['data'];
        this.autoSuggestion.data= res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }


  
  onSelected(selectedData, type, display) {
    this.stockItem[type].name = selectedData[display];
    this.stockItem[type].id = selectedData.id;
    console.log('Stock Unit: ', this.stockItem);
  }
  onSubTypeSelected(selectedData, type, display) {
    this.stockItem[type].name = selectedData[display];
    this.stockItem[type].id = selectedData.id;
    this.getStockSubType(selectedData.id);
  }
 


  dismiss(response) {
    console.log('Stock Type:', this.stockItem);
    if((this.stockItem.name.trim()) ==''){
      this.common.showError('Please Fill Stock Item Name');
    }else{
    this.activeModal.close({ response: response, stockItem: this.stockItem });
    }
  }


  modelCondition(){
    this.showConfirm = false;
    event.preventDefault();
    return;
   }
   modelConditionfirst(){
    this.activeModal.close({ response: false, stockItem: this.stockItem });
   }
  keyHandler(event) {
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;
    console.log('Active Id', activeId);
    this.setAutoSuggestion();
    if (event.key == "Escape") {
      this.showExit = true;
    }
    if (this.showExit) {
      if (key == 'y' || key == 'enter') {
        this.showExit = false;
        event.preventDefault();
        this.activeModal.close();
        return;
        // this.close();
      } else if (key == 'n') {
        this.showExit = false;
        event.preventDefault();
        return;

      }

    }

    if (this.showConfirm) {
      if (key == 'y' || key == 'enter') {
        console.log('Ledgers show stockType:', this.stockItem);
        this.dismiss(true);
      //  this.common.showToast('Your Value Has been saved!');
      }
      this.showConfirm = false;
      event.preventDefault();
      return;
    }

    if (key == 'enter') {
      this.allowBackspace = true;
      // console.log('active', activeId);
      // console.log('Active jj: ', activeId.includes('aliasname'));
      if (activeId.includes('stockType')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        this.setFoucus('stockSubType');
      } else if (activeId.includes('stockSubType')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        
        this.setFoucus('unit');
      } else if (activeId == 'unit') {
        this.setFoucus('name');
      } else if (activeId == 'code') {
        this.setFoucus('name');
      } else if (activeId == 'name') {
        this.setFoucus('maxlimit');
      } else if (activeId == 'maxlimit') {
        this.setFoucus('minlimit');
      } else if (activeId == 'minlimit') {
        this.setFoucus('isactive');
      }else if (activeId == 'openingbal') {
        this.setFoucus('openingqty');
      }else if (activeId == 'openingqty') {
        this.setFoucus('isactive');
      } else if (activeId == 'isactive' || activeId == 'notisactive') {
        this.setFoucus('sales');
      } else if (activeId == 'sales' || activeId == 'notsales') {
        this.setFoucus('purchase');
      } else if (activeId == 'purchase' || activeId == 'notpurchase') {
        this.setFoucus('inventary');
      }  else if (activeId == 'igst'  ) {
        this.setFoucus('cess');
      } else if (activeId == 'isnon' || activeId == 'notisnon') {
        this.setFoucus('calculationtype');
     //  this.showConfirm = true;
     }
      else if (activeId == 'inventary' || activeId == 'notinventary') {
         this.setFoucus('gst');
      //  this.showConfirm = true;
      }else if (activeId == 'gst' || activeId == 'notgst') {
        this.setFoucus('hsndetail');
     //  this.showConfirm = true;
     } else if (activeId == 'hsndetail') {
        this.setFoucus('hsnno');
       // this.showConfirm = true;
      }else if (activeId == 'hsnno') {
        this.setFoucus('notisnon');
       // this.showConfirm = true;
      }else if (activeId == 'cess') {
        // this.setFoucus('stock-name');
        this.showConfirm = true;
      }else if (activeId.includes('calculationtype')) {
        
        console.log('test??????');
        this.setFoucus('taxability');
      }else if (activeId.includes('taxability')) {
        
        console.log('test??????');        
        this.setFoucus('igst');
      }
    } else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', activeId);
      if (activeId == 'inventary' || activeId == 'notinventary') this.setFoucus('purchase');
      if (activeId == 'purchase' || activeId == 'notpurchase') this.setFoucus('sales');
      if (activeId == 'sales' || activeId == 'notsales') this.setFoucus('isactive');
      if (activeId == 'isactive' || activeId == 'notisactive') this.setFoucus('minlimit');
      if (activeId == 'openingqty') this.setFoucus('openingbal');
      if (activeId == 'openingbal') this.setFoucus('minlimit');
      if (activeId == 'minlimit') this.setFoucus('maxlimit');
      if (activeId == 'maxlimit') this.setFoucus('name');
      // if (activeId == 'name') this.setFoucus('code');
      // if (activeId == 'code') this.setFoucus('name');
      if (activeId == 'name') this.setFoucus('unit');
      if (activeId == 'unit') this.setFoucus('stockSubType');
      if (activeId == 'stockSubType') this.setFoucus('stockType');
      if (activeId == 'cess') this.setFoucus('igst');
      if (activeId == 'igst') this.setFoucus('taxability');
      if (activeId == 'taxability') this.setFoucus('calculationtype');
      if (activeId == 'calculationtype') this.setFoucus('notisnon');
      if (activeId == 'notisnon' || 'isnon') this.setFoucus('hsnno');
      if (activeId == 'hsnno') this.setFoucus('hsndetail');
      if (activeId == 'hsndetail') this.setFoucus('gst');
      if (activeId == 'gst') this.setFoucus('inventary');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if (key != 'backspace') {
      this.allowBackspace = false;
      //event.preventDefault();
    }


  }

  onSelect(suggestion, activeId) {
    console.log('Suggestion:>>>>>>>>>> ', suggestion,activeId);
    if (activeId == 'stockType') {
      this.stockItem.stockType.name = suggestion.name;
      this.stockItem.stockType.id = suggestion.id;
      this.getStockSubType(suggestion.id);   
    } else  if (activeId == 'stockSubType') {
      this.stockItem.stockSubType.name = suggestion.name;
      this.stockItem.stockSubType.id = suggestion.id;
    } else  if (activeId == 'unit') {
      this.stockItem.unit.name = suggestion.name;
      this.stockItem.unit.id = suggestion.id;
    } else  if (activeId == 'calculationtype') {
      console.log('suggestion with id calculate',suggestion);
      this.stockItem.calculationtype = suggestion.name;
      this.setFoucus('taxability');
    } else  if (activeId == 'taxability') {
      console.log('suggestion with id taxability',suggestion);
      this.stockItem.taxability = suggestion.name;
      this.setFoucus('igst');
    } 
  }


  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
    this.setAutoSuggestion();
  }
  
  selectSuggestion(suggestion, id?) {

    console.log('Suggestion: activeId +++: ', this.activeId,suggestion);
    if (this.activeId == 'stockType') {
      this.stockItem.stockType.name = suggestion.name;
      this.stockItem.stockType.id = suggestion.id;
      this.getStockSubType(suggestion.id);
    } else  if (this.activeId == 'stockSubType') {
      this.stockItem.stockSubType.name = suggestion.name;
      this.stockItem.stockSubType.id = suggestion.id;
    } else  if (this.activeId == 'calculationtype') {
      console.log('suggestion with id calculate',suggestion);
      this.stockItem.calculationtype = suggestion.name;
    } else  if (this.activeId == 'taxability') {
      console.log('suggestion with id taxability',suggestion);
      this.stockItem.taxability = suggestion.name;
    } 
    
  }

  setAutoSuggestion() {
    let activeId = document.activeElement.id;
  //  console.log('suggestion active', activeId, this.suggestions.underGroupdata);
    if (activeId == 'stockType') { 
      this.autoSuggestion.data = this.StockTypeItemsdata; 
    } else if (activeId == 'stockSubType') { 
     // console.log('hello',activeId);
      this.autoSuggestion.data = this.stockSubType; 
    } else if (activeId == 'unit') { 
      // console.log('hello',activeId);
      this.autoSuggestion.data = this.unitData; 
    }else if (activeId == 'calculationtype') { 
      // console.log('hello',activeId);
      this.autoSuggestion.data = this.suggestions.gstcalcution; 
    }else if (activeId == 'taxability') { 
      // console.log('hello',activeId);
      this.autoSuggestion.data = this.suggestions.taxability; 
    }
    

    
    // else if (activeId.includes('salutation-')) this.autoSuggestion.data = this.suggestions.salutiondata;
    // else if (activeId.includes('state-')) this.autoSuggestion.data = this.suggestions.state;
    // else if (activeId.includes('city-')) this.autoSuggestion.data = this.suggestions.city;
    else {
      this.autoSuggestion.data = [];
      this.autoSuggestion.display = '';
      this.autoSuggestion.targetId = '';
      return;
    }

    this.autoSuggestion.display = 'name';
    this.autoSuggestion.targetId = activeId;
   // console.log('Auto Suggestion: ', this.autoSuggestion);
  }


}
