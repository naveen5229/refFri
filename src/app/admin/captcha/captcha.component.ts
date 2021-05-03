// Author by Lalit 


import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent implements OnInit {
  count = 0;
  captchas = [];

  constructor(public api: ApiService,
    public common: CommonService) {
    this.common.refresh = this.refresh.bind(this);
    this.getCaptchas();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  ngAfterViewInit() {
  }

  refresh() {
    this.getCaptchas();
  }

  getCaptchas() {
    this.api.get('Captchas/getPendingCaptchasInfo')
      .subscribe(res => {
        console.log('Res:', res);
        // if (res['data'] && res['data'].length)
        this.captchas = res['data'].map(captcha => { captcha.txt = ''; return captcha; });
        setTimeout(() => {
          if (this.captchas.length) document.getElementById("captcha-0").focus();
        }, 300);
        // this.captchas.push(...res['data'].splice(0, 5 - this.captchas.length).map(captcha => { captcha.txt = ''; return captcha }));
      }, err => {
        console.log('Error: ', err);
        this.common.showError();
      })
  }

  captchaValidator(captcha, index) {
    if (captcha.txt)
      this.sendCaptchaTxt(captcha, index);
    else this.common.showError('Please enter valid captcha');
  }

  sendCaptchaTxt(captcha, index) {
    console.log("index:", index);

    this.captchas.splice(index, 1);
    let params = {
      text: captcha.txt,
      captchaId: captcha.id
    };
    this.api.post('Captchas/updateCaptcha', params)
      .subscribe(res => {
        console.log("Res: ", res);
        if (res['success']) this.count++;
        this.getCaptchas();
      }, err => {
        console.log('Error: ', err);
      })
    // setTimeout(() => {
    //   if (this.captchas.length) document.getElementById("captcha-0").focus();
    // }, 300);
  }

}
