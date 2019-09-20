import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'generic-suggestion',
  templateUrl: './generic-suggestion.component.html',
  styleUrls: ['./generic-suggestion.component.scss']
})
export class GenericSuggestionComponent implements OnInit {
  title = '';
  elementId = null;
  url = '';
  params = null;
  apiData = [];
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
    this.common.handleModalSize('class', 'modal-lg', '480', 'px');
    if (this.common.params && this.common.params.genericData) {

      this.title = this.common.params.genericData.title;
      this.elementId = this.common.params.genericData.id;
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

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close(false);
  }

  getSuggestionData() {
    console.log("Data :", this.params);
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

}
