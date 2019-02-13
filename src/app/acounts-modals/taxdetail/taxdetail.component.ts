import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'taxdetail',
  templateUrl: './taxdetail.component.html',
  styleUrls: ['./taxdetail.component.scss']
})
export class TaxdetailComponent implements OnInit {
  taxdetails = [{
    taxledger:{
      name:'',
      id:'',
    },
    taxrate:'',
    taxamount:''

  }];
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService){ }

  ngOnInit() {
  }

  dismiss(response) {
    this.activeModal.close({ response: response, taxDetails: this.taxdetails });
    return this.taxdetails;
   // console.log(this.taxdetails);
    
  }

  onSelected(selectedData, type, display, index) {
    this.taxdetails[index][type].name = selectedData[display];
    this.taxdetails[index][type].id = selectedData.id;
    console.log('tax detail User: ', this.taxdetails);
  }

  addAmountDetails() {
    this.taxdetails.push({
      taxledger:{
        name:'',
        id:'',
      },
    taxrate:'',
    taxamount:''
    });
  }
}
