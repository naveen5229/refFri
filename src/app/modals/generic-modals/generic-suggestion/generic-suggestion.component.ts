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
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
    this.title = this.common.params.genericData.title;
    console.log(this.common.params);

  }

  ngOnInit() {
  }

}
