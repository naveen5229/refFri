import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { VehicleTripUpdateComponent } from '../../modals/vehicle-trip-update/vehicle-trip-update.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'kpis-details',
  templateUrl: './kpis-details.component.html',
  styleUrls: ['./kpis-details.component.scss','../../pages/pages.component.css']
})
export class KpisDetailsComponent implements OnInit {
  kpi = null;
  vehicleInfo : null;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
      this.common.handleModalSize('class', 'modal-lg', '1200');
    this.kpi = this.common.params.kpi;
    this.getVehicleInformation();
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  getLR(lrId) {
    this.common.loading++;
    this.api.post('FoDetails/getLorryDetails', { x_lr_id: lrId })
      .subscribe(res => {
        this.common.loading--;
        this.showLR(res['data'][0]);
        console.log("data", res);
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  showLR(data) {
    let images = [
      {
        name: 'Lr',
        image: data.lr_image
      },
      {
        name: 'Invoice',
        image: data.invoice_image
      },
      {
        name: 'Other_Image',
        image: data.other_image
      }
    ];
    console.log("image", images)
    this.common.params = { images, title: 'LR Details' };
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout' });
  }

  getUpadte(kpi){
    console.log("kpi",kpi);
    let tripDetails ={
      vehicleId:kpi.x_vehicle_id,
      siteId:kpi.x_hl_site_id
      
    }
    // this.common.params= tripDetails;
    // const activeModal = this.modalService.open(VehicleTripUpdateComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });

    
    this.common.params= {tripDetils : tripDetails, ref_page : 'kpi'};
      console.log("vehicleTrip",tripDetails);
      const activeModal = this.modalService.open(VehicleTripUpdateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    
  }

  closeModal() {
    this.activeModal.close();
  }

  getVehicleInformation() {
    this.common.loading++;
    let params = "vehicleId="+this.kpi.x_vehicle_id;
    console.log("params",params);
    this.api.get('VehicleKpis/getVehicleInformation?'+params)
      .subscribe(res => {
        this.common.loading--;
        this.vehicleInfo = res['data'][0];
        console.log("data", this.vehicleInfo);
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  vehicleSelectionChange(event){
    console.log('event is: ', event);
    this.kpi.x_vehicle_id = event['id'];
    this.getVehicleInformation();
  }
}
