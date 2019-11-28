import { Component, OnInit } from '@angular/core';
import { AddConsigneeComponent } from '../../modals/LRModals/add-consignee/add-consignee.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { FreightInputWithoutLocationComponent } from '../../modals/FreightRate/freight-input-without-location/freight-input-without-location.component';
import { FreightInputLocationComponent } from '../../modals/FreightRate/freight-input-location/freight-input-location.component';
import { FoFreightRatesComponent } from '../../modals/FreightRate/fo-freight-rates/fo-freight-rates.component';
import { FreightRateCalculationComponent } from '../../modals/freight-rate-calculation/freight-rate-calculation.component';
import { FreightRateSummaryComponent } from '../../modals/FreightRate/freight-rate-summary/freight-rate-summary.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'frieght-rate-input',
  templateUrl: './frieght-rate-input.component.html',
  styleUrls: ['./frieght-rate-input.component.scss', "../pages.component.css",]
})
export class FrieghtRateInputComponent implements OnInit {

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
  currentYear = new Date().getFullYear();
  startDate = new Date(this.currentYear, 3);
  endDate = new Date();

  constructor(
    private modalService: NgbModal,
    public common: CommonService,
    public user: UserService,
    public api: ApiService) {
    this.getFrieghtRate();
    this.common.refresh = this.refresh.bind(this);
    this.startDate
    console.log("current Year", this.startDate);
  }

  ngOnInit() {
  }

  refresh() {

    this.getFrieghtRate();
  }
  getFrieghtRate() {
    if (this.startDate > this.endDate) {
      this.common.showError("StartDate Should be less then Enddate");
    } else {
      let startDate = this.common.dateFormatter(this.startDate);
      let endDate = this.common.dateFormatter(this.endDate);
      let params = {
        startDate: startDate,
        endDate: endDate,
      };

      this.common.loading++;
      this.api.post('FrieghtRate/getFrieghtRatePattern', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('res: ', res['data'])
          this.data = [];

          if (!res['data']) return;
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
          let first_rec = this.data[0];
          for (var key in first_rec) {
            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
              this.table.data.headings[key] = headerObj;
            }
          }
          let withLocation = { title: this.formatTitle('withLocation'), placeholder: this.formatTitle('withLocation'), hideHeader: true };
          this.table.data.headings['withLocation'] = withLocation;

          let withoutLocation = { title: this.formatTitle('withoutLocation'), placeholder: this.formatTitle('withoutLocation'), hideHeader: true };
          this.table.data.headings['withoutLocation'] = withoutLocation;


          this.table.data.columns = this.getTableColumns();

        }, err => {
          this.common.loading--;
          this.common.showError();
        })
    }
  }

  getTableColumns() {

    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};

      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };

      }
      this.valobj['withLocation'] = { class: '', icons: this.withLocationicon(doc) };
      this.valobj['withoutLocation'] = { class: '', icons: this.withOutLocationicon(doc) };


      columns.push(this.valobj);

    });

    return columns;
  }

  withLocationicon(details) {
    console.log("detatis Page:", details);
    let icons = [];
    icons.push(
      {
        class: "addButton",

        action: this.openWithLocationModal.bind(this, details),
      },
      {
        class: "fa fa-eye ml-1",

        action: this.frieghtRateSummary.bind(this, details),
      }
    )
    return icons;
  }


  withOutLocationicon(details) {
    console.log("detatis Page:", details);
    let icons = [];
    icons.push(
      {
        class: "addButton",
        action: this.openWithoutLocationModal.bind(this, details),
      }
    )
    return icons;
  }




  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  openWithoutLocationModal(row) {
    console.log("row", row);
    let data = {
      frpId: row._id,
      locId: false
    }
    this.common.params = { data: data };
    console.log("without location");
    const activeModal = this.modalService.open(FreightInputWithoutLocationComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data && data.response) {

        this.getFrieghtRate();
      }
    });
  }

  //Created by Hemant Singh Sisodia
  frieghtRateSummary(row) {
    console.log("row", row);
    let data = {
      id: row._id
    }
    this.common.params = { id: data.id };
    const activeModal = this.modalService.open(FreightRateSummaryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data && data.response) {
        this.getFrieghtRate();
      }
    });
  }



  openWithLocationModal(row) {
    console.log("row", row);

    let id = row._id;
    console.log("with location", id);
    this.common.params = { id };
    const activeModal = this.modalService.open(FreightInputLocationComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data && data.response) {

        this.getFrieghtRate();
      }
    });

  }
  OpenFoFreight() {
    this.common.handleModalSize('class', 'modal-lg', '400');
    const activeModal = this.modalService.open(FoFreightRatesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data && data.data) {

        this.getFrieghtRate();
      }
    });

  }

  freightRateCalculation() {
    const activeModal = this.modalService.open(FreightRateCalculationComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
}

