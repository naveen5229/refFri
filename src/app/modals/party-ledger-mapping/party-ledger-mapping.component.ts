import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'party-ledger-mapping',
  templateUrl: './party-ledger-mapping.component.html',
  styleUrls: ['./party-ledger-mapping.component.scss']
})
export class PartyLedgerMappingComponent implements OnInit {
 
  Party=[];
  userGroupId=null;
  partyId=null;
  constructor(public activeModel:NgbActiveModal,
    public api:ApiService) { 
      this.getPartyWrtFo();

    }

  ngOnInit() {
  }

  closeModal(){
    this.activeModel.close();

  }

  getPartyWrtFo() {
    this.api.get('Suggestion/getPartyWrtFo')
      .subscribe(res => {
        this.Party = res['data'];
      }, err => {
        console.error(' Api Error:', err);
      });
  }

  changePartyType(partyType) {
    console.log("party",partyType);
    this.partyId = this.Party.find((element) => {
     // console.log("hi",element.name == partyType.id);
      return element.id == partyType.id;
    }).id;
    this.userGroupId = this.Party.find((element) => {
     // console.log(element.name == partyType);
     console.log("id",element.user_group_id)
      return element.user_group_id == partyType.user_group_id;
      
    }).user_group_id;
  }

  getPartyLedgerMapping() {
    let params="partyId="+this.partyId+"&userGroupId="+this.userGroupId;
    this.api.get('ManageParty/getPartyLedgerMapping?'+params)
      .subscribe(res => {
        this.Party = res['data'];
      }, err => {
        console.error(' Api Error:', err);
      });
  }

}
