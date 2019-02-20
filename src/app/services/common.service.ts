import { Injectable } from '@angular/core';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService, NbThemeService } from '@nebular/theme';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';




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
  refresh = null;

  changeHaltModal = null;


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

  handleModalSize(type, name, size, sizeType = 'px', position = 0) {
    setTimeout(() => {
      if (type == 'class') {
        document.getElementsByClassName(name)[position]['style'].maxWidth = size + sizeType;
      }
    }, 10);

  }
  handleModalheight(type, name, size, sizeType = 'px', position = 0) {
    setTimeout(() => {
      if (type == 'class') {
        document.getElementsByClassName(name)[position]['style'].minHeight = size + sizeType;
      }
    }, 10);

  }

  generateArray(length){
    let generatedArray =[];
    for(let i=0;i<length;i++){
      generatedArray.push(i+1);
    }
    return generatedArray;
  }

  distanceFromAToB(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      let radlat1 = Math.PI * lat1/180;
      let radlat2 = Math.PI * lat2/180;
      let theta = lon1-lon2;
      let radtheta = Math.PI * theta/180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
          if (unit=="K") { dist = dist * 1.609344}
      if (unit=="Mt") { dist = dist * 1.609344*1000}
      if (unit=="N") { dist = dist * 0.8684 }
      return dist.toFixed(0);
      }
  }

  differenceBtwT1AndT2(date1, date2) {
    if (date1 == date2) {
        return 0;
    }
    else {
        date1 = new Date(date1);
        date2 = new Date(date2);
        let difference = date1.getTime() - date2.getTime();

        let daysDifference = Math.floor(difference/1000/60/60/24);
        difference -= daysDifference*1000*60*60*24

       let hoursDifference = Math.floor(difference/1000/60/60);
        difference -= hoursDifference*1000*60*60

        let minutesDifference = Math.floor(difference/1000/60);
        difference -= minutesDifference*1000*60

        let secondsDifference = Math.floor(difference/1000);
        return (daysDifference + ' day ' + hoursDifference + ' hr ');      

    // return ('difference = ' + daysDifference + ' day ' + hoursDifference + ' hour/s ' + minutesDifference + ' minute/s ' + secondsDifference + ' second/s ');      
      }
}
}
