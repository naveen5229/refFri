import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { AddConsigneeComponent } from '../../LRModals/add-consignee/add-consignee.component';

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

  constructor(
    private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
  ) {
    this.frpId = this.common.params.id ? this.common.params.id : null;

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
        alert(res['data'][0].result);
        this.activeModal.close();

      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }
}