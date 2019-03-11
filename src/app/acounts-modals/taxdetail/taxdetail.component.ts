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
  showConfirm = false;
  taxdetails = [{
    taxledger:{
      name:'',
      id:'',
    },
    taxrate:'',
    taxamount:''

  }];
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService){
      this.setFoucus('taxledger-0');
     }

    allowBackspace = true;
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

    const activeId = document.activeElement.id;
    let index = parseInt(activeId.split('-')[1])+1;
    console.log(index);
   // activeId.includes('taxdetailbutton');
    this.setFoucus('taxledger-'+index);
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;
    console.log('Active Id', activeId);

    if (this.showConfirm) {
      if (key == 'enter') {
        console.log(' show taxdetails:', this.taxdetails);
        this.dismiss(true);
        this.common.showToast('Your Value Has been saved!');
      } else   if (key == 'y') {
         this.addAmountDetails();
      }
      this.showConfirm = false;
      event.preventDefault();
      return;
    }

    if (key == 'enter') {
      this.allowBackspace = true;
        // console.log('active', activeId);
        if (activeId.includes('taxledger') || activeId.includes('taxrate')|| activeId.includes('taxamount')) {
          let index = activeId.split('-')[1];
          if (activeId.includes('taxledger'))  this.setFoucus('taxrate-'+index);
          if (activeId.includes('taxrate'))  this.setFoucus('taxamount-'+index);
          if (activeId.includes('taxamount'))   this.showConfirm = true;

        }

        
      }else if (key == 'backspace' && this.allowBackspace) {
        event.preventDefault();

        if (activeId.includes('taxledger') || activeId.includes('taxrate')|| activeId.includes('taxamount')) {
          let index = parseInt(activeId.split('-')[1]);
          if(index != 0)  this.setFoucus('taxamount-'+(index - 1));
          if (activeId.includes('taxrate'))  this.setFoucus('taxledger-'+index);
          if (activeId.includes('taxamount'))   this.setFoucus('taxrate-'+index);

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
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
  }
}
