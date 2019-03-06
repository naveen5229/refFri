import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { VehicleTripUpdateComponent } from '../../modals/vehicle-trip-update/vehicle-trip-update.component';

@Component({
  selector: 'kpis-details',
  templateUrl: './kpis-details.component.html',
  styleUrls: ['./kpis-details.component.scss','../../pages/pages.component.css']
})
export class KpisDetailsComponent implements OnInit {
  kpi = null;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.kpi = this.common.params.kpi;
    
  }

  ngOnInit() {
  }
  getLR(kpi) {
    this.common.loading++;
    this.api.post('FoDetails/getLorryDetails', { x_lr_id: kpi.x_lr_id })
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
      id : kpi.x_trip_id,
      endName : kpi.x_showtripend,
      startName : kpi.x_showtripstart,
      startTime : kpi.x_showstarttime,
      endTime : kpi.x_showendtime,
      regno : kpi.x_showveh,
      vehicleId:kpi.x_vehicle_id,
      siteId:kpi.x_hl_site_id
      
    }
    // this.common.params= tripDetails;
    // const activeModal = this.modalService.open(VehicleTripUpdateComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });

    if(kpi.x_prim_status == 20 || kpi.x_prim_status == 21 || kpi.x_prim_status == 51){
      this.common.params= tripDetails;
      console.log("vehicleTrip",tripDetails);
      const activeModal = this.modalService.open(VehicleTripUpdateComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    }else{
      console.log(kpi.x_prim_status)

      this.common.showToast("This trip cannot be updated ");
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}
