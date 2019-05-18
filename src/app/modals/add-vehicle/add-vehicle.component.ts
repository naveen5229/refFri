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
<<<<<<< HEAD
  Regno = null;
=======
  regno = null;
>>>>>>> cb114ae9b08206066b54a3ed299bd01ac75abe6b
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
    const activeModal = this.modalService.open(ImportBulkVehiclesComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
  }
  closeModal() {
    this.activeModal.close();

  }
  Submit() {
    let params = {
      foid: this.Foid,
<<<<<<< HEAD
      regno: this.Regno,
      isDost: this.isDost
=======
      regno: this.regno,

>>>>>>> cb114ae9b08206066b54a3ed299bd01ac75abe6b
    };
    // console.log(params);
    this.common.loading++;
    let response;
<<<<<<< HEAD
    this.api.postToTranstrucknew('Vehicles/addVehicles.json', params)
=======
    this.api.post('Gisdb/addVehicle', params)
>>>>>>> cb114ae9b08206066b54a3ed299bd01ac75abe6b
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
