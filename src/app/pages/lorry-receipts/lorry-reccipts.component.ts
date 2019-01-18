import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'lorry-reccipts',
  templateUrl: './lorry-reccipts.component.html',
  styleUrls: ['./lorry-reccipts.component.scss']
})
export class LorryRecciptsComponent implements OnInit {
receipts = [];
viewImages = null;
activeImage = 'lr_image';
viewType = 'allLR';
  constructor(
      public api: ApiService,
      public common: CommonService,
  ) { }

  ngOnInit() {
    this.getLorryReceipts();
  }


getLorryReceipts() {
  console.log('viewtype:', this.viewType);
    ++this.common.loading;
  this.api.post('FoDetails/getLorryStatus', { type: this.viewType })
    .subscribe(res => { 
      --this.common.loading;
      console.log('Res:', res);
      this.receipts = res['data'];
    }, err => {
   --this.common.loading;
     
      console.log('Err:', err);
    });
}
getImage(receipt){
  console.log(receipt);
  let images =[{
    name: "LR",
    image : receipt.lr_image
  },
  {
    name: "Invoice",
    image : receipt.invoice_image
  },
  {
    name: "Other Image",
    image : receipt.other_image
  },];
  console.log("images:",images);
}
}