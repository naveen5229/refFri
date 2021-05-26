import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ImportBulkVehiclesComponent } from '../../modals/import-bulk-vehicles/import-bulk-vehicles.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss']
})
export class AddVehicleComponent implements OnInit {
  Foid = null;
  regno = null;
  isDost = 1;
  addVehicle=false;
  vehicleList = [];
  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService,
    private modalService: NgbModal, ) {
      if(this.common.params.isAddVehicle){
        this.addVehicle=this.common.params.isAddVehicle;
        this.regno=this.common.params.regNo;
      }
     }

  ngOnDestroy(){}

ngOnInit() {
  }
  selectFoUser(user) {
    this.Foid = user.id;
  }
  importDriverCsv() {
    const activeModal = this.modalService.open(ImportBulkVehiclesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
  closeModal() {
    this.activeModal.close();

  }
  Submit() {
    if(this.common.params.isAddVehicle){
      this.Foid=-1;
    }
    let params = {
      foid: this.Foid,
      regno: this.regno,
      id:this.id

    };
    console.log(params);
    this.common.loading++;
    let response;
    this.api.post('Gisdb/addVehicle', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.vehicleList = res['data'];
        this.closeModal();
        console.log('vehicle', this.vehicleList);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    // return response;

  }
  foName = null;
  id =null;
  editFlag = false;
  selectFoVehicle(event) {
    console.log("print",event, event.id, event.regno);
    this.regno = event.regno;
    this.editFlag = true;
    this.Foid = event.foid;
    this.id = event.id;
  }
  resetDetail(){
    this.foName = null;
    this.Foid = null;
    this.id = null;
    this.regno = null;
    this.editFlag = false;
  } 
}
