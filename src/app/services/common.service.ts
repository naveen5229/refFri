import { Injectable } from '@angular/core';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService, NbThemeService } from '@nebular/theme';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { UserService } from './user.service';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

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
  passedVehicleId = null;
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

  currentPage = '';

  constructor(
    public router: Router,
    private toastrService: NbToastrService,
    private theme: NbThemeService,
    public api: ApiService,
    public dataService: DataService,
    public user: UserService,
    private datePipe: DatePipe) {
    
  }

  showError(msg?) {
    this.showToast(msg || 'Something went wrong! try again.', 'danger');
  }

  showToast(body, type?, duration?, title?) {
    // toastTypes = ["success", "info", "warning", "primary", "danger", "default"]
    const config = {
      status: type || 'success',
      destroyByClick: true,
      duration: duration || 5000,
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

  dateFormatter(date, type = 'YYYYMMDD', isTime = true, separator = '/') {
    let d = new Date(date);
    let year = d.getFullYear();
    let month = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
    let dat = d.getDate() < 9 ? '0' + d.getDate() : d.getDate();

    // console.log(dat + separator + month + separator + year);
    if (type == 'ddMMYYYY') {
      return ( year + separator + month + separator +  dat) + (isTime ? ' ' + this.timeFormatter(date) : '');
    } else {
      return (year + separator + month + separator + dat) + (isTime ? ' ' + this.timeFormatter(date) : '');
    }
  }

  dateFormatter1(date) {
    let d = new Date(date);
    let year = d.getFullYear();
    let month = d.getMonth() <= 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
    let dat = d.getDate() <= 9 ? '0' + d.getDate() : d.getDate();

    console.log(year + '-' + month + '-' + dat);

    return (year + '-' + month + '-' + dat);

  }

  changeDateformat(date) {
    let d = new Date(date);
    return this.datePipe.transform(date, 'dd-MMM-yyyy hh:mm a')
  }

  changeDateformat2(date) {
    let d = new Date(date);
    return this.datePipe.transform(date, 'dd-MMM HH:mm')
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

  generateArray(length) {
    let generatedArray = [];
    for (let i = 0; i < length; i++) {
      generatedArray.push(i + 1);
    }
    return generatedArray;
  }

  distanceFromAToB(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      let radlat1 = Math.PI * lat1 / 180;
      let radlat2 = Math.PI * lat2 / 180;
      let theta = lon1 - lon2;
      let radtheta = Math.PI * theta / 180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "Mt") { dist = dist * 1.609344 * 1000 }
      if (unit == "N") { dist = dist * 0.8684 }
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

      let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
      difference -= daysDifference * 1000 * 60 * 60 * 24

      let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
      difference -= hoursDifference * 1000 * 60 * 60

      let minutesDifference = Math.floor(difference / 1000 / 60);
      difference -= minutesDifference * 1000 * 60

      let secondsDifference = Math.floor(difference / 1000);
      return (daysDifference + ' day ' + hoursDifference + ' hr ');

      // return ('difference = ' + daysDifference + ' day ' + hoursDifference + ' hour/s ' + minutesDifference + ' minute/s ' + secondsDifference + ' second/s ');      
    }
  }

  menuGenerator(menuType) {
    return this.dataService._menu[menuType].filter(menu => {
      if (menu.children && menu.children.length) {
        menu.children = menu.children.filter(childMenu => this.checkPagePresense(childMenu));
        return true;
      }
      return this.checkPagePresense(menu);
    });
  }


  checkPagePresense(menu) {
    let status = false;
    this.user._pages.map(page => (page.route == menu.link) && (status = true));
    return status;
  }
  
  getPDFFromTableId(tblEltId, left_heading, center_heading) {

    //remove table cols with del class
    let tblelt = document.getElementById(tblEltId);
    if(tblelt.nodeName != "TABLE") {
      tblelt = document.querySelector("#" + tblEltId + " table");
    }
    
    let hdg_coll = [];
    let hdgs = [];
    let hdgCols = tblelt.querySelectorAll('th');
    console.log("hdgcols:");
    console.log(hdgCols.length);
    if(hdgCols.length >= 1) {
      for(let i=0; i< hdgCols.length; i++) {
        if(hdgCols[i].classList.contains('del'))
          continue;
        let elthtml  = hdgCols[i].innerHTML;
        if(elthtml.indexOf('<input') > -1) {
          let eltinput = hdgCols[i].querySelector("input");
          let attrval = eltinput.getAttribute('placeholder');
          hdgs.push(attrval);
        } else if(elthtml.indexOf('<img') > -1)  {
          let eltinput = hdgCols[i].querySelector("img");
          let attrval = eltinput.getAttribute('title');
          hdgs.push(attrval);
        } else if(elthtml.indexOf('href') > -1)  {
          let strval = hdgCols[i].innerHTML;
          hdgs.push(strval);
        } else {
          let plainText = elthtml.replace(/<[^>]*>/g, '');
          console.log("hdgval:" + plainText);
          hdgs.push(plainText);
        }
      }
    }
    hdg_coll.push(hdgs);
    let rows = [];
    let tblrows = tblelt.querySelectorAll('tbody tr');
    if(tblrows.length >= 1) {
      for(let i=0; i < tblrows.length; i++) {
        if(tblrows[i].classList.contains('cls-hide'))
          continue;
        let rowCols = tblrows[i].querySelectorAll('td');
        let rowdata = [];
        for(let j=0; j< rowCols.length; j++) {
          if(rowCols[j].classList.contains('del'))
            continue;
          let colhtml = rowCols[j].innerHTML;
          if(colhtml.indexOf('input') > -1) {
            let eltinput = rowCols[j].querySelector("input");
            let attrval = eltinput.getAttribute('placeholder');
            rowdata.push(attrval);
          } else if(colhtml.indexOf('img') > -1)  {
            let eltinput = rowCols[j].querySelector("img");
            let attrval = eltinput.getAttribute('title');
            rowdata.push(attrval);
          } else if(colhtml.indexOf('href') > -1)  {
            let strval = rowCols[j].innerHTML;
            rowdata.push(strval);
          } else if(colhtml.indexOf('</i>') > -1) {
            let pattern = /<i.* title="([^"]+)/g;
            let match=pattern.exec(colhtml);
            if(match!=null && match.length)
              rowdata.push(match[1]);
          } else {
            let plainText = colhtml.replace(/<[^>]*>/g, '');
            rowdata.push(plainText);
          }          
        }
        rows.push(rowdata);
      }
    }

    let eltimg = document.createElement('img');
    eltimg.src = "assets/images/elogist.png";
    eltimg.alt = "logo";

    
    let pageOrientation = "Portrait";
    if(hdgCols.length > 7) {
      pageOrientation = "Landscape";
    }
    let doc = new jsPDF({
      orientation: pageOrientation,
      unit: 'px',
      format: 'a4'
    });
    
    var pageContent = function (data) {
      //header
      let x = 35;
      let y = 40;

      if(left_heading != "undefined" &&  center_heading != null && center_heading != '') {
        doc.setFontSize(14);
        doc.setFont("times", "bold");
        doc.text(left_heading, x, y);
      }
      let pageWidth= parseInt(doc.internal.pageSize.width);
      if(center_heading != "undefined" && center_heading != null && center_heading != '') {
        x=pageWidth / 2;
        y=40;
        doc.setFontSize(14);
        doc.text(center_heading, x - 50, y);
      }      
      y= 15;
      doc.addImage(eltimg, 'JPEG', (pageWidth - 110), 15, 50, 50, 'logo', 'NONE', 0);
      doc.setFontSize(12);

      doc.line(20, 70, pageWidth - 20, 70);

      // FOOTER
      var str = "Page " + data.pageCount;
      
      doc.setFontSize(10);
      doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
    };
    
    let tempLineBreak={fontSize: 10, cellPadding: 3, minCellHeight: 11, minCellWidth : 10, cellWidth: 40 };
    doc.autoTable({
        head: hdg_coll,
        body: rows,
        theme: 'grid',
        didDrawPage: pageContent,
        margin: {top: 80},
        headStyles: {
          fillColor: [98, 98, 98],
          fontSize: 10
        },
        styles: tempLineBreak,
        columnStyles: {text: {cellWidth: 40 }},
        
    });
    doc.save('report.pdf');
  }

  getCSVFromTableId(tblEltId) {
    let tblelt = document.getElementById(tblEltId);
    if(tblelt.nodeName != "TABLE") {
      tblelt = document.querySelector("#" + tblEltId + " table");
    }
    let info = [];
    let hdgs = {};
    let arr_hdgs = [];
    let hdgCols = tblelt.querySelectorAll('th');
    if(hdgCols.length >= 1) {
      for(let i=0; i< hdgCols.length; i++) {
        if(hdgCols[i].classList.contains('del'))
          continue;
        let elthtml  = hdgCols[i].innerHTML;
        if(elthtml.indexOf('<input') > -1) {
          let eltinput = hdgCols[i].querySelector("input");
          let attrval = eltinput.getAttribute('placeholder');
          hdgs[attrval] = attrval;
          arr_hdgs.push(attrval);
        } else if(elthtml.indexOf('<img') > -1)  {
          let eltinput = hdgCols[i].querySelector("img");
          let attrval = eltinput.getAttribute('title');
          hdgs[attrval] = attrval;
          arr_hdgs.push(attrval);
        } else if(elthtml.indexOf('href') > -1)  {
          let strval = hdgCols[i].innerHTML;
          hdgs[strval] = strval;
          arr_hdgs.push(strval);
        } else {
          let plainText = elthtml.replace(/<[^>]*>/g, '');
          hdgs[plainText]=plainText;
          arr_hdgs.push(plainText);
        }
      }
    }
    info.push(hdgs);
    
    let tblrows = tblelt.querySelectorAll('tbody tr');
    if(tblrows.length >= 1) {
      for(let i=0; i < tblrows.length; i++) {
        if(tblrows[i].classList.contains('cls-hide'))
          continue;
        let rowCols = tblrows[i].querySelectorAll('td');
        let rowdata = [];
        for(let j=0; j< rowCols.length; j++) {
          if(rowCols[j].classList.contains('del'))
            continue;
          let colhtml = rowCols[j].innerHTML;
          if(colhtml.indexOf('input') > -1) {
            let eltinput = rowCols[j].querySelector("input");
            let attrval = eltinput.getAttribute('placeholder');
            rowdata[arr_hdgs[j]]=attrval;
          } else if(colhtml.indexOf('img') > -1)  {
            let eltinput = rowCols[j].querySelector("img");
            let attrval = eltinput.getAttribute('title');
            rowdata[arr_hdgs[j]]=attrval;
          } else if(colhtml.indexOf('href') > -1)  {
            let strval = rowCols[j].innerHTML;
            rowdata[arr_hdgs[j]] = strval;
          } else if(colhtml.indexOf('</i>') > -1) {
            let pattern = /<i.* title="([^"]+)/g;
            let match=pattern.exec(colhtml);
            if(match!=null && match.length)
              rowdata[arr_hdgs[j]]=match[1];
          } else {
            let plainText = colhtml.replace(/<[^>]*>/g, '');
            rowdata[arr_hdgs[j]]=plainText;
          }          
        }
        info.push(rowdata);
      }
    }
    new Angular5Csv(info, "report.csv" );
  }
}
