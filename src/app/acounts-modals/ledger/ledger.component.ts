import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {
  Accounts = {
    name: '',
    aliasname: '',
    perrate: '',
    user: {
      name: '',
      id: ''
    },
    account: {
      name: '',
      id: '',
      primarygroup_id: ''
    },
    code: '',
    accDetails:[{
      salutationId:'',
      mobileNo:'',
      email:'',
      panNo:'',
      tanNo:'',
      gstNo:'',
      cityId:'',
      address:'',
      remarks:'',
      name:''
    }]
  };

  
  allowBackspace = true;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {

    if (this.common.params) {
      this.Accounts = {
        name: this.common.params.name,
        aliasname: this.common.params.aliasname,
        perrate: this.common.params.perrate,
        user: {
          name: this.common.params.name,
          id: this.common.params.id
        },
        account: {
          name: this.common.params.name,
          id: this.common.params.id,
          primarygroup_id: this.common.params.primarygroup_id
        },
        code: '',
        accDetails:[{
          salutationId: this.common.params.accDetails.salutationId,
          mobileNo: this.common.params.accDetails.mobileNo,
          email: this.common.params.accDetails.email,
          panNo: this.common.params.accDetails.panNo,
          tanNo: this.common.params.accDetails.tanNo,
          gstNo: this.common.params.accDetails.gstNo,
          cityId:this.common.params.accDetails.cityId,
          address:this.common.params.accDetails.address,
          remarks:this.common.params.accDetails.remarks,
          name:this.common.params.accDetails.name

        }]
      }

      console.log('Accounts: ', this.Accounts);
    }
    
    this.common.handleModalSize('class', 'modal-lg', '950');
  }

  
  addDetails() {
    this.Accounts.accDetails.push({
      salutationId:'',
      mobileNo:'',
      email:'',
      panNo:'',
      tanNo:'',
      gstNo:'',
      cityId:'',
      address:'',
      remarks:'',
      name:''

    });
  }

  ngOnInit() {
  }
  dismiss(response) {
    console.log('Accounts:', this.Accounts);
    this.activeModal.close({ response: response, ledger: this.Accounts });
  }

  onSelected(selectedData, type, display) {
    this.Accounts[type].name = selectedData[display];
    this.Accounts[type].id = selectedData.id;
    console.log('Accounts User: ', this.Accounts);
  }
  onParent(selectedData, type, display) {
    this.Accounts[type].name = selectedData[display];
    this.Accounts[type].id = selectedData.id;
    this.Accounts[type].primarygroup_id = selectedData.primarygroup_id;
    console.log('Accounts Parent: ', this.Accounts);
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;
   // console.log('event',event);
    if (key == 'enter') {

      console.log('active',activeId);
      if (activeId.includes('user')) {
        this.setFoucus('code');
      } else if (activeId.includes('code')) {
        this.setFoucus('name');
      }else if (activeId.includes('name')) {
        this.setFoucus('aliasname');
      }else if (activeId.includes('aliasname')) { this.setFoucus('undergroup'); }
     else if (activeId.includes('undergroup')) { this.setFoucus('perrate'); }
     else if (activeId.includes('perrate')){ 
      this.setFoucus('accountName-0');
     } else if (activeId.includes('accountName-')){  
      let index = activeId.split('-')[1]; 
      this.setFoucus('salution-'+index);
    } else if (activeId.includes('salution-')){  
      let index = activeId.split('-')[1]; 
      this.setFoucus('mobileno-'+index);
    }else if (activeId.includes('mobileno-')){  
      let index = activeId.split('-')[1]; 
      this.setFoucus('email-'+index);
    }else if (activeId.includes('email-')){  
      let index = activeId.split('-')[1]; 
      this.setFoucus('panNo-'+index);
    }else if (activeId.includes('panNo-')){  
      let index = activeId.split('-')[1]; 
      this.setFoucus('tanNo-'+index);
    }else if (activeId.includes('tanNo-')){  
      let index = activeId.split('-')[1]; 
      this.setFoucus('gstNo-'+index);
    }else if (activeId.includes('gstNo-')){  
      let index = activeId.split('-')[1]; 
      this.setFoucus('city-'+index);
    }else if (activeId.includes('city-')){  
      let index = activeId.split('-')[1]; 
      this.setFoucus('address-'+index);
    }else  if (activeId.includes('address-')){  
      let index = activeId.split('-')[1]; 
      this.setFoucus('remarks-'+index);
    }else if (activeId.includes('remarks-')){  
      let index = activeId.split('-')[1]; 
      console.log(index);
     // this.setFoucus('mobileno-'+index);
    }
    } else if (key == 'backspace') {

      if (activeId.includes('accountName-')){  
        let index = parseInt(activeId.split('-')[1]);
        if(index != 0){ 
        this.setFoucus('remarks-'+ (index-1) );
        }else{
          this.setFoucus('perrate');
        }
      }else if (activeId.includes('salution-')){  
        let index = activeId.split('-')[1]; 
        this.setFoucus('accountName-'+index);
      } else if (activeId.includes('mobileno-')){  
        let index = activeId.split('-')[1]; 
        this.setFoucus('salution-'+index);
      }else if (activeId.includes('email-')){  
        let index = activeId.split('-')[1]; 
        this.setFoucus('mobileno-'+index);
      }else if (activeId.includes('panNo-')){  
        let index = activeId.split('-')[1]; 
        this.setFoucus('email-'+index);
      }else if (activeId.includes('tanNo-')){  
        let index = activeId.split('-')[1]; 
        this.setFoucus('panNo-'+index);
      }else if (activeId.includes('gstNo-')){  
        let index = activeId.split('-')[1]; 
        this.setFoucus('tanNo-'+index);
      }else if (activeId.includes('city-')){  
        let index = activeId.split('-')[1]; 
        this.setFoucus('gstNo-'+index);
      }else  if (activeId.includes('address-')){  
        let index = activeId.split('-')[1]; 
        this.setFoucus('city-'+index);
      }else  if (activeId.includes('remarks-')){  
        let index = activeId.split('-')[1]; 
        this.setFoucus('address-'+index);
      }
      
      if (activeId == 'perrate') this.setFoucus('undergroup');
      if (activeId == 'undergroup') this.setFoucus('aliasname');
      if (activeId == 'aliasname') this.setFoucus('name');
      if (activeId == 'name') this.setFoucus('code');
      if (activeId == 'code') this.setFoucus('user');
    }

    else if (key != 'backspace') {
       this.allowBackspace = false;
       //event.preventDefault();
      }
    else if (key.includes('arrow')) {
        this.allowBackspace = false;
        }
}

  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
  }

}
