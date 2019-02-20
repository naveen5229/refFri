import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';

@Component({
  selector: 'ledgermapping',
  templateUrl: './ledgermapping.component.html',
  styleUrls: ['./ledgermapping.component.scss']
})
export class LedgermappingComponent implements OnInit {
  ledgerMapping = {
    ledger :{
        name:'',
        id:''
      },
      group :{
        name:'',
        id:''
      },
    };
    ledgerMappingData=[];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) { 
    }


  ngOnInit() {
  }


  getLedgerView() {
  //  console.log('Ledger:', this.ledgerMapping);
    let params = {
      ledger: this.ledgerMapping.ledger.id,
      group: this.ledgerMapping.group.id,
    };
    
    this.common.loading++;
    this.api.post('Accounts/getLedgerMapping', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerMappingData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      }); 
  }



  
  onSelected(selectedData, type, display) {
    this.ledgerMapping[type].name = selectedData[display];
    this.ledgerMapping[type].id = selectedData.id;
    // console.log('order User: ', this.DayBook);
  }
}
