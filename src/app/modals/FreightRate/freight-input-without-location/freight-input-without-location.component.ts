import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { AddConsigneeComponent } from '../../LRModals/add-consignee/add-consignee.component';
import { ConfirmComponent } from '../../confirm/confirm.component';

@Component({
  selector: 'freight-input-without-location',
  templateUrl: './freight-input-without-location.component.html',
  styleUrls: ['./freight-input-without-location.component.scss']
})
export class FreightInputWithoutLocationComponent implements OnInit {


  combineJson = []
  general = {
    param: null,
    minRange: null,
    maxRange: null,
    fixed: null,
    distance: null,
    weight: null,
    shortage: null,
    shortagePer: null,
    detenation: null,
    delay: null,
    weightDistance: null,
    loading: null,
    unloading: null,
    fuelClass: null,
    fuelBaseRate: null,
    fuelVariation: null
  };
  filters = [{
    param: null,
    minRange: null,
    maxRange: null,
    fixed: null,
    distance: null,
    weight: null,
    shortage: null,
    shortagePer: null,
    detenation: null,
    delay: null,
    weightDistance: null,
    loading: null,
    unloading: null,
    fuelClass: null,
    fuelBaseRate: null,
    fuelVariation: null
  }];
  frpId = null;

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
    this.frpId = this.common.params.id ? this.common.params.id : null;
    this.getFrieghtRateDetails();
    this.common.handleModalSize('class', 'modal-lg', '1600');
  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }


  addCompany() {
    console.log("open material modal")
    const activeModal = this.modalService.open(AddConsigneeComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', windowClass: 'add-consige-veiw' });
    activeModal.result.then(data => {
      console.log('Data:', data);
    });
  }

  addMore() {
    this.filters.push({
      param: null,
      minRange: null,
      maxRange: null,
      fixed: null,
      distance: null,
      weight: null,
      shortage: null,
      shortagePer: null,
      detenation: null,
      delay: null,
      weightDistance: null,
      loading: null,
      unloading: null,
      fuelClass: null,
      fuelBaseRate: null,
      fuelVariation: null
    });
  }

  saveFrightInput() {
    let frieghtRateData = [];
    frieghtRateData.push(this.general);
    this.filters.forEach(element => {
      frieghtRateData.push(element);
    });
    console.log("frieghtRateData", frieghtRateData);
    ++this.common.loading;
    let params = {
      frpId: this.frpId,
      type: 'formula',

      frieghtRateData: JSON.stringify(frieghtRateData),
      // filterParams: JSON.stringify(this.filters)
    }
    console.log("params", params);


    this.api.post('FrieghtRate/saveFrieghtRateDetails', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['data'][0].result);
        this.common.showToast(res['data'][0].result);
        this.getFrieghtRateDetails();

      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }


  getFrieghtRateDetails() {
    let params = {
      frpId: this.frpId,
      type: 'formula',
    }
    console.log("params", params);
    ++this.common.loading;

    this.api.post('FrieghtRate/getFrieghtRateDetails', params)
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

        if (!res['data']) return;
        this.data = res['data'];
        let first_rec = this.data[0];
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
      this.valobj['action'] = { class: '', icons: this.freightDelete(doc) };
      columns.push(this.valobj);

    });

    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
  freightDelete(row) {

    let icons = [];
    icons.push(
      {
        class: "fas fa-trash-alt",
        action: this.deleteRow.bind(this, row),
      }
    )
    return icons;
  }
  deleteRow(row) {
    console.log("row:", row);
    let params = {
      id: row._id,
      type: 'formula',
    }
    if (row._id) {
      this.common.params = {
        title: 'Delete  ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('FrieghtRate/deleteFrieghtRateDetails', params)
            .subscribe(res => {
              this.common.loading--;
              this.common.showToast(res['data'][0].y_msg);
              if (res['data'][0].y_id > 0)
                this.getFrieghtRateDetails();

            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }


}