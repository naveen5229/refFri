import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { AddDocumentComponent } from '../../documents/documentation-modals/add-document/add-document.component';
import { ImportDocumentComponent } from '../../documents/documentation-modals/import-document/import-document.component';
import { from } from 'rxjs';
@Component({
  selector: 'documentation-details',
  templateUrl: './documentation-details.component.html',
  styleUrls: ['./documentation-details.component.scss', '../../pages/pages.component.css']
})
export class DocumentationDetailsComponent implements OnInit {
  title: '';
  data = [];
  selectedVehicle = null;
  dates ={
    expiryForm: '',
    expiryEnd:'',
  };
    
  currentdate = new Date;
  curr = null;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  getvehicleData(vehicle) {
    console.log('Vehicle Data: ', vehicle);
    this.selectedVehicle = vehicle;
    // this.data=vehicle;
    this.common.loading++;
    this.api.post('Vehicles/getVehicleDocumentsById', { x_vehicle_id: vehicle.id })
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.data = res['data'];

        if (!this.selectedVehicle.id) {
          let exp_date = this.common.dateFormatter(this.data[0].expiry_date);
          this.curr = this.common.dateFormatter(this.currentdate);
          console.log("expiry Date:", exp_date);
          console.log("current date", this.curr);
          if (exp_date > this.curr) {
            console.log("true");
          }
          else {
            console.log("false");
          }
        }
        
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }
  doucumentFilter() {
    console.log("hiii");
  }
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
        console.log("hii");
        console.log('new Date:', this.dates[date]);
      }
    });
  }

  imageView(doc) {
    console.log("image data", doc);
    let images = [{
      name: "image",
      image: doc.img_url
    }];
    console.log("images:", images);
    if (this.checkForPdf(images[0].image)) {
      window.open(images[0].image);
      return;
    }
    this.common.params = { images, title: 'Image' };
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
  }

  checkForPdf(imgUrl) {
    var split = imgUrl.split(".");
    return split[split.length - 1] == 'pdf' ? true : false;
  }

  addDocument() {
    this.common.params = { title: 'Add Document', vehicleId: this.selectedVehicle.id };
    const activeModal = this.modalService.open(AddDocumentComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getvehicleData(this.selectedVehicle);
      }
    });
  }
  importVehicleDocument() {
    this.common.params = { title: 'Bulk Import Document',vehicleId: this.selectedVehicle.id };
    const activeModal = this.modalService.open(ImportDocumentComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
  }

  editData(){
    this.common.params = { title: 'Add Document', vehicleId: this.selectedVehicle.id };
    const activeModal = this.modalService.open(AddDocumentComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getvehicleData(this.selectedVehicle);
      }
    });
  }
}