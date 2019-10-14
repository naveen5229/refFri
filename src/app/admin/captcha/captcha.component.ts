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
  constructor(public api: ApiService,
    public common: CommonService) {
    this.getPendingCaptchaList();
    this.captchaImage = "assets/images/avtar-2.png";
  }
  ngOnInit() {
  }


  getPendingCaptchaList() {
    let params = {
    };
    this.common.loading++;
    this.api.get('Captchas/getPendingCaptchasInfo?')
      .subscribe(res => {
        this.common.loading--;
        console.log("api data", res);
        this.common.showToast(res['msg'])
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }

  fillCaptcha() {
    let params = {
      text: this.captchaText,
      captchaId: 1
    };
    this.common.loading++;
    this.api.post('Captchas/updateCaptcha', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("api data", res);
        this.common.showToast(res['msg'])
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }

}
