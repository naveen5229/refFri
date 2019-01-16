import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userDetails = {
    mobile: '',
    otp: ''
  };

  listenOTP = false;
  otpCount = 0;
  formSubmit = false;



  constructor(public router: Router,
    public common: CommonService,
    public user: UserService,
    public api: ApiService) {
  }

  ngOnInit() {
  }

  sendOTP() {
    const params = {
      type: "login",
      mobileno: this.userDetails.mobile
    };
    ++this.common.loading;
    this.api.post('Login/login', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res);
        this.listenOTP = true;
        this.otpCount = 30;
        this.otpResendActive();
        this.formSubmit = false;
        this.common.showToast(res['msg']);
      }, err => {
        --this.common.loading;
        this.common.showError();
        console.log(err);
      });
  }

  login() {
    const params = {
      type: "verifyotp",
      mobileno: this.userDetails.mobile,
      otp: this.userDetails.otp,
      device_token: null
    };

    ++this.common.loading;

    console.log('Login Params:', params)
    this.api.post('Login/verifyotp', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res);
        this.common.showToast(res['msg']);
        if (res['success']) {
          localStorage.setItem('CUSTOMER_TOKEN', JSON.stringify(res['data'][0]));
          localStorage.setItem('CUSTOMER_DETAILS', res['data'][0]['authkey']);
          this.user._details = res['data'][0];
          this.user._token = res['data'][0]['authkey'];
          this.router.navigate(['/pages']);
        }
      }, err => {
        --this.common.loading;
        this.common.showError();
        console.log(err);
      });
  }

  otpResendActive() {
    if (this.otpCount > 0) {
      setTimeout(this.otpResendActive.bind(this, --this.otpCount), 1000);
    }
  }

}
