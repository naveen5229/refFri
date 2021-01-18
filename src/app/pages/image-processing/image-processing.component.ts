import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';


import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'image-processing',
  templateUrl: './image-processing.component.html',
  styleUrls: ['./image-processing.component.scss']
})
export class ImageProcessingComponent implements OnInit {

  // imageChangedEvent: any = '';
  // croppedImage: any = '';

  // extractedText = '';

  constructor(public api: ApiService, public common: CommonService) { }

  ngOnDestroy(){}
ngOnInit() {
  }

  // fileChangeEvent(event: any): void {
  //   this.imageChangedEvent = event;

  // }

  // imageCropped(event: ImageCroppedEvent) {
  //   this.croppedImage = event.base64;
  //   console.log('Cropped Image: ', this.croppedImage);
  // }

  imageLoaded() {
    // show cropper
  }

  loadImageFailed() {
    // show message
  }

  // extractText() {
  //   const params = {
  //     base64Image: this.croppedImage.split('base64,')[1]
  //   };
  //   console.log('Params: ', params);
  //   this.common.loading++;
  //   this.api.imageProcessingPost('process-image', params)
  //     .subscribe(res => {
  //       this.common.loading--;
  //       console.log('Extract Result: ', res);
  //       this.extractedText = res['text'];
  //     }, err => {
  //       this.common.loading--;
  //       console.log('Error: ', err);
  //     });

  // }
}
