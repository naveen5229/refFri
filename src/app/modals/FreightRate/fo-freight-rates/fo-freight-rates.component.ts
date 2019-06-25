import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddConsigneeComponent } from '../../LRModals/add-consignee/add-consignee.component';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'fo-freight-rates',
  templateUrl: './fo-freight-rates.component.html',
  styleUrls: ['./fo-freight-rates.component.scss']
})
export class FoFreightRatesComponent implements OnInit {
  frieghtRate = {
    wefDate: '',
    companyName: null,
    companyId: null,
    materialName: null,
    materialId: null,
    siteName: null,
    siteId: null,
  }

  frieghtDatas = [{
    fixed: null,
    distance: null,
    weight: null,
    weightDistance: null,
    source: null,
    sourceLat: null,
    SourceLng: null,
    destination: null,
    destinationLat: null,
    destinationLng: null,
  }];
  constructor(
    public modalService: NgbModal,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService

  ) {
    this.common.handleModalSize('class', 'modal-lg', '400')
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
  closeModal() {
    this.activeModal.close();
  }
  saveFrightRates() {
    ++this.common.loading;
    let params = {
      companyId: this.frieghtRate.companyId,
      siteId: this.frieghtRate.siteId,
      materialId: this.frieghtRate.materialId,
      date: this.frieghtRate.wefDate,

      // filterParams: JSON.stringify(this.filters)
    }
    console.log("params", params);


    this.api.post('FrieghtRate/saveFrieghtRate', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['data'][0].result);
        if (res['data'][0].y_id > 0) {

          alert("Sucessfully insert");

          this.activeModal.close();
        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }
}
