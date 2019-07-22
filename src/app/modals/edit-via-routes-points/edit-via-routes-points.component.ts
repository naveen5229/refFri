import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'edit-via-routes-points',
  templateUrl: './edit-via-routes-points.component.html',
  styleUrls: ['./edit-via-routes-points.component.scss']
})
export class EditViaRoutesPointsComponent implements OnInit {
rowData = null;
kms = null;
locationName = null;
  constructor(
    public common: CommonService,
    public activeModal: NgbActiveModal
  ) { 
    this.common.handleModalSize('class', 'modal-lg', '1500');
    this.rowData = this.common.params.rowData;
    console.log("this is rowData--->", this.rowData);
    this.locationName = this.rowData.name;
    this.kms = this.rowData.kms;

  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

}
