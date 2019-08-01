import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent implements OnInit {
  refId=null;
  refType=null;
  docType=null;
  title = '';
  images = [];
  refdata=[];
  activeImage = '';
  

    constructor(public api: ApiService,
    public common: CommonService,
    private activeModal: NgbActiveModal) {

if(this.common.params.refdata && this.common.params.refdata[0].refid)
{
this.common.params.refdata.map(ref=>{
 
    console.log(ref.refid);
    console.log(ref.reftype);
    console.log(ref.doctype);
    this.common.loading++;
    // this.api.get('Documents/getRepositoryImages', params)
    this.api.get('Documents/getRepositoryImages?refType=' + ref.reftype + '&refId=' +ref.refid+'&docTypeId='+ref.doctype)
      .subscribe(res => {
        this.common.loading--;
        console.log(res['data']);
        if(res['data'])
        {
        res['data'].map(img=>
          this.images.push(img.url)
        )
        this.activeImage=this.images[0];
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    });
  }
  else{
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
}

ngOnInit() {
}

closeModal() {
  this.activeModal.close();
}

}




  
