import { Component, OnInit } from '@angular/core';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { LRRateCalculatorComponent } from '../lrrate-calculator/lrrate-calculator.component';

@Component({
  selector: 'lr-rate',
  templateUrl: './lr-rate.component.html',
  styleUrls: ['./lr-rate.component.scss']
})
export class LrRateComponent implements OnInit {
  freightRateparams = [];
  calculatedRate = null;
  rateDiv = true;
  type = null;
  combineJson = [];
  generalModal = true;
  title = "General";
  btnTitle = "Advance Form";
  isAdvanced = false;
  postAllowed = null;
  id = null;
  general = {
    param: null,
    minRange: null,
    maxRange: null,
    fixed: null,
    distance: null,
    weight: null,
    mgWeight: null,
    shortage: null,
    shortagePer: null,
    detenation: null,
    delay: null,
    weightDistance: null,
    loading: null,
    unloading: null,
    qty: null,
    mgQty: null,
    brokerage: null
  };
  filters = [{
    param: null,
    paramValue: null,
    minRange: null,
    maxRange: null,
    fixed: null,
    distance: null,
    weight: null,
    mgWeight: null,
    shortage: null,
    shortagePer: null,
    detenation: null,
    delay: null,
    weightDistance: null,
    loading: null,
    unloading: null,
    qty: null,
    mgQty: null,

  }];

  lrId = null;

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
    private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
  ) {
    console.log("this.common.params.LrData", this.common.params.rate);
    this.lrId = this.common.params.rate.lrId ? this.common.params.rate.lrId : null;
    this.type = this.common.params.rate.rateType ? this.common.params.rate.rateType : null;
    this.generalModal = this.common.params.rate.generalModal ? this.common.params.rate.generalModal : false;
    this.title = this.common.params.rate.generalModal ? "General" : "Advance";
    this.btnTitle = this.common.params.rate.generalModal ? "Advance Form" : "General Form";
    this.isAdvanced = this.common.params.rate.generalModal ? false : true;
    this.getLrRateDetails();
    this.getLRtRateparams();

    if (this.generalModal) {
      this.common.handleModalSize('class', 'modal-lg', '500');
      this.filters[0].param = "shortage";
    } else {
      this.common.handleModalSize('class', 'modal-lg', '1600');

    }
  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }


  addMore() {
    this.filters.push({
      param: null,
      paramValue: null,
      minRange: null,
      maxRange: null,
      fixed: null,
      distance: null,
      weight: null,
      mgWeight: null,
      shortage: null,
      shortagePer: null,
      detenation: null,
      delay: null,
      weightDistance: null,
      loading: null,
      unloading: null,
      qty: null,
      mgQty: null,
    });
  }


  saveLrRateInput() {

    let lrRateData = [];
    lrRateData.push(this.general);
    this.filters.forEach(element => {
      lrRateData.push(element);
    });
    let lrRateDatas = JSON.stringify(lrRateData);
    ++this.common.loading;
    let params = {
      lrId: this.lrId,
      lrRateData: lrRateDatas,
      rateType: '' + this.type,
      isAdvanced: this.isAdvanced
    }
    console.log("params", params);


    this.api.post('LorryReceiptsOperation/saveLrRates', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res);
        if (res['data'][0].r_id > 0) {
          this.common.showToast("Successfully Added");
          this.getLrRateDetails();
        }
        else {
          this.common.showError(res['data'][0].r_msg);

        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }


  getLrRateDetails() {
    let params = {
      lrId: this.lrId,
      rateType: '' + this.type,
      isAdvanced: this.isAdvanced
    }
    console.log("params", params);
    ++this.common.loading;

    this.api.post('LorryReceiptsOperation/getLrRates', params)
      .subscribe(res => {
        --this.common.loading;
        this.data = [];
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

        this.resetValue();
        if (!res['data']) {
          this.rateDiv = true;
          return;
        };
        this.data = res['data'];
        if (res['data'] && this.generalModal) {
          this.setValue(res['data']);
        }
        let first_rec = this.data[0];
        this.rateDiv = this.data[0]._allowedit;
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        let action = { title: this.formatTitle('action'), placeholder: this.formatTitle('action'), hideHeader: true };
        this.table.data.headings['action'] = action;

        this.table.data.columns = this.getTableColumns();
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  getTableColumns() {

    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};

      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };

      }
      this.valobj['action'] = { class: '', icons: this.lrRateDelete(doc) };
      columns.push(this.valobj);

    });

    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
  lrRateDelete(row) {

    let icons = [];
    icons.push(
      {
        class: "fas fa-trash-alt",
        action: this.deleteRow.bind(this, row),
      }
    )
    return icons;
  }
  deleteRate() {
    let deletableData = {
      _lrid: this.lrId,
      _rateid: this.id
    }
    this.deleteRow(deletableData);
  }

  deleteRow(row) {
    let params = {
      id: row._rateid,
      lrId: row._lrid
    }
    console.log("params:", params);
    if (row._rateid) {
      this.common.params = {
        title: 'Delete  ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('LorryReceiptsOperation/deleteLrRate', params)
            .subscribe(res => {
              this.common.loading--;

              if (res['data'][0].r_id > 0) {
                this.common.showToast("Successfully Deleted");
                this.getLrRateDetails();
              } else {
                this.common.showError(res['data'][0].r_msg);
              }

            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }

  getLRtRateparams() {
    this.api.get('FrieghtRate/getFreightRateparams')
      .subscribe(res => {
        console.log('resooo', res['data']);
        this.freightRateparams = res['data'];
      }, err => {
        console.log(err);
      });
  }

  changeModalData() {
    if (!this.generalModal) {

      this.common.handleModalSize('class', 'modal-lg', '500');
      this.title = "General";
      this.btnTitle = "Advance Form";
      this.filters[0].param = "shortage";
      this.isAdvanced = false;
    }
    else if (this.generalModal) {
      this.common.handleModalSize('class', 'modal-lg', '1600');
      this.title = "Advance";
      this.btnTitle = "General Form";
      this.isAdvanced = true;

    }
    this.getLrRateDetails();
    this.generalModal = !this.generalModal;
  }
  allowedShortageReset(index) {
    this.filters[index].minRange = null;
  }
  postAllowedReset() {
    this.general.shortage = null;
    this.general.shortagePer = null;
  }

  setValue(data) {
    console.log("isAdvanced", this.isAdvanced);
    if (!this.isAdvanced) {
      this.id = data[0]['id'];
      this.general.weight = data[0]['wt_coeff'];
      this.general.fixed = data[0]['fixed_amt'];
      this.general.mgWeight = data[0]['mg_weight'];
      this.general.qty = data[0]['qty_coeff'];
      this.general.mgQty = data[0]['mg_qty'];
      this.general.brokerage = data[0]['brokerage'];
      this.rateDiv = this.data[0]['_allowedit'];
      this.filters[0].param = data[1] && data[1]['filter_param'] ? data[1]['filter_param'] : 'shortage';
      this.filters[0].minRange = data[1] && data[1]['range_min'] ? data[1]['range_min'] : '';
      this.filters[0].shortage = data[1] && data[1]['short_coeff'] ? data[1]['short_coeff'] : '';
    }
    else {
      this.resetValue();
    }
  }

  resetValue() {
    console.log("reset feunction");
    this.id = null;
    this.general.weight = null;
    this.general.fixed = null;
    this.general.mgWeight = null;
    this.general.qty = null;
    this.general.mgQty = null;
    this.general.brokerage = null;
    this.filters[0].param = null;
    this.filters[0].minRange = null;
    this.filters[0].shortage = null;
  }



  calculateRate() {
    const refData = {
      refId: this.lrId,
      refTypeId: 11,
      isExpense: '' + this.type
    };
    this.common.params = { refData: refData }
    const activeModal = this.modalService.open(LRRateCalculatorComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }
}