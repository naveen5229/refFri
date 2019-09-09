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
  // id:5
  userDetails = {
    mobile: '',
    otp: '',
  };

  listenOTP = false;
  otpCount = 0;

  formSubmit = false;

  constructor(public router: Router,
    private route: ActivatedRoute,
    public common: CommonService,
    public user: UserService,
    public activity: ActivityService,
    public api: ApiService) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.type && (params.type.toLowerCase() == 'admin' || params.type.toLowerCase() == 'partner')) {
        this.user._loggedInBy = params.type.toLowerCase();
      } else if (params.type) {
        this.router.navigate(['/auth/login']);

        return;
      } else {
        this.user._loggedInBy = 'customer';
      }
      console.log("Login By", this.user._loggedInBy);

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
    if (this.user._loggedInBy == "customer") {
      let nbCard = document.getElementsByTagName('nb-card')[0];
      // nbCard['style']['backgroundColor'] = "#000";
      nbCard['style']['backgroundImage'] = "url('http://elogist.in./images/app-login-bg.jpg')";
      nbCard['style']['backgroundSize'] = 'cover';
      nbCard['style']['backgroundRepeat'] = 'no-repeat';
      nbCard['style']['backgroundPosition'] = 'bottom';
      nbCard['style']['height'] = '100%';
    }

    if (this.user._loggedInBy == "admin") {
      let nbCard = document.getElementsByTagName('nb-card')[0];
      // nbCard['style']['backgroundColor'] = "#000";
      nbCard['style']['backgroundImage'] = "url('http://elogist.in./images/login-admin.jpg')";
      nbCard['style']['backgroundSize'] = 'cover';
      nbCard['style']['backgroundRepeat'] = 'no-repeat';
      nbCard['style']['backgroundPosition'] = 'bottom';
      nbCard['style']['height'] = '100%';
    }

  }


  sendOTP() {
    const params = {
      type: "login",
      mobileno: this.userDetails.mobile
    };
    console.log('Params:', params);
    ++this.common.loading;

    this.api.post('Login/login', params)
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

    console.log('Login Params:', params)
    this.api.post('Login/verifyotp', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res);
        this.common.showToast(res['msg']);
        if (res['success']) {
          localStorage.setItem('USER_TOKEN', res['data'][0]['authkey']);
          localStorage.setItem('USER_DETAILS', JSON.stringify(res['data'][0]));

          this.user._details = res['data'][0];
          this.user._token = res['data'][0]['authkey'];

          console.log('Login Type: ', this.user._loggedInBy);
          localStorage.setItem('LOGGED_IN_BY', this.user._loggedInBy);

          this.getUserPagesList();
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


  getUserPagesList() {

    this.user._pages = null;
    let userTypeId = this.user._loggedInBy == 'admin' ? 1 : 3;
    const params = {
      userId: this.user._details.id,
      userType: userTypeId
    };
    this.common.loading++;
    this.api.post('UserRoles/getAllPages', params)
      .subscribe(res => {
        this.common.loading--;
        this.user._pages = res['data'].filter(page => { return page.userid; });
        localStorage.setItem('DOST_USER_PAGES', JSON.stringify(this.user._pages));
        this.user.filterMenu("pages", "pages");
        this.user.filterMenu("admin", "admin");
        this.user.filterMenu("tyres", "tyres");
        this.user.filterMenu("battery", "battery");
        this.user.filterMenu("vehicleMaintenance", "vehicleMaintenance");
        this.user.filterMenu("wareHouse", "wareHouse");
        this.user.filterMenu("account", "account");
        console.log('this.user:', this.user);
        if (this.user._loggedInBy == 'admin') {
          this.router.navigate(['/admin']);
        } else if (this.user._loggedInBy == 'partner') {
          this.router.navigate(['/partner']);
        } else {
          this.activity.heartbeat();
          this.activity.activityHandler("login");
          this.router.navigate(['/pages']);
        }
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })

  }


}
