import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'stock-type',
  templateUrl: './stock-type.component.html',
  styleUrls: ['./stock-type.component.scss']
})
export class StockTypeComponent implements OnInit {
  showConfirm = false;
  showExit = false;
  stockType = {
    name: '',
    code: '',
    isservice:false
  };
  showSuggestions = false;
  suggestions = [];
  allowBackspace = true;

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
    console.log("data in model :", this.common.params);
    if (this.common.params) {
      this.stockType.name = this.common.params.name;
      this.stockType.code = this.common.params.code;
      this.stockType.isservice = this.common.params.is_service;

    }
    this.common.handleModalSize('class', 'modal-lg', '1250','px',0);
  }

  ngOnInit() {
  }

  dismiss(response) {
    console.log('response',response);
        if(response){
        if(this.stockType.name.toString().trim()){
          console.log('Stock Type:', this.stockType);
          this.activeModal.close({ response: response, stockType: this.stockType });
        }else{
          this.common.showError('Please fill Name');
          return;
        }
      }else{
        this.activeModal.close({ response: response, stockType: this.stockType });
      }
  }

  // searchUser() {
  //   this.stockType.user.id = -1;
  //   this.showSuggestions = true;
  //   let params = 'search=' + this.stockType.user.name;
  //   this.api.get('Suggestion/getFoUsersList?' + params) // Customer API
  //     // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
  //     .subscribe(res => {
  //       console.log(res);
  //       this.suggestions = res['data'];
  //     }, err => {
  //       console.error(err);
  //       this.common.showError();
  //     });
  // }

  // selectUser(user) {
  //   this.stockType.user.name = user.name;
  //   this.stockType.user.id = user.id;
  //   this.showSuggestions = false;
  // }


  onSelected(selectedData, type, display) {
    this.stockType[type].name = selectedData[display];
    this.stockType[type].id = selectedData.id;
    //console.log('Stock Unit: ', this.stockItem);
  }

  modelCondition() {
    this.showConfirm = false;
    event.preventDefault();
    return;
  }
  modelcloseCondition() {
    this.showExit = false;
    event.preventDefault();
    return;
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;
    console.log('Active Id', activeId);
    if (event.key == "Escape") {
      this.showExit = true;
    }
    if (this.showExit) {
      if (key == 'y' || key == 'enter') {
        this.showExit = false;
        event.preventDefault();
        this.activeModal.close();
        return;
        // this.close();
      } else if (key == 'n') {
        this.showExit = false;
        event.preventDefault();
        return;

      }

    }

    if (this.showConfirm) {
      if (key == 'y' || key == 'enter') {
        console.log('Ledgers show stockType:', this.stockType);
        this.dismiss(true);
        // this.common.showToast('Your Value Has been saved!');
      }
      this.showConfirm = false;
      event.preventDefault();
      return;
    }
    if (key == 'enter') {
      this.allowBackspace = true;
      // console.log('active', activeId);
      // console.log('Active jj: ', activeId.includes('aliasname'));
      if (activeId.includes('user')) {
        this.setFoucus('name');
      } else if (activeId.includes('name')) {
        this.setFoucus('code');
      } else if (activeId.includes('code')) {
        this.setFoucus('isservice');
      } else if (activeId == 'isservice') {
        // this.setFoucus('aliasname');
        this.showConfirm = true;
      }else if (activeId == 'notisactive') {
        // this.setFoucus('aliasname');
        this.showConfirm = true;
      }

      
    } else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', activeId);
      if (activeId == 'code') this.setFoucus('name');
      if (activeId == 'name') this.setFoucus('user');
      if (activeId == 'isservice') this.setFoucus('code');
      if (activeId == 'notisactive') this.setFoucus('code');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if (key != 'backspace') {
      this.allowBackspace = false;
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
