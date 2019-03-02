import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'edit-lorry-details',
  templateUrl: './edit-lorry-details.component.html',
  styleUrls: ['./edit-lorry-details.component.scss']
})
export class EditLorryDetailsComponent implements OnInit {
  images = [];
  documents = null;
  vehId = "";
  LrData = {
    receiptNo: "",
    source: "",
    dest: "",
    remark: "",
    taName: "",
    consignerName: "",
    consigneeName: "",
    lrDate: "",
    payType: "",
    amount: "",
    material: "",
    rate: ""
  };

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
    if (this.common.params) {
      this.documents = this.common.params.details;
      console.info('Document: ', this.documents);

    }
  }

  ngOnInit() {
  }

  searchVehicle(vehicleList){
    console.log('vehiclelist: '+vehicleList);
    this.vehId=vehicleList.id;
  }

  loadImage(flag) {
    if (flag == 'LR') {
      this.images[0] = this.documents.lr_image;
      console.log('LR', this.images[0]);

    } else if (flag == 'Invoice') {

      if (this.documents.invoice_image) {
        this.images[0] = this.documents.invoice_image;
        console.log('Invoice', this.images[0]);
      } else { this.common.showError('Image not present!!') }

    } else if (flag == 'Other') {

      if (this.documents.invoice_image) {
        this.images[0] = this.documents.other;
        console.log('Invoice', this.images[0]);
      } else { this.common.showError('Image not present!!') }
    }
  }

  dismiss(status){
    this.activeModal.close({status: status});
  }


}
