import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';

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
    public user: UserService,
    private modalService: NgbModal) {
      
     }

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

  getImage(receipt) {
    console.log(receipt);
    let images = [{
      name: "LR",
      image: receipt.lr_image
    },
    {
      name: "Invoice",
      image: receipt.invoice_image
    },
    {
      name: "Other Image",
      image: receipt.other_image
    }];
    console.log("images:", images);
    this.common.params = { images, title: 'LR Details' };
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout' });


  }
}