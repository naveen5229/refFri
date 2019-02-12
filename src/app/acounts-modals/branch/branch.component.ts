import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {
  Branches={
    name:'',
    user: {
      name: '',
      id: ''
    },
    account: {
      name: '',
      id: '',
      primarygroup_id:''
    }
  
  };
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) { 

      
      if (this.common.params) {
        this.Branches = {
          name: this.common.params.name,
          user: {
            name: this.common.params.name,
            id: this.common.params.id
          },
          account: {
            name: this.common.params.name,
            id: this.common.params.id,
            primarygroup_id :this.common.params.primarygroup_id
          }
        }
  
      //  console.log('Accounts: ', this.Accounts);
      }
    }

  ngOnInit() {
  }
  dismiss(response) {
    console.log('Accounts:', this.Branches);
    this.activeModal.close({ response: response, ledger: this.Branches });
  }

  onSelected(selectedData, type, display) {
    this.Branches[type].name = selectedData[display];
    this.Branches[type].id = selectedData.id;
    console.log('Accounts User: ', this.Branches);
  }
 
}
