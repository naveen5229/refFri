import { Injectable } from '@angular/core';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';




@Injectable({
  providedIn: 'root'
})
export class CommonService {

  params = null;
  loading = 0;
  searchId = null;


  constructor(
    private toastrService: NbToastrService
  ) { }

  showError(msg?) {
    this.showToast(msg || 'Something went wrong! try again.', 'danger');
  }

  showToast(body, type?, duration?, title?) {
    // toastTypes = ["success", "info", "warning", "primary", "danger", "default"]
    const config = {
      status: type || 'success',
      destroyByClick: true,
      duration: duration || 3000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };

    this.toastrService.show(
      body,
      title || 'Alert',
      config);
  }

  handleApiResponce(res) {
    if ([52, 53, 54].indexOf(res.code) !== -1) {
      return false;
    }
    return true;
  }

  findRemainingTime(time) {
    if (time > 59) {
      let minutes = Math.floor((time / 60));
      return minutes + ' mins'
    } else if (time > 44) {
      return '45 secs'
    } else if (time > 29) {
      return '30 secs'
    } else if (time > 14) {
      return '15 secs'
    } else {
      return '0 sec'
    }

    // if (time < 60) {
    //   return time + ' seconds';
    // } else {
    //   let minutes = Math.floor((time / 60));
    //   let seconds = time % 60;
    //   return minutes + ' minutes ' + seconds + ' seconds';
    // }
  }

}
