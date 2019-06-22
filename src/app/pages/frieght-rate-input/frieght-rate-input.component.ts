import { Component, OnInit } from '@angular/core';
import { AddConsigneeComponent } from '../../modals/LRModals/add-consignee/add-consignee.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'frieght-rate-input',
  templateUrl: './frieght-rate-input.component.html',
  styleUrls: ['./frieght-rate-input.component.scss']
})
export class FrieghtRateInputComponent implements OnInit {
  frieghtRate = {
    wefDate: '',
    companyName: null,
    companyId: null,
    materialName: null,
    materialId: null,
    siteName: null,
    siteId: null,
  }
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
  constructor(
    private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService
  ) {
    this.frieghtRate.wefDate = this.common.dateFormatter(new Date());
  }

  ngOnInit() {
  }

  getCompanyDetail(consignor) {
    console.log("consignor", consignor);
    this.frieghtRate.companyName = consignor.name;
    this.frieghtRate.companyId = consignor.id;
  }
  getSiteDetail(site) {
    console.log("site", site);
    this.frieghtRate.siteName = site.name;
    this.frieghtRate.siteId = site.id;

  }
  getMaterialDetail(material) {
    console.log("material", material);
    this.frieghtRate.materialName = material.name
    this.frieghtRate.materialId = material.id
  }
  getDate() {

    this.common.params = { ref_page: 'LrView' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {

        this.frieghtRate.wefDate = '';
        return this.frieghtRate.wefDate = this.common.dateFormatter1(data.date).split(' ')[0];
      }

    });
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
      companyId: this.frieghtRate.companyId,
      siteId: this.frieghtRate.siteId,
      materialId: this.frieghtRate.materialId,
      date: this.frieghtRate.wefDate,
      frieghtRateData: JSON.stringify(frieghtRateData),
      // filterParams: JSON.stringify(this.filters)
    }
    console.log("params", params);


    this.api.post('FrieghtRate/saveFrieghtRate', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['data'][0].result);
        alert(res['data'][0].result);
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }
}

