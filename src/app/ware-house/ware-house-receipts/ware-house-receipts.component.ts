import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReceiveItemsComponent } from '../modal/receive-items/receive-items.component';

@Component({
  selector: 'ware-house-receipts',
  templateUrl: './ware-house-receipts.component.html',
  styleUrls: ['./ware-house-receipts.component.scss']
})
export class WareHouseReceiptsComponent implements OnInit {

  constructor( public modalService:NgbModal) { }

  ngOnInit() {
  }


  receiveItems(){
      const activeModal = this.modalService.open(ReceiveItemsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  
    }
  }


