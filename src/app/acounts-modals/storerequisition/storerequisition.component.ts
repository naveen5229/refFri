import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { AccountService } from '../../services/account.service';



@Component({
  selector: 'storerequisition',
  templateUrl: './storerequisition.component.html',
  styleUrls: ['./storerequisition.component.scss']
})
export class StorerequisitionComponent implements OnInit {
  showConfirm = '';
  storeRequestName = '';
  allowBackspace = false;
  StockQuestiondata = [];
  storeRequestStockId = 0;
  pendingid = 0;
  totalitem = 0;
  mannual=false;
  approveId=0;
  storeQuestion = {
    requestdate: this.common.dateFormatternew(new Date()).split(' ')[0],
    issuedate: null,
    code: '',
    custcode: '',
    approved: this.mannual,
    deltereview: 0,
    delete: 0,
    id: 0,
    requesttype: {
      name: '',
      id: 0
    },
    frombranch: {
      name: '',
      id: 0
    },
    tobranch: {
      name: '',
      id: 0
    },
    details: [{
      remarks: '',
      qty: 0,
      issueqty: null,
      issuerate: null,
      issueamount: null,
      issueremarks: null,
      issuewarehouse: {
        name: '',
        id: null
      },
      warehouse: {
        name: '',
        id: 0
      },
      stockitem: {
        name: '',
        id: 0
      },
      stockunit: {
        name: '',
        id: 0
      }
    }]

  }

  suggestions = {
    purchaseLedgers: [],
    supplierLedgers: [],
    stockItems: [],
    branchdata: [],
    salesstockItems: [],
    discountLedgers: [],
    warehouses: [],
    storerequestiontype: [],
    list: [],
    transferwarehouses: []
  };
  suggestionIndex = -1;

  activeId = '';
  lastActiveId = '';

  autoSuggestion = {
    data: [],
    targetId: '',
    display: ''
  };
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public accountService: AccountService) {
console.log('store request ',this.common.params);
    this.storeRequestStockId = this.common.params.storeRequestId;
    this.storeQuestion.requesttype.id = this.common.params.storeRequestId;
    this.pendingid = this.common.params.pendingid;
    console.log('stock Request Id', this.pendingid);
    this.common.handleModalSize('class', 'modal-lg', '1150');

    this.storeRequestName = (this.storeRequestStockId == -2) ? 'Store Request' : (this.storeRequestStockId == -3) ? 'Stock Issue' : 'Stock Transfer';

    this.getBranchList();
    this.getStockItems();
    this.getWarehouses();
    this.storeRequestionType();
    
    if (this.common.params.approveId && (this.common.params.approveId==1)) {
      this.approveId=this.common.params.approveId;
    }
    this.mannual= this.accountService.selected.branch.is_inv_manualapprove;
    if (this.common.params.stockQuestionId) {
      this.getStockRequestionForIssue(this.common.params.stockQuestionId, this.common.params.stockQuestionBranchid, this.common.params.storeRequestId);
    }
    this.setFoucus('code');
  }

  ngOnInit() {
  }

  getBranchList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetBranchList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.branchdata = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  getbranchdata(branchid) {
    this.common.loading++;
    this.api.get('Suggestion/GetWareHouse?search=123&branchid=' + branchid)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.transferwarehouses = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  getStockRequestionForIssue(stockQuesionid, stockQuestionBranchId, storeRequestId) {
    let params = {
      stockQuesionid: stockQuesionid,
      stockQuestionBranchId: stockQuestionBranchId,
      storeRequestId: storeRequestId,
      pendingid: this.pendingid
    };
    this.common.loading++;
    this.api.post('Company/GetStoreReQuestionForissue', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res123:', res['data']);
        this.StockQuestiondata = res['data'];
        this.storeQuestion = {
          requestdate: this.common.dateFormatternew(this.StockQuestiondata[0].y_req_date),
          issuedate: (this.storeRequestStockId == -3) ? this.common.dateFormatternew(new Date()).split(' ')[0] : this.common.dateFormatternew(this.StockQuestiondata[0].y_issue_date),
          code: this.StockQuestiondata[0].y_code,
          custcode: this.StockQuestiondata[0].y_cust_code,
          approved:(this.StockQuestiondata[0].y_for_approved)? false : this.StockQuestiondata[0].y_for_approved,
          deltereview: (this.StockQuestiondata[0].y_del_review == false ? 0 : 1),
          delete: (this.StockQuestiondata[0].y_deleted == false ? 0 : 1),
          id: this.StockQuestiondata[0].y_id,
          requesttype: {
            name: '',
            id: this.StockQuestiondata[0].y_req_typeid
          },
          frombranch: {
            name: this.StockQuestiondata[0].y_from_fobranch_name,
            id: this.StockQuestiondata[0].y_from_fobranch_id
          },
          tobranch: {
            name: this.StockQuestiondata[0].y_to_fobranch_name,
            id: this.StockQuestiondata[0].y_to_fobranch_id
          },
          details: []
        }
        if(this.approveId==0){
        this.mannual=(this.StockQuestiondata[0].y_for_approved)? false : this.StockQuestiondata[0].y_for_approved;
        }
        this.StockQuestiondata.map((stoQuestionDetail, index) => {
          if (!this.storeQuestion.details[index]) {
            this.addAmountDetails();
          }
          this.storeQuestion.details[index].remarks = stoQuestionDetail.y_dtl_req_remark;
          this.storeQuestion.details[index].qty = stoQuestionDetail.y_dtl_req_qty;
          this.storeQuestion.details[index].issueqty = stoQuestionDetail.y_dtl_issue_qty;
          this.storeQuestion.details[index].issuerate = stoQuestionDetail.y_dtl_issue_rate;
          this.storeQuestion.details[index].issueamount = stoQuestionDetail.y_dtl_issue_amount;
          this.storeQuestion.details[index].issueremarks = stoQuestionDetail.y_dtl_issue_remark;
          this.storeQuestion.details[index].issuewarehouse.id = stoQuestionDetail.y_dtl_issue_warehouse_id;
          this.storeQuestion.details[index].issuewarehouse.name = stoQuestionDetail.y_issue_warehouse_name;
          this.storeQuestion.details[index].warehouse.id = stoQuestionDetail.y_dtl_req_warehouse_id;
          this.storeQuestion.details[index].warehouse.name = stoQuestionDetail.y_req_warehouse_name;
          this.storeQuestion.details[index].stockitem.id = stoQuestionDetail.y_dtl_req_stockitemid;
          this.storeQuestion.details[index].stockitem.name = stoQuestionDetail.y_req_stockitem_name;
          this.storeQuestion.details[index].stockunit.id = stoQuestionDetail.y_dtl_req_stockunitid;
          this.storeQuestion.details[index].stockunit.name = stoQuestionDetail.y_req_stockunit_name;
        });
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  storeRequestionType() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/storeRequestionType', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.storerequestiontype = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  getStockItems() {
    this.common.loading++;
    this.api.get('Suggestion/GetStockItem?search=123&invoicetype=' + 'none')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.stockItems = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  getWarehouses() {
    this.common.loading++;
    this.api.get('Suggestion/GetWareHouse?search=123')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.warehouses = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }


  addAmountDetails() {
    this.storeQuestion.details.push({

      remarks: '',
      qty: 0,
      issueqty: null,
      issuerate: null,
      issueamount: null,
      issueremarks: null,
      issuewarehouse: {
        name: '',
        id: null
      },
      warehouse: {
        name: '',
        id: 0
      },
      stockitem: {
        name: '',
        id: 0
      },
      stockunit: {
        name: '',
        id: 0
      }

    });
    let index = parseInt(this.activeId.split('-')[1]);
    this.setFoucus('warehouse-' + (index + 1));
  }

  modelCondition() {
    this.activeModal.close({response:false});
    event.preventDefault();
    return;
  }


  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);
    this.setAutoSuggestion();
    if (this.activeId.includes('qty-') && (this.storeRequestStockId == -1 || this.storeRequestStockId == -3)) {
      let index = parseInt(this.activeId.split('-')[1]);
       console.log('available item111',this.totalitem, (document.getElementById(this.activeId)['value']));
      setTimeout(() => {
        if (this.totalitem < (parseInt(document.getElementById(this.activeId)['value']))) {
          alert('Quantity is lower then available quantity');
          this.storeQuestion.details[index].issueqty = 0;
        }
      }, 50);

    }

    if (key == 'enter') {
      if (this.activeId.includes('requesttype')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        this.setFoucus('frombranch');
      } else if (this.activeId.includes('frombranch')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        this.setFoucus('tobranch');
      } else if (this.activeId.includes('tobranch')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        this.setFoucus('requestdate');
      } else if (this.activeId.includes('requestdate')) {
        this.setFoucus('warehouse' + '-' + 0);
      } else if (this.activeId.includes('issuedate')) {
        this.setFoucus('issueqty-0');
      } else if (this.activeId.includes('custcode')) {
        let index = parseInt(this.activeId.split('-')[1]);
        this.setFoucus('tobranch');

      } else if (this.activeId.includes('code')) {
        this.setFoucus('custcode');
      } else if (this.activeId.includes('stockitem')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        let index = parseInt(this.activeId.split('-')[1]);
        if (this.storeRequestStockId == -1) {
          this.setFoucus('issueqty' + '-' + index);
        } else {
          this.setFoucus('qty' + '-' + index);
        }
      } else if (this.activeId.includes('issueqty')) {
        let index = parseInt(this.activeId.split('-')[1]);
        if (this.storeRequestStockId == -1) {
          this.setFoucus('issuerate' + '-' + index);
        } else {
          this.setFoucus('issuewarehouse' + '-' + index);
        }
        if (this.storeQuestion.requesttype.id == -1) {
          this.storeQuestion.details[index].qty = this.storeQuestion.details[index].issueqty;
        }
      } else if (this.activeId.includes('qty')) {
        let index = parseInt(this.activeId.split('-')[1]);
        if (this.storeQuestion.requesttype.id == -1) {
          this.setFoucus('issuerate' + '-' + index);
        } else {
          this.setFoucus('remarks' + '-' + index);
        }
      } else if (this.activeId.includes('issuerate')) {
        let index = parseInt(this.activeId.split('-')[1]);
        if (this.storeRequestStockId == -3) {
          this.setFoucus('issueremarks' + '-' + index);
        } else if (this.storeRequestStockId == -1) {
          this.setFoucus('remarks' + '-' + index);
        } else {
          this.setFoucus('issueamount' + '-' + index);
        }
      } else if (this.activeId.includes('issueamount')) {
        let index = parseInt(this.activeId.split('-')[1]);
        console.log('issue amount ', this.storeQuestion.requesttype.id);
        if (this.storeRequestStockId == -3) {
          this.setFoucus('issueremarks' + '-' + index);
        } else {
          this.setFoucus('remarks' + '-' + index);
        }
      } else if (this.activeId.includes('issueremarks')) {
        let index = parseInt(this.activeId.split('-')[1]);
        if (this.storeQuestion.requesttype.id == -1) {
          this.setFoucus('issuerate' + '-' + index);
        } else {
          this.setFoucus('plustransparent');
        }
      } else if (this.activeId.includes('remarks')) {
        let index = parseInt(this.activeId.split('-')[1]);

        if (this.storeQuestion.requesttype.id == -1) {
          this.setFoucus('plustransparent' + '-' + index);
        } else {
          this.setFoucus('issueremarks' + '-' + index);
        }
      } else if (this.activeId.includes('issuewarehouse')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        let index = parseInt(this.activeId.split('-')[1]);
        if (this.storeQuestion.requesttype.id == -1) {
          this.setFoucus('stockitem' + '-' + index);
        } else {
          this.setFoucus('issuerate' + '-' + index);
        }
      } else if (this.activeId.includes('warehouse')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        let index = parseInt(this.activeId.split('-')[1]);
        if (this.storeQuestion.requesttype.id == -1) {
          this.setFoucus('issuewarehouse' + '-' + index);
        } else {
          this.setFoucus('stockitem' + '-' + index);
        }
      }
    } else if (key.includes('arrow')) {
      if (key.includes('arrowup') || key.includes('arrowdown')) {
        this.handleArrowUpDown(key);
        event.preventDefault();
      }
    }
  }



  dismiss(response) {
    if (response) {
      this.addStoreRequestion(this.storeQuestion);
    }
    this.activeModal.close({ response: true, Voucher: this.storeQuestion });
  }


  addStoreRequestion(Storerequestion) {
    console.log('new store Requestion', Storerequestion);
    const params = {
      requesttype: Storerequestion.requesttype.id,
      frombranch: Storerequestion.frombranch.id,
      tobranch: Storerequestion.tobranch.id,
      code: Storerequestion.code,
      custcode: Storerequestion.custcode,
      issuedate: Storerequestion.issuedate,
      requestdate: Storerequestion.requestdate,
      Details: Storerequestion.details,
      approved: Storerequestion.approved,
      delete: Storerequestion.delete,
      deltereview: Storerequestion.deltereview,
      x_id: Storerequestion.id
    };

    console.log('params11: ', params);
    this.common.loading++;

    this.api.post('Company/InsertStoreRequestion', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.setFoucus('ordertype');
        this.common.showToast('Store Requestion Are Saved');
        return;
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  onSelected(selectedData, type, display) {
    this.storeQuestion[type].name = selectedData[display];
    this.storeQuestion[type].id = selectedData.id;
  }

  onSelectedaddress(selectedData, type, display) {
    this.storeQuestion[type].name = selectedData[display];
    this.storeQuestion[type].id = selectedData.id;
  }

  setFoucus(id, isSetLastActive = true) {
    console.log('Id: ', id);
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      this.setAutoSuggestion();
    }, 100);
  }


  generateIDs() {
    let IDs = ['frombranch', 'tobranch', 'requesttype'];
    this.storeQuestion.details.map((details, index) => {
      IDs.push('stockitem-' + index);
      IDs.push('issuewarehouse-' + index);
      IDs.push('warehouse-' + index);
      IDs.push('stockunit-' + index);
    });
    return IDs;
  }

  getSuggestions() {
    const element = document.getElementById(this.activeId);
    const search = element ? element['value'] ? element['value'].toLowerCase() : '' : '';
    // console.log('Search: ', search, this.activeId);
    let suggestions = [];
    // if (this.activeId == 'ordertype') {
    //   if (element['value']) {
    //     suggestions = this.suggestions.invoiceTypes.filter(invoiceType => invoiceType.name.replace(/\./g, "").toLowerCase().includes(search));
    //     suggestions.splice(10, suggestions.length - 1)
    //   }
    // }
    // purchaseledger stockitem-
    this.suggestions.list = suggestions;
    return this.suggestions.list;

  }
  handleArrowUpDown(key) {
    const suggestionIDs = this.generateIDs();
    console.log('Key:', key, suggestionIDs, suggestionIDs.indexOf(this.activeId));
    if (suggestionIDs.indexOf(this.activeId) == -1) return;

    if (key == 'arrowdown') {
      if (this.suggestionIndex != this.suggestions.list.length - 1) this.suggestionIndex++;
      else this.suggestionIndex = 0;
    } else {
      if (this.suggestionIndex != 0) this.suggestionIndex--;
      else this.suggestionIndex = this.suggestions.list.length - 1;
    }

  }


  selectSuggestion(suggestion, id?) {
    console.log('Suggestion: ', suggestion);
    if (this.activeId == 'frombranch') {
      this.storeQuestion.frombranch.name = suggestion.name;
      this.storeQuestion.frombranch.id = suggestion.id;
    } else if (this.activeId == 'tobranch') {
      this.storeQuestion.tobranch.name = suggestion.name;
      this.storeQuestion.tobranch.id = suggestion.id;
      if (this.storeQuestion.requesttype.id == -1) {
        this.getbranchdata(suggestion.id);
      }
    } else if (this.activeId == 'requesttype') {
      this.storeQuestion.requesttype.name = suggestion.name;
      this.storeQuestion.requesttype.id = suggestion.id;
    } else if (this.activeId.includes('issuewarehouse')) {
      let index = parseInt(this.activeId.split('-')[1]);
      this.storeQuestion.details[index].issuewarehouse.name = suggestion.name;
      this.storeQuestion.details[index].issuewarehouse.id = suggestion.id;
    } else if (this.activeId.includes('warehouse')) {
      let index = parseInt(this.activeId.split('-')[1]);
      this.storeQuestion.details[index].warehouse.name = suggestion.name;
      this.storeQuestion.details[index].warehouse.id = suggestion.id;
    } else if (this.activeId.includes('stockitem')) {
      let index = parseInt(this.activeId.split('-')[1]);
      this.storeQuestion.details[index].stockitem.name = suggestion.name;
      this.storeQuestion.details[index].stockitem.id = suggestion.id;
      this.storeQuestion.details[index].stockunit.name = suggestion.stockname;
      this.storeQuestion.details[index].stockunit.id = suggestion.stockunit_id;
    }

  }


  setAutoSuggestion() {
    let activeId = document.activeElement.id;
    if ((activeId.includes('issuewarehouse')) && (this.storeQuestion.requesttype.id == -1)) { console.log('issyue'); this.autoSuggestion.data = this.suggestions.transferwarehouses; }
    else if (activeId == 'frombranch' || activeId == 'tobranch') this.autoSuggestion.data = this.suggestions.branchdata;
    else if (activeId == 'requesttype') this.autoSuggestion.data = this.suggestions.storerequestiontype;
    else if (activeId.includes('warehouse') || activeId.includes('issuewarehouse')) this.autoSuggestion.data = this.suggestions.warehouses;
    else if (activeId.includes('stockitem')) this.autoSuggestion.data = this.suggestions.stockItems;
    else if (activeId.includes('discountledger')) this.autoSuggestion.data = this.suggestions.purchaseLedgers;

    else {
      this.autoSuggestion.data = [];
      this.autoSuggestion.display = '';
      this.autoSuggestion.targetId = '';
      return;
    }

    this.autoSuggestion.display = 'name';
    this.autoSuggestion.targetId = activeId;
    console.log('Auto Suggestion: ', this.autoSuggestion);
  }


  onSelect(suggestion, activeId) {
    console.log('Suggestion: ', suggestion);
    if (activeId == 'frombranch') {
      this.storeQuestion.frombranch.name = suggestion.name;
      this.storeQuestion.frombranch.id = suggestion.id;

    } else if (activeId == 'tobranch') {
      this.storeQuestion.tobranch.name = suggestion.name;
      this.storeQuestion.tobranch.id = suggestion.id;
      if (this.storeQuestion.requesttype.id == -1) {
        this.getbranchdata(suggestion.id);
      }
    }
    else if (activeId == 'requesttype') {
      this.storeQuestion.requesttype.name = suggestion.name;
      this.storeQuestion.requesttype.id = suggestion.id;
    } else if (activeId.includes('issuewarehouse')) {
      let index = parseInt(this.activeId.split('-')[1]);
      this.storeQuestion.details[index].issuewarehouse.name = suggestion.name;
      this.storeQuestion.details[index].issuewarehouse.id = suggestion.id;
    }
    else if (activeId.includes('warehouse')) {
      let index = parseInt(this.activeId.split('-')[1]);
      this.storeQuestion.details[index].warehouse.name = suggestion.name;
      this.storeQuestion.details[index].warehouse.id = suggestion.id;
    } else if (activeId.includes('stockitem')) {
      let index = parseInt(this.activeId.split('-')[1]);
      this.storeQuestion.details[index].stockitem.name = suggestion.name;
      this.storeQuestion.details[index].stockitem.id = suggestion.id;
      this.storeQuestion.details[index].stockunit.name = suggestion.stockname;
      this.storeQuestion.details[index].stockunit.id = suggestion.stockunit_id;
    }
  }

  getStockAvailability() {
    let activeId = document.activeElement.id;
    const index = parseInt(activeId.split('-')[1]);
    console.log('hello dear', activeId, 'index', index, 'value detail', this.storeQuestion.details[index].stockitem.id);
    let totalitem = 0;
    let stockid = 0;
    let params = {
      stockid: this.storeQuestion.details[index].stockitem.id,
      wherehouseid: this.storeQuestion.details[index].warehouse.id
    };
    //  this.common.loading++;
    this.api.post('Suggestion/GetStockItemAvailableQty', params)
      .subscribe(res => {
        console.log('total item available:', res['data'][0].get_stockitemavailableqty);
        this.totalitem = res['data'][0].get_stockitemavailableqty;
        return this.totalitem;
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }


  approveDeleteFunction(type, typeans,xid) {
    console.log('type',type,'typeans',typeans,'xid',xid);
    let params = {
      id: xid,
      flagname: (type == 1) ? 'deleted' : 'forapproved',
      flagvalue: typeans
    };
    this.common.loading++;
    this.api.post('Company/storeRequstionDeleteApprooved', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        //this.getStockItems();
        this.activeModal.close({ response: true });
        if (type == 1 && typeans == 'true') {
          this.common.showToast(" This Value Has been Deleted!");
        } else if (type == 1 && typeans == 'false') {
          this.common.showToast(" This Value Has been Restored!");
        } else {
          this.common.showToast(" This Value Has been Approved!");
        }
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError('This Value has been used another entry!');
      });
  }
}
