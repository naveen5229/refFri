import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { AddDocumentComponent } from '../../documents/documentation-modals/add-document/add-document.component';
import { ImportDocumentComponent } from '../../documents/documentation-modals/import-document/import-document.component';
import { EditDocumentComponent } from '../../documents/documentation-modals/edit-document/edit-document.component';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';
import { from } from 'rxjs';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'licence-upload',
  templateUrl: './licence-upload.component.html',
  styleUrls: ['./licence-upload.component.scss']
})
export class LicenceUploadComponent implements OnInit {
  selectedDriverId = null;
  base64image = {};
  base64image_b = {};
  constructor(private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) { }

  ngOnInit() {
  }


  compressImage(base64Image) {
    let image = new Image();
    image.onload = () => {
      // Resize the image using canvas  
      let canvas = document.createElement('canvas'),
        max_size = 1504,// TODO : max size for a pic  
        width = image.width,
        height = image.height;
      if (width > height) {
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);

      //Getting base64 string; 
      //this.images[index].base64 = canvas.toDataURL('image/jpeg').split(",")[1];      
      this.base64image = canvas.toDataURL('image/jpeg');

      console.log('Image Compressed !');
      console.log(this.base64image);
    }
    image.src = base64Image;
  }

  processImageUpload(event) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        //this.common.loading--;
        let file = event.target.files[0];
        console.log("Type", file.type);
        if (file.type == "image/jpeg" || file.type == "image/jpg" ||
          file.type == "image/png" || file.type == "application/pdf" ||
          file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type == "application/vnd.ms-excel" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          this.common.showToast("SuccessFull File Selected");
        }
        else {
          this.common.showError("valid Format Are : jpeg,png,jpg,doc,docx,csv,xlsx,pdf");
          return false;
        }

        this.base64image = res;
        this.compressImage(this.base64image);
        this.common.loading--;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      });
  }



  uploadDLImage() {
    this.common.loading++;
    this.api.post('Drivers/updateLicensePhoto', { x_driver_id: this.selectedDriverId, x_licence_img: this.base64image })
      .subscribe(res => {
        this.common.loading--;
        if (res['success'] === false)
          this.common.showError("Error occurred. " + res['msg']);
        else
          this.common.showToast("Licence Photo successfuly updated.");
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getDriverInfo(driver) {
    this.selectedDriverId = driver.id;
  }
}
