import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { TransferReceiptsComponent } from '../transfer-receipts/transfer-receipts.component';

@Component({
  selector: 'add-freight-expenses',
  templateUrl: './add-freight-expenses.component.html',
  styleUrls: ['./add-freight-expenses.component.scss']
})
export class AddFreightExpensesComponent implements OnInit {
  endDate = new Date();
  expense = {
    id: null,
    vehicleType: 1,
    vehicleId: null,
    vehicleRegNo: null,
    refernceType: 0,
    refId: null,
    refTypeName: null,
    remarks: ''
  }
  freightHeads = [];
  expenseDetails = [{
    frHead: null,
    frHeadId: null,
    value: null,
    manualValue: null,
  },
  {
    frHead: null,
    frHeadId: null,
    value: null,
    manualValue: null,
  }, {
    frHead: null,
    frHeadId: null,
    value: null,
    manualValue: null,
  }];
  title = "Add Freight Expenses";
  result = [];
  refernceData = [];
  data = [];
  manualAmount = null;
  advanceAmount = 0;

  headings = [];
  valobj = {};
  images = [];

  constructor(public modalService: NgbModal,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService,
  ) {
    this.getFreightHeads();

    if (this.common.params.expenseData) {
      this.expense.id = this.common.params.expenseData.id?this.common.params.expenseData.id:null;
      this.expense.refId = this.common.params.expenseData.refId;
      this.expense.refernceType = this.common.params.expenseData.refernceType;
      this.expense.remarks = this.common.params.expenseData.remarks?this.common.params.expenseData.remarks:null;
      this.getExpenseDetails();
    }
    this.getExpenses();

  }
  ngOnInit() {
  }
  getExpenseDetails() {
    const params = "id=" + this.expense.refId +
      "&type=" + this.expense.refernceType;
    this.common.loading++;

    this.api.get('Vehicles/getRefrenceDetails?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res['data']);
        let resultData = res['data'][0];
        this.expense.vehicleId = resultData.vid;
        this.expense.vehicleRegNo = resultData.regno;
        this.expense.refTypeName = resultData.ref_name;
        this.expense.vehicleType = resultData.vehasstype
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getFrieghtHeaderId(type, index) {
    console.log("Type Id", type);

    this.expenseDetails[index].frHeadId = this.freightHeads.find((element) => {
      return element.r_name == type;
    }).r_id;
    console.log("this.expenseDetails[index].frHeadId ", this.expenseDetails[index].frHeadId)
  }
  closeModal() {
    this.activeModal.close();
  }

  getRefrenceData(type) {
    this.expense.refId = this.refernceData.find((element) => {
      console.log("element", element);
      return element.source_dest == type;
    }).id;
    this.expense.refTypeName = type;
  }

  addField(index) {
    this.expenseDetails.push(
      {
        frHead: null,
        frHeadId: null,
        value: null,
        manualValue: null,
      }
    )
  }

  getFreightHeads() {
    this.common.loading++;
    this.api.get('FrieghtRate/getFreightHeads?type=exp')
      .subscribe(res => {
        this.common.loading--;
        this.freightHeads = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  saveDetails() {
    ++this.common.loading;
    let params = {
      vehicleId: this.expense.vehicleId,
      vehicleNo: this.expense.vehicleRegNo,
      vehicleType: this.expense.vehicleType,
      referId: this.expense.refId,
      referType: this.expense.refernceType,
      remarks: this.expense.remarks,
      podId: null,
      expenseDetails: JSON.stringify(this.expenseDetails),
    }
    console.log("params", params);


    this.api.post('FrieghtRate/saveFrieghtExpenses', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('response :', res);
        if (res['data'][0].y_id > 0) {
          this.common.showToast("Freight added Successfully");
          this.getExpenses();
        } else {
          this.common.showError(res['data'][0].y_msg);
        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  getExpenses() {
    var enddate = new Date(this.common.dateFormatter1(this.endDate).split(' ')[0]);
    let params = {
      refId: this.expense.refId,
      refType: this.expense.refernceType

    };
    console.log('params', params);
    this.common.loading++;
    this.api.post('FrieghtRate/getFrieghtExpenses', params)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data']['result'];
        this.images = res['data']['images'];
        // if(this.images)
        //     this.common.handleModalSize("class", "modal-lg", "1500");


        console.log("api images:", this.images);
        this.headings = [];
        this.valobj = {};
        if (!this.data || !this.data.length) {
          return;
        }


        // let first_rec = this.data[0];
        for (var key in this.data[0]) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
          }
        }

      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });

  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  DeleteExpense(del) {
    let params = {
      expId: del._exp_id,
      ledgerId: del._ledger_id
    }
    console.log("params:", params);
    ++this.common.loading;
    this.api.post('FrieghtRate/deleteExpenses', params)
      .subscribe(res => {
        --this.common.loading;
        this.getExpenses();
      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  editExpenses(row) {
    let expDetails = [{
      frHead: row['Ledger Type'],
      frHeadId: row._ledger_id,
      value: row.Amount,
      manualValue: row['Manual Amount'],
    }];

    let params = {
      vehicleId: this.expense.vehicleId,
      vehicleNo: this.expense.vehicleRegNo,
      vehicleType: this.expense.vehicleType,
      referId: this.expense.refId,
      referType: this.expense.refernceType,
      remarks: this.expense.remarks,
      podId: null,
      expenseDetails: JSON.stringify(expDetails),
    }
    console.log("params", params);

    ++this.common.loading;
    this.api.post('FrieghtRate/saveFrieghtExpenses', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('response :', res);
        if (res['data'][0].y_id > 0) {
          this.common.showToast("Freight added Successfully");
          this.getExpenses();
        } else {
          this.common.showError(res['data'][0].y_msg);
        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });


  }

  deleteAllExpenses() {
    let params = {
      refId: this.expense.refId,
      refType: this.expense.refernceType,
      expId: null,
      ledgerId: null,
    }
    if (this.expense.refId) {
      this.common.params = {
        title: 'Delete Expenses ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("data", data);
          this.common.loading++;
          this.api.post('FrieghtRate/deleteExpenses', params)
            .subscribe(res => {
              this.common.loading--;
              this.common.showToast(res['data']);

              this.getExpenses();

            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }

  openTransferModal(){
    let refdata = {
      refId: this.expense.refId,
      refType: this.expense.refernceType,
      selectOption:'transfer'
    }
    this.common.params = { refData: refdata };
    const activeModal = this.modalService.open(TransferReceiptsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
      this.lrGetAdvanceAmount();  
    });
  }

  lrGetAdvanceAmount() {
    let params={
      lrId:this.expense.refId,
      isExpense:'0'
    }
    this.api.post('lorryReceiptsOperation/lrGetAdvanceAmount',params)
      .subscribe(res => {
        console.log('advanceAmount', res['data']);
        this.advanceAmount = res['data'][0].r_amount;
      }, err => {
        console.log(err);
      });
  }
}

