import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { AddDispatchOrderComponent } from '../../modals/LRModals/add-dispatch-order/add-dispatch-order.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dispatch-orders',
  templateUrl: './dispatch-orders.component.html',
  styleUrls: ['./dispatch-orders.component.scss']
})
export class DispatchOrdersComponent implements OnInit {

  startDate = "";
  endDate = "";
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  }

  constructor(public common: CommonService,
    private modalService: NgbModal,
    public api: ApiService) {

  }

  ngOnInit() {
  }


  search() {
  }


  openDispatchOrder(dispatchOrder) {
    let dispatchOrderData = {
      id: dispatchOrder.id
    }
    this.common.params = { dispatchOrderData: dispatchOrderData }
    const activeModal = this.modalService.open(AddDispatchOrderComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Data:', data);

    });
  }

}
