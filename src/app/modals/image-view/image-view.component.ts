import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent implements OnInit {
  title = '';
  images = [];
  activeImage = '';

  constructor(public common: CommonService,
    private activeModal: NgbActiveModal) {

    this.common.params.images.map(image => {
      if (image.name) {
        if (image.image)
          this.images.push(image.image);
      } else {
        this.images.push(image);
      }
    });
    this.title = this.common.params.title;
    this.activeImage = this.images[0];
  }
  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }
}
