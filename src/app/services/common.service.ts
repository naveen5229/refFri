import { Injectable } from '@angular/core';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService, NbThemeService } from '@nebular/theme';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from './api.service';




@Injectable({
  providedIn: 'root'
})
export class CommonService {

  params = null;
  loading = 0;
  chartData: any;
  chartOptions: any;
  themeSubscription: any;
  searchId = null;


  primaryType = {
    1: { page: 'HomePage', title: 'Home' },
    2: { page: 'HomePage', title: 'Home' },
    100: { page: '/ticket-details', title: 'Ticket Details' },
    200: { page: '/pages/ticket-site-details', title: 'Vehicle Halt' },
    201: { page: 'VehicleHaltPage', title: 'Change Vehicle Halt' },
    300: { page: '/pages/ticket-site-details', title: 'Vehicle Halt' },
    301: { page: 'VehicleHaltPage', title: 'Change Site Halt' },
  };

  secondaryType = {
    201: {
      page: 'VehicleHaltPage',
      btnTxt: 'Change Halt',
      title: 'Change Vehicle Halt'
    },
    301: {
      page: 'VehicleHaltPage',
      btnTxt: 'Change Halt',
      title: 'Change Site Halt'
    },
  };


  pages = {
    100: { title: 'Home', page: 'HomePage' },
    200: { title: 'Vehicle KPIs', page: 'VehicleKpisPage' },
    201: { title: 'KPI Details', page: 'VehicleKpiDetailsPage' }
  }


  constructor(
    public router: Router,
    private toastrService: NbToastrService,
    private theme: NbThemeService,
    public api: ApiService,
    private datePipe: DatePipe
  ) {


  }

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


  }


  renderPage(priType, secType1, secType2, data?) {
    console.log('Data: ', data);
    let page = this.primaryType[priType];
    this.params = { data: data, secType1: secType1, secType2: secType2, title: page.title };
    this.router.navigate([page.page]);
  }

  dateFormatter(date, type = 'YYYYMMDD') {
    let d = new Date(date);
    let year = d.getFullYear();
    let month = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
    let dat = d.getDate() < 9 ? '0' + d.getDate() : d.getDate();

    console.log(dat + '/' + month + '/' + year);
    if (type == 'ddMMYYYY') {
      return (dat + '/' + month + '/' + year) + ' ' + this.timeFormatter(date);
    } else {
      return (year + '-' + month + '-' + dat) + ' ' + this.timeFormatter(date);
    }
  }

  dateFormatter1(date) {
    let d = new Date(date);
    let year = d.getFullYear();
    let month = d.getMonth() <= 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
    let dat = d.getDate() <= 9 ? '0' + d.getDate() : d.getDate();

    console.log(dat + '-' + month + '-' + year);

    return (year + '-' + month + '-' + dat);

  }

  changeDateformat(date) {
    let d = new Date(date);
    return this.datePipe.transform(date, 'dd-MMM-yyyy hh:mm a')
  }

  changeDateformat1(date) {
    let d = new Date(date);
    return this.datePipe.transform(date, 'dd-MMM-yyyy')
  }

  timeFormatter(date) {
    let d = new Date(date);
    let hours = d.getHours() < 9 ? '0' + d.getHours() : d.getHours();
    let minutes = d.getMinutes() < 9 ? '0' + d.getMinutes() : d.getMinutes();
    return (hours + ':' + minutes + ':00');
  }

  getDate(days = 0, formatt?) {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    if (formatt) {
      return this.dateFormatter(currentDate, formatt);
    }
    return currentDate;
  }


  // pieChart(chartLabels, chartdatas, charColors) {
  //   this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
  //     console.log('Config: ', config);
  //     const colors: any = config.variables;
  //     const chartjs: any = config.variables.chartjs;

  //     this.chartData = {
  //       labels: chartLabels,
  //       datasets: [{
  //         data: chartdatas,
  //         backgroundColor: charColors
  //       }],
  //     };

  //     this.chartOptions = {
  //       maintainAspectRatio: false,
  //       responsive: true,
  //       scales: {
  //         xAxes: [
  //           {
  //             display: false,
  //           },
  //         ],
  //         yAxes: [
  //           {
  //             display: false,
  //           },
  //         ],
  //       },
  //       legend: false,
  //     };
  //   });

  //   setTimeout(() => {
  //     console.log(document.getElementsByTagName('canvas')[0]);

  //     document.getElementsByTagName('canvas')[0].style.width = "100px";
  //     document.getElementsByTagName('canvas')[0].style.height = "220px";

  //   }, 10);
  // }

  pieChart(labels, data, colors) {
    let chartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors
      }],
    };

    let chartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: [
          {
            display: false,
          },
        ],
        yAxes: [
          {
            display: false,
          },
        ],
      },
      legend: false,
    };

    setTimeout(() => {
      console.log(document.getElementsByTagName('canvas')[0]);
      document.getElementsByTagName('canvas')[0].style.width = "80px";
      document.getElementsByTagName('canvas')[0].style.height = "180px";
    }, 10);

    return { chartData, chartOptions };
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  handleModalSize(type, name, size, position = 0) {
    setTimeout(() => {
      if (type == 'class') {
        document.getElementsByClassName(name)[position]['style'].maxWidth = size + 'px';
      }
    }, 100);

  }

  apiErrorHandler(err, hideLoading, showError, msg?) {
    console.error('Api Error: ', err);
    hideLoading && this.loading--;
    showError && this.showError(msg);
  }

  reportAnIssue(issue, refId) {
    const params = {
      issueTypeId: issue.type,
      refId: refId,
      remark: issue.remark
    };
    console.info('Params: ', params);
    this.loading++;
    this.api.post('InformationIssue/insertIssueRequest', params)
      .subscribe(res => {
        this.loading--;
        console.info('Res: ', res);
        this.showToast(res['msg']);
      }, err => this.apiErrorHandler(err, true, true))
  }
}
