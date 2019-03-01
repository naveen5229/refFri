import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'edit-lorry-details',
  templateUrl: './edit-lorry-details.component.html',
  styleUrls: ['./edit-lorry-details.component.scss']
})
export class EditLorryDetailsComponent implements OnInit {
  LrFlag="false";
  InvoiceFlag="false";
  OtherFlag="false";
  image_url_lr="";
  image_url_invoice="";
  image_url_other="";
  image_url="";
  documents=[];
  vehId="";
  LrData={
  receiptNo:"",
  source:"",
  dest:"",
  remark:"",
  taName:"",
  consignerName:"",
  consigneeName:"",
  lrDate:"",
  payType:"",
  amount:"",
  material:"",
  rate:""
 };

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
      if(this.common.params){
        this.documents=this.common.params.details;
        this.image_url_lr=this.common.params.details.lr_image;
        console.log('image_url_lr',this.image_url_lr);
        this.image_url_invoice=this.common.params.details.invoice_image;
        console.log('image_url_invoice',this.image_url_invoice);
        this.image_url_other=this.common.params.details.other;
        console.log('image_url_other',this.image_url_other);
      }
     }

  ngOnInit() {
  }

  loadLr(){
    this.image_url=this.image_url_lr;
    console.log('image_url',this.image_url);
  }
  loadInvoice(){
    this.image_url=this.image_url_invoice;
    console.log('image_url',this.image_url);
  }
  loadOther(){
    this.image_url=this.image_url_other;
    console.log('image_url',this.image_url);
  }

}
