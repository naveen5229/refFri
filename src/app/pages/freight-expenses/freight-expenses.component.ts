import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFreightExpensesComponent } from '../../modals/FreightRate/add-freight-expenses/add-freight-expenses.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { AddFreightRevenueComponent } from '../../modals/FreightRate/add-freight-revenue/add-freight-revenue.component';
import { TransferReceiptsComponent } from '../../modals/FreightRate/transfer-receipts/transfer-receipts.component';
import { SaveAdvicesComponent } from '../../modals/save-advices/save-advices.component';

@Component({
  selector: 'freight-expenses',
  templateUrl: './freight-expenses.component.html',
  styleUrls: ['./freight-expenses.component.scss']
})
export class FreightExpensesComponent implements OnInit {
  status = [{
    name: 'accept',
    id: '1'
  },
  {
    name: 'pending',
    id: '0'
  },
  {
    name: 'Reject',
    id: '-1'
  }]
  type = [{
    name: 'LR',
    id: '11'
  }, {
    name: 'Manifest',
    id: '12'
  },
  {
    name: 'Trip',
    id: '14'
  },
  {
    name: 'Any',
    id: '-1'
  }];

  actionTypes = [{
    name: 'Any',
    id: '-1'
  }, {
    name: 'Expense',
    id: '1'
  },
  {
    name: 'Revenue',
    id: '2'
  },
  {
    name: 'Transfer',
    id: '3'
  },
  {
    name: 'Advice',
    id: '4'
  }];
  statusid = 1;
  Typeid = -1;
  actionTypeId = -1;
  startTime = new Date(new Date().setDate(new Date().getDate() - 15));;
  endTime = new Date();
  data = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};
  constructor(
    public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal,
  ) {
    // let today;
    // today = new Date();
    // this.endDate = this.common.dateFormatter(today);
    // this.startDate = this.common.dateFormatter(new Date(today.setDate(today.getDate() - 15)));
    // console.log('dates ', this.endDate, this.startDate)
    this.getExpenses();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }


  getSelection() {

  }
  refresh() {
    this.getExpenses();

  }


  getExpenses() {
    var enddate = new Date(this.common.dateFormatter1(this.endTime).split(' ')[0]);
    let params = {
      startTime: this.common.dateFormatter1(this.startTime).split(' ')[0],
      endTime: this.common.dateFormatter1(enddate.setDate(enddate.getDate() + 1)).split(' ')[0],
      status: this.statusid,
      type: this.Typeid,
      actionType: this.actionTypeId
    };

    ++this.common.loading;
    this.api.post('FrieghtRate/getAllFreightExpenseAndRevenue', params)
      .subscribe(res => {
        --this.common.loading;
        this.data = res['data'];
        this.table = {
          data: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        this.valobj = {};
        if (!this.data || !this.data.length) {
          //document.getElementById('mdl-body').innerHTML = 'No record exists';
          return;
        }
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();

      }, err => {
        console.error(err);
        this.common.showError();
      });

  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        if (this.headings[i] == "Expense") {
          this.valobj[this.headings[i]] = {
            value: "",
            action: null,
            isHTML: false,
            icons: [
              { class: 'fa fa-edit', action: this.openExpenseModal.bind(this, doc) },
              { action: null, txt: doc._exp_count }
            ]
          };
        }
        else if (this.headings[i] == "Revenue") {
          this.valobj[this.headings[i]] = {
            value: "",
            action: null,
            isHTML: false,
            icons: [
              { class: 'fa fa-edit', action: this.openRevenueModal.bind(this, doc) },
              { action: null, txt: doc._rev_count }
            ]
          };
        }
        else if (this.headings[i] == "Transfer") {
          this.valobj[this.headings[i]] = {
            value: "",
            action: null,
            isHTML: false,
            icons: [
              { class: 'fa fa-edit', action: this.openTransferReceipt.bind(this, doc) },
              { action: null, txt: doc._trans_count }
            ]
          };
        }

        else if (this.headings[i] == "Advice") {
          this.valobj[this.headings[i]] = {
            value: "",
            action: null,
            isHTML: false,
            icons: [
              { class: 'fa fa-edit', action: this.openadvice.bind(this, doc) },
              { action: null, txt: doc._adv_count }
            ]
          };
        }
        else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  openExpenseModal(expense) {


    let expenseData = {
      id: expense._id,
      refId: expense._ref_id,
      refernceType: expense._ref_type,
      remarks: expense._exp_remarks,
    }
    console.log("expense", expense);
    this.common.params = { expenseData };
    const activeModal = this.modalService.open(AddFreightExpensesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Data:', data);
      this.getExpenses();

    });
  }
  openRevenueModal(revenue) {
    let revenueData = {
      id: revenue._id,
      refId: revenue._ref_id,
      refernceType: revenue._ref_type,
      remarks: revenue._exp_remarks,
    }
    this.common.params = { revenueData };
    const activeModal = this.modalService.open(AddFreightRevenueComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.getExpenses();
    })

  }
  openTransferReceipt(transfer) {
    console.log("transfer", transfer);
    let refData = {
      refId: transfer._ref_id,
      refType: transfer._ref_type,
    }
    this.common.params = { refData: refData };
    const activeModal = this.modalService.open(TransferReceiptsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.getExpenses();
    })
  }

  openadvice(row) {
    this.common.handleModalSize('class', 'modal-lg', '900', 'px');

    let refData = {
      refId: row._ref_id,
      refType: row._ref_type
    }
    this.common.params = { refData: refData };
    const activeModal = this.modalService.open(SaveAdvicesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.getExpenses();
    });
  }
}
