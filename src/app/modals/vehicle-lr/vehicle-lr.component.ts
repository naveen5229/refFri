import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { ImageViewComponent } from '../image-view/image-view.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-lr',
  templateUrl: './vehicle-lr.component.html',
  styleUrls: ['./vehicle-lr.component.scss', '../../pages/pages.component.css']
})
export class VehicleLrComponent implements OnInit {
  startDate = null;
  endDate = null;
  vId = null;
  vehicleNo = null;
  lrData = [];

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal,
    public modalService: NgbModal, ) {
    console.log("common params", this.common.params);
    this.startDate = this.common.params.vehicleData.startDate;
    this.endDate = this.common.params.vehicleData.endDate;
    this.vId = this.common.params.vehicleData.vehicleId;
    this.vehicleNo = this.common.params.vehicleData.vehicleRegNo;
    this.ViewLr();
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  searchVehicle(vehicleList) {
    this.vId = vehicleList.id;
  }
  closeModal() {
    this.activeModal.close();
  }


  getDate(type) {

    this.common.params = { ref_page: 'trip status feedback' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {

          this.startDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log("start date:", this.startDate);
        }
        else {
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.endDate);
        }

      }

    });


  }


  ViewLr() {
    const params = {
      vehicleId: this.vId,
      startDate: this.common.dateFormatter(this.startDate).split(' ')[0],
      endDate: this.common.dateFormatter(this.endDate).split(' ')[0]
    }
  
    console.log('params:', params);

    this.common.loading++;
    this.api.post('LorryReceiptsOperation/getLorryStatusVehWise', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res);
        this.lrData = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Err:', err);
      });

  }

  getImage(lr) {
    console.log(lr);
    let images = [{
      name: "LR",
      image: lr.lr_image
    },
    {
      name: "Invoice",
      image: lr.invoice_image
    },
    {
      name: "Other Image",
      image: lr.other_image
    }];
    console.log("images:", images);
    this.common.params = { images, title: 'LR Image' };
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout' });
  }
}
