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
  showConfirm = false;
  showExit=false;
  Branches = {
    name: '',
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
    phonenumber: '',
    mobilenumber: '',
    faxnumber: '',
    tollfreenumber: '',
    email: '',
    exciseno: '',
    tinno: '',
    panno: '',
    importexportno: '',
    tanno: '',
    gstno: '',
    taxexemptionno: '',
    isactive: '',
    addressline: '',
    remarks: ''
  };
  allowBackspace = true;
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
          primarygroup_id: this.common.params.primarygroup_id
        },
        code: '',
        phonenumber: '',
        mobilenumber: '',
        faxnumber: '',
        tollfreenumber: '',
        email: '',
        exciseno: '',
        tinno: '',
        panno: '',
        importexportno: '',
        tanno: '',
        gstno: '',
        taxexemptionno: '',
        isactive: '',
        addressline: '',
        remarks: ''
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

  keyHandler(event) {
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;
    console.log('event',event);
    if (event.key == "Escape") {
      this.showExit=true;
    }
    if (this.showExit) {
      if (key == 'y' || key == 'enter') {
        this.showExit = false;
       event.preventDefault();
       this.activeModal.close();
       return;
       // this.close();
      }else   if ( key == 'n') {
        this.showExit = false;
        event.preventDefault();
        return;

      }
      
    }

    if (this.showConfirm) {
      if (key == 'y' || key == 'enter') {
        console.log('Accounts show confirm:', this.Branches);
       this.dismiss(true);
        this.common.showToast('Your Value Has been saved!');
      }
      this.showConfirm = false;
      event.preventDefault();
      return;
    }


    if (key == 'enter') {
      this.allowBackspace = true;
      console.log('active',activeId);
      if (activeId.includes('user')) {
        this.setFoucus('name');
      }else  if (activeId.includes('name')) {
        this.setFoucus('code');
      }else  if (activeId.includes('code')) {
        this.setFoucus('phonenumber');
      }else  if (activeId.includes('phonenumber')) {
        this.setFoucus('mobilenumber');
      }else  if (activeId.includes('mobilenumber')) {
        this.setFoucus('faxnumber');
      }else  if (activeId.includes('faxnumber')) {
        this.setFoucus('tollfreenumber');
      }else  if (activeId.includes('tollfreenumber')) {
        this.setFoucus('email');
      }else  if (activeId.includes('email')) {
        this.setFoucus('exciseno');
      }else  if (activeId.includes('exciseno')) {
        this.setFoucus('tinno');
      }else  if (activeId.includes('tinno')) {
        this.setFoucus('panno');
      }else  if (activeId.includes('panno')) {
        this.setFoucus('importexportno');
      }else  if (activeId.includes('importexportno')) {
        this.setFoucus('tanno');
      }else  if (activeId.includes('tanno')) {
        this.setFoucus('gstno');
      }else  if (activeId.includes('gstno')) {
        this.setFoucus('taxexemptionno');
      }else  if (activeId.includes('taxexemptionno')) {
        this.setFoucus('isactive');
      }else  if (activeId.includes('isactive')) {
        this.setFoucus('addressline');
      }else  if (activeId.includes('addressline')) {
        this.setFoucus('remarks');
      }else  if (activeId.includes('remarks')) {
        this.showConfirm = true;
       // this.setFoucus('submit');
      }
  } else  if (key == 'backspace' && this.allowBackspace) {
    event.preventDefault();
      if (activeId.includes('name')) {
      this.setFoucus('user');
    }else  if (activeId.includes('code')) {
      this.setFoucus('name');
    }else  if (activeId.includes('phonenumber')) {
      this.setFoucus('code');
    }else  if (activeId.includes('mobilenumber')) {
      this.setFoucus('phonenumber');
    }else  if (activeId.includes('faxnumber')) {
      this.setFoucus('mobilenumber');
    }else  if (activeId.includes('tollfreenumber')) {
      this.setFoucus('faxnumber');
    }else  if (activeId.includes('email')) {
      this.setFoucus('tollfreenumber');
    }else  if (activeId.includes('exciseno')) {
      this.setFoucus('email');
    }else  if (activeId.includes('tinno')) {
      this.setFoucus('exciseno');
    }else  if (activeId.includes('panno')) {
      this.setFoucus('tinno');
    }else  if (activeId.includes('importexportno')) {
      this.setFoucus('panno');
    }else  if (activeId.includes('tanno')) {
      this.setFoucus('importexportno');
    }else  if (activeId.includes('gstno')) {
      this.setFoucus('tanno');
    }else  if (activeId.includes('taxexemptionno')) {
      this.setFoucus('gstno');
    }else  if (activeId.includes('isactive')) {
      this.setFoucus('taxexemptionno');
    }else  if (activeId.includes('addressline')) {
      this.setFoucus('isactive');
    }else  if (activeId.includes('remarks')) {
      this.setFoucus('addressline');
    }

  } else if (key.includes('arrow')) {
    this.allowBackspace = false;
  } else if (key != 'backspace') {
    this.allowBackspace = false;
    //event.preventDefault();
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
