import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // id:5
  userDetails = {
    mobile: '',
    otp: ''
  };

  listenOTP = false;
  otpCount = 0;
  formSubmit = false;

  constructor(public router: Router,
    private route: ActivatedRoute,
    public common: CommonService,
    public user: UserService,
    public api: ApiService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('Params: ', params);
      if (params.type && ['admin', 'partner'].includes(params.type.toLowerCase())) {
        this.common.loginType = params.type.toLowerCase();
        if (this.common.loginType == 'admin')
          localStorage.setItem('ENTRY_MODE', '1');
        else
          localStorage.setItem('ENTRY_MODE', '2');
      } else {
        this.common.loginType = '';
        localStorage.setItem('ENTRY_MODE', '3');
      }
      console.log('Login Type: ', this.common.loginType);
    });
  }

  ngAfterViewInit() {
    this.removeDummy();
  }

  removeDummy() {
    let allTags = document.getElementsByTagName('nb-card-header');
    document.getElementsByTagName('nb-layout-column')[0]['style']['padding'] = '0px';
    allTags[0]['style'].display = 'none';
    console.log('All Tags: ', allTags);
    let nbCard = document.getElementsByTagName('nb-card')[0];
    nbCard['style']['backgroundImage'] = "url('http://elogist.in./images/app-login-bg.jpg')";
    nbCard['style']['backgroundSize'] = 'cover';
    nbCard['style']['backgroundRepeat'] = 'no-repeat';
    nbCard['style']['backgroundPosition'] = 'bottom';
    nbCard['style']['height'] = '100%';


  }
  sendOTP() {
    const params = {
      type: "login",
      mobileno: this.userDetails.mobile
    };
    ++this.common.loading;
    let options = {};
    if (this.common.loginType == 'admin') {
      options = { entrymode: '1' };
    }

    this.api.post('Login/login', params, this.common.loginType && options)
      .subscribe(res => {
        --this.common.loading;
        console.log(res);
        if (res['success']) {
          this.listenOTP = true;
          this.otpCount = 30;
          this.otpResendActive();
          this.formSubmit = false;
          this.common.showToast(res['msg']);
        } else {
          this.common.showError(res['msg']);
        }
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
    let options = {};
    if (this.common.loginType == 'admin') {
      options = { entrymode: '1' };
    }
    else if (this.common.loginType == 'partner') {
      options = { entrymode: '2' };
    }
    console.log('Login Params:', params)
    this.api.post('Login/verifyotp', params, this.common.loginType && options)
      .subscribe(res => {
        --this.common.loading;
        console.log(res);
        this.common.showToast(res['msg']);
        if (res['success']) {
          localStorage.setItem('USER_TOKEN', res['data'][0]['authkey']);
          localStorage.setItem('USER_DETAILS', JSON.stringify(res['data'][0]));

          this.user._details = res['data'][0];
          this.user._token = res['data'][0]['authkey'];
          if (this.common.loginType == 'admin') {
            localStorage.setItem('LOGIN_TYPE', this.common.loginType);
            this.router.navigate(['/admin']);
            return;
          } else if (this.common.loginType == 'partner') {
            this.router.navigate(['/partner']);
            localStorage.setItem('LOGIN_TYPE', this.common.loginType);
            return;
          } else {
            this.common.foAdminUserId = res['data'][0]['id']
            this.common.foAdminName = res['data'][0]['name']
            this.router.navigate(['/pages']);
            console.log(this.common.foAdminName);
          }
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
