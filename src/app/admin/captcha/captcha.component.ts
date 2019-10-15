// Author by Lalit 


import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent implements OnInit {
  captchaImage = null;
  captchaText = '';
  captchaData = [];
  constructor(public api: ApiService,
    public common: CommonService) {
    this.common.refresh = this.refresh.bind(this);
    this.getPendingCaptchaList();
  }
  ngOnInit() {
  }

  refresh() {
    this.getPendingCaptchaList();
  }

  getPendingCaptchaList() {
    let params = {
    };
    this.common.loading++;
    this.api.get('Captchas/getPendingCaptchasInfo?')
      .subscribe(res => {
        this.common.loading--;
        this.captchaData = res['data'];
        console.log("api data", this.captchaData);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }

  fillCaptcha(captcha, index) {
    document.getElementById("captchaText").focus();
    this.captchaData.splice(index, 1);
    console.log("remaining Data", this.captchaData);
    let params = {
      text: this.captchaText,
      captchaId: captcha.id
    };
    this.common.loading++;
    if (this.captchaText) {
      this.api.post('Captchas/updateCaptcha', params)
        .subscribe(res => {
          this.common.loading--;
          console.log("api data", res);
          this.captchaText = '';
          this.getPendingCaptchaList();
        }, err => {
          this.common.loading--;
          console.log('Error: ', err);
        })
    }
  }

}
