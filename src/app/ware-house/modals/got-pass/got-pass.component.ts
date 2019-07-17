import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../../modals/date-picker/date-picker.component';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'got-pass',
  templateUrl: './got-pass.component.html',
  styleUrls: ['./got-pass.component.scss']
})
export class GotPassComponent implements OnInit {
  itemList = [];
  itemId = null;
  quantityId = null;
  unitTypeId = null;
  unitList = [];
  Date = null;
  remark=''
  quantity = [{
    name: '5',
    id: '5'
  },
  {
    name: '10',
    id: '10'
  },
  {
    name: '15',
    id: '15'
  }, {
    name: '20',
    id: '20'
  },
  {
    name: '25',
    id: '25'
  },
  {
    name: '30',
    id: '30'
  }];
  stateType = [{
    name: 'Increase In Count',
    id: '-6'
  }, {
    name: 'Transhipment',
    id: '2'
  }, {
    name: 'out for delivery',
    id: '4'
  }, {
    name: 'Damage',
    id: '5'
  },
  {
    name: 'Missing/theft',
    id: '6'
  }, {
    name: 'receive Manifest',
    id: '-1'
  }, {
    name: 'Received By GP',
    id: '-2'
  }, {
    name: 'delivered',
    id: '1'
  }, {
    name: 'received lr',
    id: '-3'
  }, {
    name: 'returned Back',
    id: '-4'
  }]
  StateId = null;
  constructor(public common: CommonService,
    public modalService: NgbModal,
    private api: ApiService,
    public activeModal: NgbActiveModal) {
    this.getUnitList();
  }

  ngOnInit() {
  }
  getUnitList() {
    let params = {
      search: ''
    }
    this.common.loading++;
    this.api.post('Suggestion/getUnit', params)
      .subscribe(res => {
        this.common.loading--;
        this.unitList = res['data'];
        console.log('type', this.unitList);
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
  closeModal() {
    this.activeModal.close();
  }
  cancelRequest() {
    this.activeModal.close();
  }
}
