import { Component, OnInit } from '@angular/core';
import { AddConsigneeComponent } from '../../LRModals/add-consignee/add-consignee.component';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { LocationSelectionComponent } from '../../location-selection/location-selection.component';

@Component({
  selector: 'freight-input-location',
  templateUrl: './freight-input-location.component.html',
  styleUrls: ['./freight-input-location.component.scss']
})
export class FreightInputLocationComponent implements OnInit {

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
    private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
  ) {
    this.common.handleModalSize('class', 'modal-lg', '1600');
    this.frieghtRate.wefDate = this.common.dateFormatter(new Date());
  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
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
    this.frieghtDatas.push({
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
    });
  }

  // takeAction(res) {
  //   setTimeout(() => {
  //     console.log("Here", this.keepGoing, this.searchString.length, this.searchString);

  //     if (this.keepGoing && this.searchString.length) {
  //       this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };

  //       const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //       this.keepGoing = false;
  //       activeModal.result.then(res => {
  //         console.log('response----', res.location);
  //         this.keepGoing = true;
  //         if (res.location.lat) {
  //           this.vehicleTrip.endName = res.location.name;

  //           (<HTMLInputElement>document.getElementById('endname')).value = this.vehicleTrip.endName;
  //           this.vehicleTrip.endLat = res.location.lat;
  //           this.vehicleTrip.endLng = res.location.lng;
  //           this.placementSite = null;
  //           this.keepGoing = true;
  //         }
  //       })
  //     }
  //   }, 1000);

  // }


  saveFrightInput() {
    ++this.common.loading;
    let params = {
      companyId: this.frieghtRate.companyId,
      siteId: this.frieghtRate.siteId,
      materialId: this.frieghtRate.materialId,
      date: this.frieghtRate.wefDate,
      frieghtRateData: JSON.stringify(this.frieghtDatas),
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