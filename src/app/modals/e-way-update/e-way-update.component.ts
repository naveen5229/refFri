import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'e-way-update',
  templateUrl: './e-way-update.component.html',
  styleUrls: ['./e-way-update.component.scss']
})
export class EWayUpdateComponent implements OnInit {

  title = '';
  formType = 1;

  billDateExtend = {
    action: "",
    GeneratorGstin: "",
    EwbNo: "",
    VehicleNo: "",
    FromCity: "",
    FromState: "",
    ExtnRsn: "",
    ExtnRemarks: "",
    TransDocNumber: "",
    TransDocDate: new Date(),
    TransportMode: "",
    TransitType: null,
    RemainingDistance: "",
    FromPincode: "",
    AddressLine1: "",
    AddressLine2: "",
    AddressLine3: ""
  }

  partsInfo = {
    action: "",
    GeneratorGstin: "",
    EwbNo: "",
    FromCityPlace: "",
    VehicleNo: "",
    TransDocNumber: "",
    StateName: "",
    TransportMode: "",
    VehicleReason: "",
    VehicleType: "",
    Remarks: "",
    TransDocDate: new Date()
  }

  transmodeOptions = [{ id: 1, name: 'Road / Rail / Air / Ship' }, { id: 2, name: 'Other' }]

  constructor(private apiservice: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    private formbuilder: FormBuilder,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title;
    this.formType = this.common.params.type;
    if (this.formType == 1) {
      this.billDateExtend = {
        action: "test",
        GeneratorGstin: "test",
        EwbNo: "test",
        VehicleNo: "test",
        FromCity: "test",
        FromState: "test",
        ExtnRsn: "test",
        ExtnRemarks: "test",
        TransDocNumber: "test",
        TransDocDate: new Date(),
        TransportMode: "",
        RemainingDistance: "test",
        TransitType: null,
        FromPincode: "test",
        AddressLine1: "test",
        AddressLine2: "test",
        AddressLine3: "test"
      }
    } else if (this.formType == 2) {
      this.partsInfo = {
        action: "test",
        GeneratorGstin: "test",
        EwbNo: "test",
        FromCityPlace: "test",
        VehicleNo: "test",
        TransDocNumber: "test",
        StateName: "test",
        TransportMode: "",
        VehicleReason: "test",
        VehicleType: "test",
        Remarks: "test",
        TransDocDate: new Date()
      }
    }
  }

  ngOnInit(): void {
  }

  closeModal() {
    this.activeModal.close({ response: true });
  }
}
