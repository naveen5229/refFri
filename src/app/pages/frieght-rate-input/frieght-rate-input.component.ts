import { Component, OnInit } from '@angular/core';
import { AddConsigneeComponent } from '../../modals/LRModals/add-consignee/add-consignee.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { FreightInputWithoutLocationComponent } from '../../modals/FreightRate/freight-input-without-location/freight-input-without-location.component';
import { FreightInputLocationComponent } from '../../modals/FreightRate/freight-input-location/freight-input-location.component';

@Component({
  selector: 'frieght-rate-input',
  templateUrl: './frieght-rate-input.component.html',
  styleUrls: ['./frieght-rate-input.component.scss', "../pages.component.css",]
})
export class FrieghtRateInputComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService
  ) {
  }

  ngOnInit() {
  }


  openWithoutLocationModal() {
    console.log("without location");
    const activeModal = this.modalService.open(FreightInputWithoutLocationComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

  }
  openWithLocationModal() {
    console.log("with location");
    const activeModal = this.modalService.open(FreightInputLocationComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });


  }
}

