import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'generic-suggestion',
  templateUrl: './generic-suggestion.component.html',
  styleUrls: ['./generic-suggestion.component.scss']
})
export class GenericSuggestionComponent implements OnInit {
  title = '';
  url = '';
  params = null;
  apiData = [];
  apiDataFiltered = [];
  showSuggestions = false;
  searchString = "";
  searchWith = [];
  display = [];

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
    this.common.handleModalSize('class', 'modal-lg', '480', 'px', 1);
    if (this.common.params && this.common.params.genericData) {
      this.title = this.common.params.genericData.title;
      this.searchWith = this.common.params.genericData.keySearch;
      this.display = this.common.params.genericData.display;
      this.url = this.common.params.genericData.api;
      let str = "?";
      Object.keys(this.common.params.genericData.param).forEach(element => {
        if (str == '?')
          str += element + "=" + this.common.params.genericData.param[element];
        else
          str += "&" + element + "=" + this.common.params.genericData.param[element];
      });
      this.params = this.url + str;
      this.getSuggestionData();
    }
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close(false);
  }

  getSuggestionData() {
    this.common.loading++;
    this.api.get(this.params)
      .subscribe(res => {
        this.common.loading--;
        console.log("res", res['data']);
        this.apiData = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  searchData() {
    this.showSuggestions = true;
    this.apiDataFiltered = this.apiData.filter((x) => {
      let condition = false;
      this.searchWith.forEach(ele => {
        condition = condition || x[ele].toLowerCase().search(this.searchString.toLowerCase()) != -1;
      });
      return condition;
    })
  }

  selectSuggestion(event) {
    this.showSuggestions = false;
    this.searchString = event.value;
    this.activeModal.close({ event });
  }

  getDisplay(suggestion) {
    let dis = [];
    this.display.forEach(element => {
      dis.push(suggestion[element])
    });
    return dis.join('-');
  }

}
