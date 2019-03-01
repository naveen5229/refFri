import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderComponent } from '../../acounts-modals/order/order.component';
import { UserService } from '../../@core/data/users.service';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) { }

  ngOnInit() {
  }
  openModal (order?) {
    console.log('ledger123',order);
      if (order) this.common.params = order;
      const activeModal = this.modalService.open(OrderComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static',windowClass : "myCustomModalClass" });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        if (data.response) {
        // this.addLedger(data.ledger);
        }
      });
    }
}
