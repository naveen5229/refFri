import { Component, OnInit, Renderer } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { CommonService } from '../..//services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { GenericSuggestionComponent } from '../generic-modals/generic-suggestion/generic-suggestion.component';
import { asElementData } from '@angular/core/src/view';
import { lstat } from 'fs';

@Component({
  selector: 'save-user-template',
  templateUrl: './save-user-template.component.html',
  styleUrls: ['./save-user-template.component.scss']
})
export class SaveUserTemplateComponent implements OnInit {
  button = 'Add';
  showhide = {
    show: true
  }
  template = {
    type: null,
    templateName: null,
    templateHtml: null,
    id: null
  }
  templatePreview = {
    PreviewId: null,
  };
  editTemplateHtml: any;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    public renderer: Renderer,
    private sanitizer: DomSanitizer

  ) {
    this.common.handleModalSize('class', 'modal-lg', '1600', 'px');
    if (this.common.params.title == 'Edit') {
      console.log("api data", this.common.params);
      this.button = "Update";
      this.showhide.show = false;
      this.templatePreview.PreviewId = this.common.params.userTemplate._id ? this.common.params.userTemplate._id : '';
      this.getTemplateId();
    }
  }


  getTemplateId() {
    this.common.loading++;
    this.api.get('userTemplate/view?id=' + this.templatePreview.PreviewId)
      .subscribe(res => {
        --this.common.loading;
        this.template.type = res['data'][0].ref_type;
        this.template.templateName = res['data'][0].title;
        this.template.templateHtml = res['data'][0].details;
        this.template.id = res['data'][0].id;
        this.setValue();
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }


  ngOnInit() {
  }

  setValue() {
    let html = this.template.templateHtml;
    let indeces = this.searchMulti(/@@@/gi, html);
    let indecesDone = this.searchMulti(/@([a-z]|[A-Z]|_)+@/gi, html);
    indeces.forEach(element => {
      let value = `<span class="fillvalue"><i class="far fa-plus-square"></i><label class="value">${element}</label></span>`;
      html = html.replace(/@@@/i, value);
    });
    indecesDone.forEach(element => {
      html = html.replace(/@([a-z]|[A-Z]|_)+@/i, function (x) {
        x = x.replace(/@+$/, '').replace(/^@+/, '');

        let value = `<span class="emptyValue"><label class="replaceValue">${x}</label><i class="far fa-minus-square"></i><label class="value">${element}</label></span>`;
        return value;
      });
    });
    this.editTemplateHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    setTimeout(() => {
      let spans = document.getElementsByClassName('fillvalue');
      for (let i = 0; i < spans.length; i++) {
        spans[i]['onclick'] = this.addValue.bind(this, spans[i]);
      }
    }, 500);

    setTimeout(() => {
      let span = document.getElementsByClassName('emptyValue');
      for (let i = 0; i < span.length; i++) {
        span[i]['onclick'] = this.emptyValue.bind(this, span[i]);
      }
    }, 500);
  }

  addEdit() {
    let params = {
      type: this.template.type,
      templateName: this.template.templateName,
      template: this.template.templateHtml,
      id: this.template.id
    };
    ++this.common.loading;
    this.api.post("UserTemplate/save", params)
      .subscribe(res => {
        --this.common.loading;
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          if (this.template.id == null) {
            this.reset();
            this.getTemplateId();
          }
        }
        else {
          this.common.showError(res['data'][0].y_msg);
        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }
  closeModal() {
    this.activeModal.close({ ex: 'Modal has been closed' });
  }

  reset() {
    this.template.id = "";
    this.template.templateHtml = "";
    this.template.templateName = "";
    this.template.type = "";
  }

  addValue(element) {
    let index = parseInt(element.getElementsByClassName("value")[0]['innerHTML']);
    let genericData = {
      title: 'Suggestion',
      api: 'UserTemplate/getVariables',
      param: {
        refType: this.template.type,
      },
      keySearch: "name",
      display: ['name', 'value'],
    }
    this.common.params = { genericData };
    const activeModal = this.modalService.open(GenericSuggestionComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr', });
    activeModal.result.then(data => {
      this.template.templateHtml = this.replaceAt(this.template.templateHtml, index, 3, data.event.value);
      this.setValue();
    });
  }

  emptyValue(element) {
    let index = parseInt(element.getElementsByClassName("value")[0]['innerHTML']);
    let noOfReplace = element.getElementsByClassName("replaceValue")[0]['innerHTML'].length;
    console.log("no replace", noOfReplace);

    console.log("index", index);
    this.template.templateHtml = this.replaceAt(this.template.templateHtml, index, noOfReplace + 2, '@@@');
    this.setValue();

  }

  replaceAt(str, index, noOfReplace, replacement) {
    let last = str.substr(index + noOfReplace);
    let first = str.substr(0, index);
    return first + replacement + last;
  };

  searchMulti(regex, str) {
    var result, indices = [];
    while ((result = regex.exec(str))) {
      indices.push(result.index);
    }
    return indices;
  }


}
