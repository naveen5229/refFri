import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { ActivityService } from '../../services/Activity/activity.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userType = '1';
  userDetails = {
    mobile: '',
    otp: '',
  };
  users = {
    username: '',
    password: ''
  };
  iswallet = '0';
  isConsignerLogin = '0';
  listenOTP = false;
  otpCount = 0;
  button = 'Send';
  formSubmit = false;
  qrCode = null;
  elementType: 'url' | 'canvas' | 'img' = 'url';
  interval = null;
  loginType = 1;
  loading: number = 0;
  constructor(public router: Router,
    private route: ActivatedRoute,
    public common: CommonService,
    public user: UserService,
    public activity: ActivityService,
    public api: ApiService) {

  }

  ngOnInit() {
    let url = window.location.href;
    url = url.toLowerCase();
    this.iswallet = url.search("walle8customer") > -1 ? '1' : '0';
    this.isConsignerLogin = url.search("consigner") > -1 ? '1' : '0';
    if (this.iswallet == '1') {
      this.user._loggedInBy = 'walle8customer';
      this.button = 'Send';
      return;
    } else if (this.isConsignerLogin == '1') {
      this.user._loggedInBy = 'consigner';
      this.button = 'Send';
      return;
    } else {
      this.route.params.subscribe(params => {
        if (params.type && (params.type.toLowerCase() == 'admin' || params.type.toLowerCase() == 'partner')) {
          this.button = 'Generate Qr-Code';
          this.user._loggedInBy = params.type.toLowerCase();
        } else if (params.type) {
          this.router.navigate(['/auth/login']);
          return;
        } else {
          this.user._loggedInBy = 'customer';
          this.button = 'Send';

        }
        console.log("Login By", this.user._loggedInBy);
      });
    }
  }

  ngAfterViewInit() {
    // this.removeDummy();
    document.getElementById('nb-global-spinner').style.display = 'none';
  }

  userLogin() {
    const params = {
      username: this.users.username,
      password: this.users.password,
    };
    this.loading++;
    this.api.post('Login/loginApi', params)
      .subscribe(res => {
        this.loading--;
        console.log("res:", res);
        if (res['code'] == 1) {
          clearInterval(this.interval);
          // this.common.showToast(res['msg']);
          localStorage.setItem('USER_TOKEN', res['data']['authkey']);
          localStorage.setItem('USER_DETAILS', JSON.stringify(res['data']));
          localStorage.setItem('iswallet', this.iswallet);
          this.user._details = res['data'];
          this.user._token = res['data']['authkey'];
          console.log('Login Type: ', this.user._loggedInBy);
          localStorage.setItem('LOGGED_IN_BY', this.user._loggedInBy);
          if (res['data'].axesToken && this.user._loggedInBy === 'customer') {
            localStorage.setItem('DOST_axesToken', res['data'][0].axesToken);
          }
          this.getUserPagesList();
        } else {
          // this.common.showError(res['msg']);
          alert(res['msg'])
        }
      }, err => {
        this.loading--;
        this.common.showError();
      });
  }

  removeDummy() {
    let allTags = document.getElementsByTagName('nb-card-header');
    document.getElementsByTagName('nb-layout-column')[0]['style']['padding'] = '0px';
    allTags[0]['style'].display = 'none';
    console.log('All Tags: ', allTags);
    if (this.user._loggedInBy == "customer") {
      let nbCard = document.getElementsByTagName('nb-card')[0];
      nbCard['style']['backgroundImage'] = "url('http://elogist.in./images/app-login-bg.jpg')";
      nbCard['style']['backgroundSize'] = 'cover';
      nbCard['style']['backgroundRepeat'] = 'no-repeat';
      nbCard['style']['backgroundPosition'] = 'bottom';
      nbCard['style']['height'] = '100%';
    }

    else if (this.user._loggedInBy == "admin") {
      let nbCard = document.getElementsByTagName('nb-card')[0];
      nbCard['style']['backgroundImage'] = "url('http://elogist.in./images/login-admin.jpg')";
      nbCard['style']['backgroundSize'] = 'cover';
      nbCard['style']['backgroundRepeat'] = 'no-repeat';
      nbCard['style']['backgroundPosition'] = 'bottom';
      nbCard['style']['height'] = '100%';
    }
    else if (this.user._loggedInBy == "consigner") {
      let nbCard = document.getElementsByTagName('nb-card')[0];
      // nbCard['style']['backgroundImage'] = "url('http://elogist.in./images/login-admin.jpg')";
      nbCard['style']['backgroundColor'] = '#29474e';
      nbCard['style']['backgroundSize'] = 'cover';
      nbCard['style']['backgroundRepeat'] = 'no-repeat';
      nbCard['style']['backgroundPosition'] = 'bottom';
      nbCard['style']['height'] = '100%';
    }

    else {
      let nbCard = document.getElementsByTagName('nb-card')[0];
      // nbCard['style']['backgroundImage'] = "url('http://elogist.in./images/login-admin.jpg')";
      nbCard['style']['backgroundColor'] = '#e9dcdc';
      nbCard['style']['backgroundSize'] = 'cover';
      nbCard['style']['backgroundRepeat'] = 'no-repeat';
      nbCard['style']['backgroundPosition'] = 'bottom';
      nbCard['style']['height'] = '100%';
    }
  }


  sendOTP() {
    this.qrCode = Math.floor(Math.random() * 1000000);
    if (this.qrCode.length != 6) {
      this.qrCode = Math.floor(Math.random() * 1000000);
    }
    this.qrCode = this.qrCode.toString();
    const params = {
      type: "login",
      mobileno: this.userDetails.mobile,
      qrcode: this.qrCode
    };
    this.loading++;
    this.api.post('Login/login', params)
      .subscribe(res => {
        this.loading--;
        console.log(res);
        if (res['success']) {
          this.loginType = res['data'].loginType;
          console.log("loginType", this.loginType);

          this.listenOTP = true;
          this.otpCount = 120;
          if (this.loginType === 2) {
            this.qrCodeRegenrate();
          }
          this.otpResendActive();
          this.formSubmit = false;
          // this.common.showToast(res['msg']);

        } else {
          // this.common.showError(res['msg']);
          alert(res['msg']);
        }
      }, err => {
        this.loading--;
        this.common.showError();
        console.log("rrrrrr", err);
      });
  }

  qrCodeRegenrate() {
    setTimeout(() => {
      this.listenOTP = false;
      this.otpCount = 0;
      this.formSubmit = false;
      this.qrCode = null;
    }, 120000);
    this.interval = setInterval(() => {
      this.login();
    }, 5000);
  }

  login() {

    if (this.otpCount <= 0) {
      clearInterval(this.interval);
    }
    if (this.loginType == 2 && !this.qrCode) {
      this.common.showError("Please regenerate qrcode");
      return;
    }
    let url = window.location.href;
    url = url.toLowerCase();

    this.iswallet = url.search("walle8customer") > -1 ? '1' : '0';
    console.log("Testing123:");
    const params = {
      type: "verifyotp",
      mobileno: this.userDetails.mobile,
      otp: this.userDetails.otp,
      qrcode: this.loginType === 1 ? null : this.qrCode,
      device_token: null,
      iswallet: this.iswallet
    };
    console.log('Login Params:', params, 'url', url, this.iswallet);

    this.api.post('Login/verifyotp', params)
      .subscribe(res => {
        console.log('login res', res);
        if (!res['success']) {
          return;
        }
        if (res['success']) {
          clearInterval(this.interval);
          // this.common.showToast(res['msg']);
          localStorage.setItem('USER_TOKEN', res['data'][0]['authkey']);
          localStorage.setItem('USER_DETAILS', JSON.stringify(res['data'][0]));
          localStorage.setItem('iswallet', this.iswallet);
          this.user._details = res['data'][0];

          console.log("isWallet:", this.user._details);
          this.user._token = res['data'][0]['authkey'];
          console.log('Login Type: ', this.user._loggedInBy);
          localStorage.setItem('LOGGED_IN_BY', this.user._loggedInBy);
          if (res['data'][0].axesToken && this.user._loggedInBy === 'customer') {
            localStorage.setItem('DOST_axesToken', res['data'][0].axesToken);
          }

          this.getUserPagesList();
        }
      }, err => {
        // --this.loading;
        this.common.showError();
      });
  }

  otpResendActive() {
    if (this.otpCount > 0) {
      setTimeout(this.otpResendActive.bind(this, --this.otpCount), 1000);
    } else {
      return this.common.showError("Session Expired & Login Again");
    }
  }

  getUserPagesList() {
    this.user._pages = null;
    let userTypeId = this.user._loggedInBy == 'admin' ? 1 : 3;
    const params = {
      userId: this.user._details.id,
      userType: userTypeId,
      iswallet: this.iswallet
    };
    this.loading++;
    this.api.post('UserRoles/getAllPages', params)
      .subscribe(res => {
        this.loading--;
        this.user._pages = res['data'].filter(page => {
          if (localStorage.getItem('iswallet') === '1')
            return true;
          return page.userid;
        });

        localStorage.setItem('DOST_USER_PAGES', JSON.stringify(this.user._pages));
        this.user.filterMenu("pages", "pages");
        this.user.filterMenu("admin", "admin");
        this.user.filterMenu("tyres", "tyres");
        this.user.filterMenu("battery", "battery");
        this.user.filterMenu("vehicleMaintenance", "vehicleMaintenance");
        this.user.filterMenu("wareHouse", "wareHouse");
        this.user.filterMenu("account", "account");
        this.user.filterMenu("challan", "challan");
        this.user.filterMenu("walle8", "walle8");
        this.user.filterMenu("loadIntelligence", "loadIntelligence");

        if (this.user._loggedInBy == "admin") {
          this.router.navigate(['/admin']);
        } else if (this.user._loggedInBy == 'partner') {
          this.router.navigate(['/partner']);
        } else {
          this.activity.heartbeat();
          this.activity.activityHandler("login");
          this.router.navigate(['/pages']);
        }
      }, err => {
        this.loading--;
        console.log('Error: ', err);
      })
  }

  backToLogin() {
    this.listenOTP = false;
    this.otpCount = 0;
    this.qrCode = null;
    this.formSubmit = false;
    this.loginType = 1;
    clearInterval(this.interval);
  }

}
