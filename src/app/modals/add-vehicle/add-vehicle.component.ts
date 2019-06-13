import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ImportBulkVehiclesComponent } from '../../modals/import-bulk-vehicles/import-bulk-vehicles.component';
@Component({
  selector: 'add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss']
})
export class AddVehicleComponent implements OnInit {
  Foid = null;
  regno = null;
  isDost = 1;
  vehicleList = [];
  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService,
    private modalService: NgbModal, ) { }

  ngOnInit() {
  }
  selectFoUser(user) {
    this.Foid = user.id;
  }
  importDriverCsv() {
    const activeModal = this.modalService.open(ImportBulkVehiclesComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  }
  closeModal() {
    this.activeModal.close();

  }
  Submit() {
    let params = {
      foid: this.Foid,
      regno: this.regno,

    };
    // console.log(params);
    this.common.loading++;
    let response;
    this.api.post('Gisdb/addVehicle', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.vehicleList = res['data'];
        console.log('vehicle', this.vehicleList);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    // return response;

  }

}
