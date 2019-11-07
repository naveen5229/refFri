import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddConsigneeComponent } from '../../LRModals/add-consignee/add-consignee.component';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BasicPartyDetailsComponent } from '../../basic-party-details/basic-party-details.component';


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
    expiryDate: ''
  }
  Form: FormGroup;
  isFormSubmit = false;

  data1 = '';
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
    public api: ApiService,
    private formBuilder: FormBuilder

  ) {
    this.common.handleModalSize('class', 'modal-lg', '450');
  }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      companyautoSuggestion: ['',],
      wef: ['',],
      Site: ['',],
      Material: ['',],
      expiryDate: ['',]
    });
  }
  get fo() {
    return this.Form.controls;

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
  getDate1() {

    this.common.params = { ref_page: 'LrView' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {

        this.frieghtRate.expiryDate = '';
        return this.frieghtRate.expiryDate = this.common.dateFormatter1(data.date).split(' ')[0];
      }

    });
  }

  addCompany() {
    console.log("open material modal");
    this.common.params={
      modelname:"Fright Rate Input",
    }
    
    const activeModal = this.modalService.open(BasicPartyDetailsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'add-consige-veiw' });
    activeModal.result.then(data => {
      console.log('Data:', data);
    });
  }
  closeModal() {
    this.activeModal.close({ data: false });
  }
  saveFrightRates() {
    let params = {
      companyId: this.frieghtRate.companyId,
      siteId: this.frieghtRate.siteId,
      materialId: this.frieghtRate.materialId,
      date: this.frieghtRate.wefDate,
      expiryDate: this.frieghtRate.expiryDate

      // filterParams: JSON.stringify(this.filters)
    }
    console.log("params", params);
    if (params.companyId == null) {
      this.common.showError("Company name is required");
      return;
    }
    else if (params.date == '') {
      this.common.showError("W.E.F date  is required");
      return;
    }
    ++this.common.loading;
    this.api.post('FrieghtRate/saveFrieghtRate', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['data'][0].result);
        this.data1 = res['data'][0];


        if (res['data'][0].y_id > 0) {
          alert("Sucessfully insert");
          this.activeModal.close({ data: true });
        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }


}
