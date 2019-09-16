import { Injectable } from "@angular/core";
import { NbToastStatus } from "@nebular/theme/components/toastr/model";
import {
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrService,
  NbThemeService
} from "@nebular/theme";
import { Router } from "@angular/router";
import { DatePipe, FormatWidth } from "@angular/common";
import { ApiService } from "./api.service";
import { DataService } from "./data.service";
import { UserService } from "./user.service";

import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import * as moment_ from "moment";
import { elementAt } from "rxjs/operators";
import { RouteGuard } from "../guards/route.guard";
const moment = moment_;
@Injectable({
  providedIn: "root"
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
  ref_page = null;
  openType = 'page';
  primaryType = {
    1: { page: "HomePage", title: "Home" },
    2: { page: "HomePage", title: "Home" },
    100: { page: "/ticket-details", title: "Ticket Details" },
    200: { page: "/pages/ticket-site-details", title: "Vehicle Halt" },
    201: { page: "VehicleHaltPage", title: "Change Vehicle Halt" },
    300: { page: "/pages/ticket-site-details", title: "Vehicle Halt" },
    301: { page: "VehicleHaltPage", title: "Change Site Halt" }
  };

  secondaryType = {
    201: {
      page: "VehicleHaltPage",
      btnTxt: "Change Halt",
      title: "Change Vehicle Halt"
    },
    301: {
      page: "VehicleHaltPage",
      btnTxt: "Change Halt",
      title: "Change Site Halt"
    }
  };

  pages = {
    100: { title: "Home", page: "HomePage" },
    200: { title: "Vehicle KPIs", page: "VehicleKpisPage" },
    201: { title: "KPI Details", page: "VehicleKpiDetailsPage" }
  };

  currentPage = "";
  isComponentActive = false;
  constructor(
    public router: Router,
    private toastrService: NbToastrService,
    private theme: NbThemeService,
    public api: ApiService,
    public dataService: DataService,
    public user: UserService,
    private datePipe: DatePipe,
  ) { }

  showError(msg?, err?) {
    let message = msg || 'Something went wrong! try again.';
    message += err ? ' Error Code: ' + err.status : '';
    this.showToast(message, "danger");
    //alert(message);
  }

  ucWords(str) {
    str = str.toLowerCase();
    var words = str.split(' ');
    str = '';
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      word = word.charAt(0).toUpperCase() + word.slice(1);
      if (i > 0) { str = str + ' '; }
      str = str + word;
    }
    return str;
  }

  showToast(body, type?, duration?, title?) {
    // toastTypes = ["success", "info", "warning", "primary", "danger", "default"]
    const config = {
      status: type || "success",
      destroyByClick: true,
      duration: duration || 5000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false
    };

    //alert(body);
    this.toastrService.show(body, title || "Alert", config);
  }

  handleApiResponce(res) {
    if ([52, 53, 54].indexOf(res.code) !== -1) {
      return false;
    }
    return true;
  }

  findRemainingTime(time) {
    if (time > 59) {
      let minutes = Math.floor(time / 60);
      return minutes + " mins";
    } else if (time > 44) {
      return "45 secs";
    } else if (time > 29) {
      return "30 secs";
    } else if (time > 14) {
      return "15 secs";
    } else {
      return "0 sec";
    }
  }

  renderPage(priType, secType1, secType2, data?) {
    // console.log("Data: ", data);
    let page = this.primaryType[priType];
    this.params = {
      data: data,
      secType1: secType1,
      secType2: secType2,
      title: page.title
    };
    this.router.navigate([page.page]);
  }

  dateFormatter(date, type = "YYYYMMDD", isTime = true, separator = "-"):any {
    let d = new Date(date);
    let year = d.getFullYear();
    let month = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
    let dat = d.getDate() < 9 ? "0" + d.getDate() : d.getDate();

    // console.log(dat + separator + month + separator + year);
    if (type == "ddMMYYYY") {
      return (
        year +
        separator +
        month +
        separator +
        dat +
        (isTime ? " " + this.timeFormatter(date) : "")
      );
    } else {
      return (
        year +
        separator +
        month +
        separator +
        dat +
        (isTime ? " " + this.timeFormatter(date) : "")
      );
    }
  }

  dateFormatternew(date, type = "YYYYMMDD", isTime = true, separator = "-") {
    let d = new Date(date);
    let year = d.getFullYear();
    let month = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
    let dat = d.getDate() < 9 ? "0" + d.getDate() : d.getDate();

    // console.log(dat + separator + month + separator + year);
    if (type == "ddMMYYYY") {
      return (
        dat +
        separator +
        month +
        separator +
        year

      );
    } else {
      return (
        dat +
        separator +
        month +
        separator +
        year

      );
    }
  }

  dateFormatter1(date) {
    let d = new Date(date);
    let year = d.getFullYear();
    let month = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
    let dat = d.getDate() <= 9 ? "0" + d.getDate() : d.getDate();

    console.log(year + "-" + month + "-" + dat);

    //return dat + "-" + month + "-" + year;
    return year + "-" + month + "-" + dat;
  }
  dateFormatter2(date) {
    let d = new Date(date);
    let year = d.getFullYear();
    let month = d.getMonth() <= 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
    let dat = d.getDate() <= 9 ? "0" + d.getDate() : d.getDate();

    console.log(year + "-" + month + "-" + dat);

    // return dat + "-" + month + "-" + year;
    return { send: year + "-" + month + "-" + dat, view: dat + "-" + month + "-" + year };
  }

  changeDateformat(date) {
    let d = new Date(date);
    return this.datePipe.transform(date, "dd-MMM-yyyy hh:mm a");
  }

  changeDateformat2(date) {
    let d = new Date(date);
    return this.datePipe.transform(date, "dd-MMM HH:mm");
  }

  changeDateformat1(date) {
    let d = new Date(date);
    return this.datePipe.transform(date, "dd-MMM-yyyy");
  }
  changeDateformat3(date) {
    let d = new Date(date);
    return this.datePipe.transform(date, "dd");
  }
  changeTimeformat(time) {
    let hours = Math.trunc(time / 60);
    let minutes = time % 60;
    return hours + ":" + minutes;
  }
  changeMonthformat(date, type) {
    let d = new Date(date);
    return this.datePipe.transform(date, type);
  }
  timeFormatter(date) {
    let d = new Date(date);
    let hours = d.getHours() <= 9 ? "0" + d.getHours() : d.getHours();
    let minutes = d.getMinutes() <= 9 ? "0" + d.getMinutes() : d.getMinutes();
    let seconds = d.getSeconds() <= 9 ? "0" + d.getSeconds() : d.getSeconds();

    return hours + ":" + minutes + ":" + seconds;
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
      datasets: [
        {
          data: data,
          backgroundColor: colors
        }
      ]
    };

    let chartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: [
          {
            display: false
          }
        ],
        yAxes: [
          {
            display: false
          }
        ]
      },
      legend: false
    };

    // setTimeout(() => {
    //   console.log(document.getElementsByTagName("canvas")[0]);
    //   document.getElementsByTagName("canvas")[0].style.width = "80px";
    //   document.getElementsByTagName("canvas")[0].style.height = "180px";
    // }, 10);

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

  handleModalSize(type, name, size, sizeType = "px", position = 0) {
    setTimeout(() => {
      if (type == "class" && document.getElementsByClassName(name)[position]) {
        if (document.getElementsByClassName(name)[position]["style"]) {
          document.getElementsByClassName(name)[position]["style"].maxWidth =
            size + sizeType;
        }
      }
    }, 10);
  }
  handleModalheight(type, name, size, sizeType = "px", position = 0) {
    setTimeout(() => {
      if (type == "class") {
        document.getElementsByClassName(name)[position]["style"].minHeight =
          size + sizeType;
      }
    }, 10);
  }

  handleModalHeightWidth(
    type,
    name,
    height,
    width,
    sizeType = "px",
    position = 0
  ) {
    setTimeout(() => {
      if (type == "class") {
        document.getElementsByClassName(name)[position]["style"].maxHeight =
          height + sizeType;
        document.getElementsByClassName(name)[position]["style"].maxWidth =
          width + sizeType;
      }

    }, 10);
  }

  apiErrorHandler(err, hideLoading, showError, msg?) {
    console.error("Api Error: ", err);
    hideLoading && this.loading--;
    showError && this.showError(msg);
  }

  reportAnIssue(issue, refId) {
    const params = {
      issueTypeId: issue.type,
      refId: refId,
      remark: issue.remark
    };
    console.info("Params: ", params);
    this.loading++;
    this.api.post("InformationIssue/insertIssueRequest", params).subscribe(
      res => {
        this.loading--;
        console.info("Res: ", res);
        this.showToast(res["msg"]);
      },
      err => this.apiErrorHandler(err, true, true)
    );
  }

  generateArray(length) {
    let generatedArray = [];
    for (let i = 0; i < length; i++) {
      generatedArray.push(i + 1);
    }
    return generatedArray;
  }

  dateDiffInHours(startTime, endTime, fromNow = false) {
    if (!startTime || (!endTime && !fromNow)) {
      return 0;
    }
    startTime = new Date(startTime);
    endTime = (fromNow && !endTime) ? new Date(new Date().toUTCString()) : new Date(endTime);
    let hours = Math.abs(endTime - startTime) / 36e5;
    return hours;
  }

  dateDiffInHoursAndMins(startTime, endTime) {
    if (startTime == null) {
      return '0';
    }
    if (endTime == null) {
      return '-1'
    }
    let result;
    startTime = new Date(startTime);
    endTime = new Date(endTime);
    let day = parseInt(moment.utc(moment(endTime, "DD/MM/YYYY HH:mm:ss").diff(moment(startTime, "DD/MM/YYYY HH:mm:ss"))).format("DD"));
    day = day - 1;
    let hrs = moment.utc(moment(endTime, "DD/MM/YYYY HH:mm:ss").diff(moment(startTime, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm");
    if (day > 0) {
      result = "" + day + "D " + hrs;
    }
    else {
      result = "" + hrs;
    }

    //result = Math.floor(d.asHours()) + moment.utc(ms).format(":mm");

    // outputs: "48:39:30"
    // let resultTime = endTime - startTime;
    //  result=moment.utc(resultTime).format('DD HH:mm');
    // console.log('moment',startTime,endTime,result );

    // //console.log('begore resultTime: ' + resultTime);
    // // if(this.resultTime>0){
    //   let sec = (resultTime / 1000);
    //   let hour=parseInt(''+sec/3600);
    //   let tmin=sec%3600;
    //   let min=parseInt(''+tmin/60);
    //   sec=tmin%60;
    // if (hour != 0) {
    //   if (hour.toString().length == 1) {
    //     result = '0' + hour + '.';
    //     // this.resultTime=this.h;
    //   } else
    //      result = hour + '.';

    //   if (min != 0) {
    //     if (min.toString().length == 1) {
    //       result += '0' + min;
    //     } else
    //     result += min;
    //   } else
    //     result += '00';
    // }
    // console.log(startTime,endTime,result);
    return result;
  }

  distanceFromAToB(lat1, lon1, lat2, lon2, unit) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      let radlat1 = (Math.PI * lat1) / 180;
      let radlat2 = (Math.PI * lat2) / 180;
      let theta = lon1 - lon2;
      let radtheta = (Math.PI * theta) / 180;
      let dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      }
      if (unit == "Mt") {
        dist = dist * 1.609344 * 1000;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      return parseInt(dist.toFixed(0));
    }
  }

  differenceBtwT1AndT2(date1, date2) {
    if (date1 == date2) {
      return 0;
    } else {
      date1 = new Date(date1);
      date2 = new Date(date2);
      let difference = date1.getTime() - date2.getTime();

      let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
      difference -= daysDifference * 1000 * 60 * 60 * 24;

      let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
      difference -= hoursDifference * 1000 * 60 * 60;

      let minutesDifference = Math.floor(difference / 1000 / 60);
      difference -= minutesDifference * 1000 * 60;

      let secondsDifference = Math.floor(difference / 1000);
      return daysDifference + " day " + hoursDifference + " hr ";

      // return ('difference = ' + daysDifference + ' day ' + hoursDifference + ' hour/s ' + minutesDifference + ' minute/s ' + secondsDifference + ' second/s ');
    }
  }

  menuGenerator(menuType) {
    return this.dataService._menu[menuType].filter(menu => {
      if (menu.children && menu.children.length) {
        menu.children = menu.children.filter(childMenu =>
          this.checkPagePresense(childMenu)
        );
        return true;
      }
      return this.checkPagePresense(menu);
    });
  }

  checkPagePresense(menu) {
    let status = false;
    this.user._pages.map(page => page.route == menu.link && (status = true));
    return status;
  }

  getPDFFromTableId(tblEltId, left_heading?, center_heading?, doNotIncludes?, time?, lower_left_heading?) {
    // console.log("Action Data:", doNotIncludes); return;
    //remove table cols with del class
    let tblelt = document.getElementById(tblEltId);
    if (tblelt.nodeName != "TABLE") {
      tblelt = document.querySelector("#" + tblEltId + " table");
    }

    let hdg_coll = [];
    let hdgs = [];
    let hdgCols = tblelt.querySelectorAll("th");
    console.log("hdgcols:", hdgCols);
    // console.log(hdgCols.length);
    if (hdgCols.length >= 1) {
      for (let i = 0; i < hdgCols.length; i++) {
        let isBreak = false;
        for (const donotInclude in doNotIncludes) {
          if (doNotIncludes.hasOwnProperty(donotInclude)) {
            const thisNotInclude = doNotIncludes[donotInclude];
            if (hdgCols[i].innerHTML.toLowerCase().includes("title=\"" + thisNotInclude.toLowerCase() + "\"")) {
              isBreak = true;
              break;
            }
          }
        }
        if (isBreak)
          continue;
        if (hdgCols[i].innerHTML.toLowerCase().includes(">image<"))
          continue;
        if (hdgCols[i].classList.contains('del'))
          continue;
        let elthtml = hdgCols[i].innerHTML;
        if (elthtml.indexOf('<input') > -1) {
          let eltinput = hdgCols[i].querySelector("input");
          let attrval = eltinput.getAttribute("placeholder");
          hdgs.push(attrval);

        } else if (elthtml.indexOf('<img') > -1) {
          let eltinput = hdgCols[i].querySelector("img");
          let attrval = eltinput.getAttribute("title");


          hdgs.push(attrval);
        } else if (elthtml.indexOf('href') > -1) {
          let strval = hdgCols[i].innerHTML;
          hdgs.push(strval);
        } else {
          let plainText = elthtml.replace(/<[^>]*>/g, "");
          console.log("hdgval:" + plainText);
          hdgs.push(plainText);
        }
      }
    }
    hdg_coll.push(hdgs);
    let rows = [];
    let tblrows = tblelt.querySelectorAll('tbody tr');
    if (tblrows.length >= 1) {
      for (let i = 0; i < tblrows.length; i++) {
        if (tblrows[i].classList.contains('cls-hide'))
          continue;
        let rowCols = tblrows[i].querySelectorAll('td');
        let rowdata = [];
        for (let j = 0; j < rowCols.length; j++) {
          if (rowCols[j].classList.contains('del'))
            continue;
          let colhtml = rowCols[j].innerHTML;
          if (colhtml.indexOf('input') > -1) {
            let eltinput = rowCols[j].querySelector("input");
            let attrval = eltinput.getAttribute("placeholder");
            rowdata.push(attrval);

          } else if (colhtml.indexOf('img') > -1) {
            let eltinput = rowCols[j].querySelector("img");
            let attrval = eltinput && eltinput.getAttribute("title");
            rowdata.push(attrval);
          } else if (colhtml.indexOf('href') > -1) {
            let strval = rowCols[j].innerHTML;
            rowdata.push(strval);
          } else if (colhtml.indexOf('</i>') > -1) {
            let pattern = /<i.* title="([^"]+)/g;
            let match = pattern.exec(colhtml);
            if (match != null && match.length)
              rowdata.push(match[1]);
          } else {
            let plainText = colhtml.replace(/<[^>]*>/g, "");
            rowdata.push(plainText);
          }
        }
        rows.push(rowdata);
      }
    }

    let eltimg = document.createElement("img");
    eltimg.src = "assets/images/elogist.png";
    eltimg.alt = "logo";

    let pageOrientation = "Portrait";
    if (hdgCols.length > 7) {
      pageOrientation = "Landscape";
    }
    let doc = new jsPDF({
      orientation: pageOrientation,
      unit: "px",
      format: "a4"
    });

    var pageContent = function (data) {
      //header
      let x = 35;
      let y = 40;

      //if(left_heading != "undefined" &&  center_heading != null && center_heading != '') {

      doc.setFontSize(14);
      doc.setFont("times", "bold");
      doc.text("elogist Solutions ", x, y);

      //}
      let pageWidth = parseInt(doc.internal.pageSize.width);
      if (left_heading != "undefined" && left_heading != null && left_heading != '') {
        x = pageWidth / 2;
        let hdglen = left_heading.length / 2;
        let xpos = x - hdglen - 50;
        y = 40;
        doc.setFont("times", "bold", "text-center");
        doc.text(left_heading, xpos, y);
      }
      if (center_heading != "undefined" && center_heading != null && center_heading != '') {
        x = pageWidth / 2;
        y = 50;
        let hdglen = center_heading.length / 2;
        doc.setFontSize(14);
        doc.setFont("times", "bold", "text-center");
        doc.text(center_heading, x - hdglen - 50, y);
      }
      if (lower_left_heading != "undefined" && lower_left_heading != null && lower_left_heading != '') {
        let xpos = 35;
        y = 65;
        doc.setFont("times", "bold", "text-center");
        doc.text(lower_left_heading, xpos, y);
      }
      doc.text(time, 30, 60);
      y = 15;
      doc.addImage(eltimg, 'JPEG', (pageWidth - 110), 15, 50, 50, 'logo', 'NONE', 0);
      doc.setFontSize(12);

      doc.line(20, 70, pageWidth - 20, 70);

      // FOOTER
      var str = "Page " + data.pageCount;

      doc.setFontSize(10);
      doc.text(
        str,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    };


    let tempLineBreak = { fontSize: 10, cellPadding: 3, minCellHeight: 11, minCellWidth: 10, cellWidth: 40, valign: 'middle', halign: 'center' };
    doc.autoTable({
      head: hdg_coll,
      body: rows,
      theme: 'grid',
      didDrawPage: pageContent,
      margin: { top: 80 },
      rowPageBreak: 'avoid',
      headStyles: {
        fillColor: [98, 98, 98],
        fontSize: 10,
        halign: 'center',
        valign: 'middle'

      },
      styles: tempLineBreak,
      columnStyles: { text: { cellWidth: 40, halign: 'center', valign: 'middle' } },

    });


    doc.save("report.pdf");
  }

  getPDFFromTableIdnew(tblEltId, left_heading?, center_heading?, doNotIncludes?, time?, reportname?) {
    console.log("Action Data:", reportname);
    //remove table cols with del class
    let tblelt = document.getElementById(tblEltId);
    if (tblelt.nodeName != "TABLE") {
      tblelt = document.querySelector("#" + tblEltId + " table");
    }

    let hdg_coll = [];
    let hdgs = [];
    let hdgCols = tblelt.querySelectorAll("th");
    console.log("hdgcols:", hdgCols);
    // console.log(hdgCols.length);
    if (hdgCols.length >= 1) {
      for (let i = 0; i < hdgCols.length; i++) {
        let isBreak = false;
        for (const donotInclude in doNotIncludes) {
          if (doNotIncludes.hasOwnProperty(donotInclude)) {
            const thisNotInclude = doNotIncludes[donotInclude];
            if (hdgCols[i].innerHTML.toLowerCase().includes("title=\"" + thisNotInclude.toLowerCase() + "\"")) {
              isBreak = true;
              break;
            }
          }
        }
        if (isBreak)
          continue;
        if (hdgCols[i].innerHTML.toLowerCase().includes(">image<"))
          continue;
        if (hdgCols[i].classList.contains('del'))
          continue;
        let elthtml = hdgCols[i].innerHTML;
        if (elthtml.indexOf('<input') > -1) {
          let eltinput = hdgCols[i].querySelector("input");
          let attrval = eltinput.getAttribute("placeholder");
          hdgs.push(attrval);

        } else if (elthtml.indexOf('<img') > -1) {
          let eltinput = hdgCols[i].querySelector("img");
          let attrval = eltinput.getAttribute("title");


          hdgs.push(attrval);
        } else if (elthtml.indexOf('href') > -1) {
          let strval = hdgCols[i].innerHTML;
          hdgs.push(strval);
        } else {
          let plainText = elthtml.replace(/<[^>]*>/g, "");
          console.log("hdgval:" + plainText);
          hdgs.push(plainText);
        }
      }
    }
    hdg_coll.push(hdgs);
    let rows = [];
    let tblrows = tblelt.querySelectorAll('tbody tr');
    if (tblrows.length >= 1) {
      for (let i = 0; i < tblrows.length; i++) {
        if (tblrows[i].classList.contains('cls-hide'))
          continue;
        let rowCols = tblrows[i].querySelectorAll('td');
        let rowdata = [];
        for (let j = 0; j < rowCols.length; j++) {
          if (rowCols[j].classList.contains('del'))
            continue;
          let colhtml = rowCols[j].innerHTML;
          if (colhtml.indexOf('input') > -1) {
            let eltinput = rowCols[j].querySelector("input");
            let attrval = eltinput.getAttribute("placeholder");
            rowdata.push(attrval);

          } else if (colhtml.indexOf('img') > -1) {
            let eltinput = rowCols[j].querySelector("img");
            let attrval = eltinput && eltinput.getAttribute("title");
            rowdata.push(attrval);
          } else if (colhtml.indexOf('href') > -1) {
            let strval = rowCols[j].innerHTML;
            rowdata.push(strval);
          } else if (colhtml.indexOf('</i>') > -1) {
            let pattern = /<i.* title="([^"]+)/g;
            let match = pattern.exec(colhtml);
            if (match != null && match.length)
              rowdata.push(match[1]);
          } else {
            let plainText = colhtml.replace(/<[^>]*>/g, "");
            rowdata.push(plainText);
          }
        }
        rows.push(rowdata);
      }
    }

    let eltimg = document.createElement("img");
    eltimg.src = "assets/images/elogist.png";
    eltimg.alt = "logo";

    let pageOrientation = "Portrait";
    if (hdgCols.length > 7) {
      pageOrientation = "Landscape";
    }
    let doc = new jsPDF({
      orientation: pageOrientation,
      unit: "px",
      format: "a4"
    });

    var pageContent = (data) => {
      //header
      let x = 35;
      let y = 40;

      //if(left_heading != "undefined" &&  center_heading != null && center_heading != '') {

      doc.setFontSize(14);
      doc.setFont("times", "bold");
      //  doc.text("elogist Solutions ", x, y);

      //}
      let pageWidth = parseInt(doc.internal.pageSize.width);
      if (reportname != "undefined" && reportname != null && reportname != '') {
        x = pageWidth / 2;
        let hdglen = reportname.length / 2;
        let xpos = x - hdglen - 180;
        y = 68;
        doc.setFontSize(8);
        doc.setFont("Times New Roman", "text-left");
        doc.text(reportname, xpos, y);
      }
      if (left_heading != "undefined" && left_heading != null && left_heading != '') {
        x = pageWidth / 2;
        let hdglen = left_heading.length / 2;
        let xpos = x - hdglen - 50;
        y = 40;
        doc.setFont("times", "bold", "text-center");
        doc.text(left_heading, xpos, y);
      }
      if (center_heading != "undefined" && center_heading != null && center_heading != '') {
        x = pageWidth / 2;
        y = 50;
        let hdglen = center_heading.length / 2;
        doc.setFontSize(14);
        doc.setFont("times", "text-center");
        doc.text(center_heading, x - hdglen - 70, y);
      }
      doc.text(time, 30, 60);
      y = 15;
      // doc.addImage(eltimg, 'JPEG', (pageWidth - 400), 15, 50, 50, 'logo', 'NONE', 0);
      doc.setFontSize(12);

      doc.line(20, 70, pageWidth - 20, 70);

      // FOOTER
      let printDate = this.dateFormatternew(new Date(), 'ddMMYYYY', false, '-');
      var powerdata = 'Powered By Elogist Solution';
      var str = powerdata + '                                                 Print On : ' + printDate + '                                                                      ' + "Page " + data.pageCount;

      doc.setFontSize(10);
      doc.text(
        str,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    };


    let tempLineBreak = { fontSize: 10, cellPadding: 3, minCellHeight: 11, minCellWidth: 10, cellWidth: 40, valign: 'middle', halign: 'center' };
    doc.autoTable({
      head: hdg_coll,
      body: rows,
      theme: 'grid',
      didDrawPage: pageContent,
      margin: { top: 80 },
      rowPageBreak: 'avoid',
      headStyles: {
        fillColor: [98, 98, 98],
        fontSize: 10,
        halign: 'center',
        valign: 'middle'

      },
      styles: tempLineBreak,
      columnStyles: { text: { cellWidth: 40, halign: 'center', valign: 'middle' } },

    });


    doc.save("report.pdf");
  }

  downloadPdf(divId, isLandscape?) {
    var data = document.getElementById(divId);
    // console.log("data",data);
    html2canvas(data, {
      useCORS: true,
    }).then(canvas => {
      // Few necessary setting options  
      var imgWidth = isLandscape ? 295 : 208;
      var pageHeight = isLandscape ? 208 : 295;
      let imgHeight = isLandscape ? 208 : 295;
      // var imgHeight = canvas.height * imgWidth / canvas.width;
      console.log('height:', imgHeight);
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF(isLandscape ? 'l' : 'p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('MYPdf.pdf'); // Generated PDF   
    });
  }

  getCSVFromTableId(tblEltId, left_heading?, center_heading?, doNotIncludes?, time?, lower_left_heading?) {
    let tblelt = document.getElementById(tblEltId);
    if (tblelt.nodeName != "TABLE") {
      tblelt = document.querySelector("#" + tblEltId + " table");
    }

    let organization = { "elogist Solutions": "elogist Solutions" };
    let blankline = { "": "" };

    let leftData = { left_heading };
    let centerData = { center_heading };
    let lowerLeft = lower_left_heading ? { lower_left_heading } : {};
    let doctime = { time };

    let info = []; lower_left_heading
    let hdgs = {};
    let arr_hdgs = [];
    info.push(organization);
    info.push(blankline);
    info.push(leftData);
    info.push(centerData, doctime);
    info.push(lowerLeft);
    let hdgCols = tblelt.querySelectorAll('th');
    if (hdgCols.length >= 1) {
      for (let i = 0; i < hdgCols.length; i++) {
        let isBreak = false;
        for (const donotInclude in doNotIncludes) {
          if (doNotIncludes.hasOwnProperty(donotInclude)) {
            const thisNotInclude = doNotIncludes[donotInclude];
            if (hdgCols[i].innerHTML.toLowerCase().includes("title=\"" + thisNotInclude.toLowerCase() + "\"")) {
              isBreak = true;
              break;
            }
          }
        }
        if (isBreak)
          continue;


        if (hdgCols[i].innerHTML.toLowerCase().includes(">image<"))
          continue;
        if (hdgCols[i].classList.contains('del'))
          continue;
        let elthtml = hdgCols[i].innerHTML;
        if (elthtml.indexOf('<input') > -1) {
          let eltinput = hdgCols[i].querySelector("input");
          let attrval = eltinput.getAttribute("placeholder");
          hdgs[attrval] = attrval;
          arr_hdgs.push(attrval);
        } else if (elthtml.indexOf('<img') > -1) {
          let eltinput = hdgCols[i].querySelector("img");
          let attrval = eltinput.getAttribute("title");
          hdgs[attrval] = attrval;
          arr_hdgs.push(attrval);
        } else if (elthtml.indexOf('href') > -1) {
          let strval = hdgCols[i].innerHTML;
          hdgs[strval] = strval;
          arr_hdgs.push(strval);
        } else {
          let plainText = elthtml.replace(/<[^>]*>/g, '');
          hdgs[plainText] = plainText;
          arr_hdgs.push(plainText);
        }
      }
    }
    info.push(hdgs);

    let tblrows = tblelt.querySelectorAll('tbody tr');
    if (tblrows.length >= 1) {
      for (let i = 0; i < tblrows.length; i++) {
        if (tblrows[i].classList.contains('cls-hide'))
          continue;
        let rowCols = tblrows[i].querySelectorAll('td');
        let rowdata = [];
        for (let j = 0; j < rowCols.length; j++) {
          if (rowCols[j].classList.contains('del'))
            continue;
          let colhtml = rowCols[j].innerHTML;
          if (colhtml.indexOf('input') > -1) {
            let eltinput = rowCols[j].querySelector("input");
            let attrval = eltinput.getAttribute('placeholder');
            rowdata[arr_hdgs[j]] = attrval;
          } else if (colhtml.indexOf('img') > -1) {
            let eltinput = rowCols[j].querySelector("img");
            let attrval = eltinput && eltinput.getAttribute('title');
            rowdata[arr_hdgs[j]] = attrval;
          } else if (colhtml.indexOf('href') > -1) {
            let strval = rowCols[j].innerHTML;
            rowdata[arr_hdgs[j]] = strval;
          } else if (colhtml.indexOf('</i>') > -1) {
            let pattern = /<i.* title="([^"]+)/g;
            let match = pattern.exec(colhtml);
            if (match != null && match.length)
              rowdata[arr_hdgs[j]] = match[1];
          } else {
            let plainText = colhtml.replace(/<[^>]*>/g, '');
            rowdata[arr_hdgs[j]] = plainText;
          }
        }
        info.push(rowdata);
      }
    }
    new Angular5Csv(info, "report.csv");
  }

  getCSVFromTableIdNew(tblEltId, left_heading?, center_heading?, doNotIncludes?, time?, lastheading?) {
    let tblelt = document.getElementById(tblEltId);
    if (tblelt.nodeName != "TABLE") {
      tblelt = document.querySelector("#" + tblEltId + " table");
    }

    let organization = { "elogist Solutions": "elogist Solutions" };
    let blankline = { "": "" };

    let leftData = { '': '', left_heading };
    let centerData = { '': '', center_heading };
    let doctime = { time };
    let last = { '': '', lastheading };

    let info = [];
    let hdgs = {};
    let arr_hdgs = [];
    // info.push(organization);
    //info.push(blankline);
    info.push(leftData);
    info.push(centerData);
    info.push(last);
    let hdgCols = tblelt.querySelectorAll('th');
    if (hdgCols.length >= 1) {
      for (let i = 0; i < hdgCols.length; i++) {
        let isBreak = false;
        for (const donotInclude in doNotIncludes) {
          if (doNotIncludes.hasOwnProperty(donotInclude)) {
            const thisNotInclude = doNotIncludes[donotInclude];
            if (hdgCols[i].innerHTML.toLowerCase().includes("title=\"" + thisNotInclude.toLowerCase() + "\"")) {
              isBreak = true;
              break;
            }
          }
        }
        if (isBreak)
          continue;


        if (hdgCols[i].innerHTML.toLowerCase().includes(">image<"))
          continue;
        if (hdgCols[i].classList.contains('del'))
          continue;
        let elthtml = hdgCols[i].innerHTML;
        if (elthtml.indexOf('<input') > -1) {
          let eltinput = hdgCols[i].querySelector("input");
          let attrval = eltinput.getAttribute("placeholder");
          hdgs[attrval] = attrval;
          arr_hdgs.push(attrval);
        } else if (elthtml.indexOf('<img') > -1) {
          let eltinput = hdgCols[i].querySelector("img");
          let attrval = eltinput.getAttribute("title");
          hdgs[attrval] = attrval;
          arr_hdgs.push(attrval);
        } else if (elthtml.indexOf('href') > -1) {
          let strval = hdgCols[i].innerHTML;
          hdgs[strval] = strval;
          arr_hdgs.push(strval);
        } else {
          let plainText = elthtml.replace(/<[^>]*>/g, '');
          hdgs[plainText] = plainText;
          arr_hdgs.push(plainText);
        }
      }
    }
    info.push(hdgs);

    let tblrows = tblelt.querySelectorAll('tbody tr');
    if (tblrows.length >= 1) {
      for (let i = 0; i < tblrows.length; i++) {
        if (tblrows[i].classList.contains('cls-hide'))
          continue;
        let rowCols = tblrows[i].querySelectorAll('td');
        let rowdata = [];
        for (let j = 0; j < rowCols.length; j++) {
          if (rowCols[j].classList.contains('del'))
            continue;
          let colhtml = rowCols[j].innerHTML;
          if (colhtml.indexOf('input') > -1) {
            let eltinput = rowCols[j].querySelector("input");
            let attrval = eltinput.getAttribute('placeholder');
            rowdata[arr_hdgs[j]] = attrval;
          } else if (colhtml.indexOf('img') > -1) {
            let eltinput = rowCols[j].querySelector("img");
            let attrval = eltinput && eltinput.getAttribute('title');
            rowdata[arr_hdgs[j]] = attrval;
          } else if (colhtml.indexOf('href') > -1) {
            let strval = rowCols[j].innerHTML;
            rowdata[arr_hdgs[j]] = strval;
          } else if (colhtml.indexOf('</i>') > -1) {
            let pattern = /<i.* title="([^"]+)/g;
            let match = pattern.exec(colhtml);
            if (match != null && match.length)
              rowdata[arr_hdgs[j]] = match[1];
          } else {
            let plainText = colhtml.replace(/<[^>]*>/g, '');
            rowdata[arr_hdgs[j]] = plainText;
          }
        }
        info.push(rowdata);
      }
    }
    new Angular5Csv(info, "report.csv");
  }

  getMultipleCSVFromTableIdNew(tblArray, left_heading?, center_heading?, doNotIncludes?, time?, lastheading?) {
    let tblEltId = '';
    tblArray.forEach(tblid => {
      tblEltId = tblid;

      let tblelt = document.getElementById(tblEltId);
      if (tblelt.nodeName != "TABLE") {
        tblelt = document.querySelector("#" + tblEltId + " table");
      }

      let organization = { "elogist Solutions": "elogist Solutions" };
      let blankline = { "": "" };

      let leftData = { '': '', left_heading };
      let centerData = { '': '', center_heading };
      let doctime = { time };
      let last = { '': '', lastheading };

      let info = [];
      let hdgs = {};
      let arr_hdgs = [];
      // info.push(organization);
      //info.push(blankline);
      info.push(leftData);
      info.push(centerData);
      info.push(last);
      let hdgCols = tblelt.querySelectorAll('th');
      if (hdgCols.length >= 1) {
        for (let i = 0; i < hdgCols.length; i++) {
          let isBreak = false;
          for (const donotInclude in doNotIncludes) {
            if (doNotIncludes.hasOwnProperty(donotInclude)) {
              const thisNotInclude = doNotIncludes[donotInclude];
              if (hdgCols[i].innerHTML.toLowerCase().includes("title=\"" + thisNotInclude.toLowerCase() + "\"")) {
                isBreak = true;
                break;
              }
            }
          }
          if (isBreak)
            continue;


          if (hdgCols[i].innerHTML.toLowerCase().includes(">image<"))
            continue;
          if (hdgCols[i].classList.contains('del'))
            continue;
          let elthtml = hdgCols[i].innerHTML;
          if (elthtml.indexOf('<input') > -1) {
            let eltinput = hdgCols[i].querySelector("input");
            let attrval = eltinput.getAttribute("placeholder");
            hdgs[attrval] = attrval;
            arr_hdgs.push(attrval);
          } else if (elthtml.indexOf('<img') > -1) {
            let eltinput = hdgCols[i].querySelector("img");
            let attrval = eltinput.getAttribute("title");
            hdgs[attrval] = attrval;
            arr_hdgs.push(attrval);
          } else if (elthtml.indexOf('href') > -1) {
            let strval = hdgCols[i].innerHTML;
            hdgs[strval] = strval;
            arr_hdgs.push(strval);
          } else {
            let plainText = elthtml.replace(/<[^>]*>/g, '');
            hdgs[plainText] = plainText;
            arr_hdgs.push(plainText);
          }
        }
      }
      info.push(hdgs);

      let tblrows = tblelt.querySelectorAll('tbody tr');
      if (tblrows.length >= 1) {
        for (let i = 0; i < tblrows.length; i++) {
          if (tblrows[i].classList.contains('cls-hide'))
            continue;
          let rowCols = tblrows[i].querySelectorAll('td');
          let rowdata = [];
          for (let j = 0; j < rowCols.length; j++) {
            if (rowCols[j].classList.contains('del'))
              continue;
            let colhtml = rowCols[j].innerHTML;
            if (colhtml.indexOf('input') > -1) {
              let eltinput = rowCols[j].querySelector("input");
              let attrval = eltinput.getAttribute('placeholder');
              rowdata[arr_hdgs[j]] = attrval;
            } else if (colhtml.indexOf('img') > -1) {
              let eltinput = rowCols[j].querySelector("img");
              let attrval = eltinput && eltinput.getAttribute('title');
              rowdata[arr_hdgs[j]] = attrval;
            } else if (colhtml.indexOf('href') > -1) {
              let strval = rowCols[j].innerHTML;
              rowdata[arr_hdgs[j]] = strval;
            } else if (colhtml.indexOf('</i>') > -1) {
              let pattern = /<i.* title="([^"]+)/g;
              let match = pattern.exec(colhtml);
              if (match != null && match.length)
                rowdata[arr_hdgs[j]] = match[1];
            } else {
              let plainText = colhtml.replace(/<[^>]*>/g, '');
              rowdata[arr_hdgs[j]] = plainText;
            }
          }
          info.push(rowdata);
        }
      }
      new Angular5Csv(info, "report.csv");
    });
  }
  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  stopScroll() {
    document.getElementsByClassName('scrollable-container')[0].className +=
      ' stop-scroll';
  }


  handleDateOnEnterNew(datedate) {
    let dateArray = [];
    let separator = '-';
    if (datedate.includes('-')) {
      dateArray = datedate.split('-');
    } else if (datedate.includes('/')) {
      dateArray = datedate.split('/');
      separator = '/';
    } else {
      this.showError('Invalid Date Format!');
      return;
    }

    let month = dateArray[1];
    month = month.length == 1 ? '0' + month : month;
    month = (month > 12) ? 12 : month;
    let year = dateArray[2];
    year = year.length == 1 ? '200' + year : year.length == 2 ? '20' + year : year;
    let date = dateArray[0];
    date = date.length == 1 ? '0' + date : date;
    date = (date > 31) ? 31 : date;
    date = (((month == '04') || (month == '06') || (month == '09') || (month == '11')) && (date > 30)) ? 30 : date;
    date = ((date == 28) && (month == '02')) ? 28 : date;
    if (year % 4 == 0 && (month == '02')) {
      date = (((date > 28) && (month == '02')) && ((year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0)))) ? 29 : date;

    }
    else if (year % 4 != 0 && (month == '02')) {
      date = 28;
    } // date  = ((date > 28) && (month == '02')) ? 28 : date ;
    // console.log('Date: ', year + separator + month + separator + date);
    return date + separator + month + separator + year;
  }

  continuoueScroll() {
    document.getElementsByClassName(
      'scrollable-container'
    )[0].className = document
      .getElementsByClassName('scrollable-container')[0]
      .className.split(' ')[0];
  }


  //-----------------------trip Status Area ---------------------------
  getJSONTripStatusHTML(kpi) {
    return this.getTripStatusHTML(kpi._status, kpi._origin, kpi._destination, kpi._placement_types, kpi._placements)
  }

  getTripStatusHTML(x_status, x_origin, x_destination, x_placement_type, x_placements) {
    if (x_placement_type && x_placements && x_placements != null) {
      if (x_placements.indexOf('{') != -1) {
        x_placement_type = x_placement_type.substring(1, x_placement_type.length - 1);
        x_placements = x_placements.substring(1, x_placements.length - 1);
        x_placement_type = x_placement_type.split(',')
        x_placements = x_placements.split(',');
      }
    }
    else {
      x_placement_type = [];
      x_placements = [];
    }
    const colors = ['green', 'red', 'teal'];
    let html = '';
    switch (x_status) {
      case 0:
      case 11:
        html = `
            <!-- At Origin -->
            ${this.handleTripCircle(x_origin.trim(), 'loading')}
            ${x_destination ? `
              <span>-</span>
              <span class="unloading">${x_destination.trim()}</span>
            ` : !x_placements.length ? ` <i title="${x_origin.trim()} -> " class="icon ion-md-arrow-round-forward"></i> ` : ``}
            ${this.formatTripPlacement(x_placement_type, x_placements)}`;
        break;
      case 1:
      case 12:
        html = `
            <!-- At Destination -->
            <span class="loading">${x_origin.trim()}</span>
            ${x_destination ? `
              <span>-</span>
              ${this.handleTripCircle(x_destination.trim(), 'unloading')}
            ` : !x_placements.length ? `<i title="Hello World!!" class="icon ion-md-arrow-round-forward"></i>` : `<i title=""></i>`}
            ${this.formatTripPlacement(x_placement_type, x_placements)}`;
        break;
      case 2:
      case 13:
      case 14:
      case 51:
      case 52:
      case 53:
        html = `
            <!-- Onward -->
            <span class="loading">${x_origin.trim()}</span>
            ${x_destination ? `
              <span>-</span>
              <span class="unloading">${x_destination.trim()}</span>
            ` : !x_placements.length ? `<i class="icon ion-md-arrow-round-forward"></i>` : ``}
            ${this.formatTripPlacement(x_placement_type, x_placements)}`;
        break;
      case 3:
      case 4:
      case 20:
      case 21:

        html = `
           
            <span class="loading">${x_origin.trim()}</span>
            ${x_destination ? `
              <span>-</span>
              <span class="unloading">${x_destination.trim()}</span>
            ` : !x_placements.length ? ` <i class="icon ion-md-arrow-round-forward"></i> ` : ``}`;
        // console.log('X_placementType =', x_placements.length, x_status);
        if (x_placements.length && x_placements.length > 0) {
          html += ` <!-- Available (Done) -->
          ${this.formatTripPlacement(x_placement_type, x_placements)}`

        } else {
          html += ` <!-- Available (Next) -->
          <i class="fa fa-check-circle complete"></i>`;

        }

        // else {
        //   html = `
        //     <!-- Available (Next) -->
        //     <span class="loading">${x_origin.trim()}</span>
        //     ${x_destination ? `
        //       <span>-</span>
        //       <span class="unloading">${x_destination.trim()}</span>
        //     ` : !x_placements.length ? ` <i class="icon ion-md-arrow-round-forward"></i> ` : ``}
        //     ${this.formatTripPlacement(x_placement_type, x_placements)}`;
        // }
        break;

      case 5:
      case 15:
      case 22:
      case 23:
        html = `
            <!-- Available (Moved) -->
            <span class="unloading">${x_origin.trim()}</span><i title=""></i>
            ${this.formatTripPlacement(x_placement_type, x_placements)}`;
        break;
      default:
        html = `
            <!-- Ambiguous -->
            <span class="loading">${x_origin.trim()}</span>
            <span>-</span><i title=""></i>
            <span class="unloading">${x_destination.trim()}</span>
            ${this.formatTripPlacement(x_placement_type, x_placements)}`;
        break;
    }
    // console.log('HTML:', html);
    return html + this.handleTripStatusOnExcelExport(x_status, x_origin, x_destination, x_placements);
  }

  formatTripPlacement(placementType, placements) {
    // console.log('++++:placements:', placements, placementType);

    if (!placements.length) return '';
    let html = ` <i class="icon ion-md-arrow-round-forward"></i> `;
    const colors = {
      11: 'loading', // Loading
      21: 'unloading', // unloading
      0: 'others' // others
    };

    placements.map((obj, index) => {
      html += `<span class="${colors[placementType[index]] || 'others'}">${placements[index].trim()}</span>`
      if (index != placements.length - 1) {
        html += `<span> - </span>`;
      }
    });
    return html;

  }

  handleTripCircle(location, className = 'loading') {
    let locationArray = location.split('-');
    if (locationArray.length == 1) {
      return `<span class="circle ${className}">${location}</span>`;
    }
    let html = ``;
    for (let i = 0; i < locationArray.length; i++) {
      if (i == locationArray.length - 1) {
        html += `<span class="circle ${className}">${locationArray[i]}</span>`;
      } else {
        html += `<span class="${className}">${locationArray[i]}</span><span class="location-seperator">-</span>`
      }
    }
    return html;
  }


  convertDate(date, currentFormatt = 'dd-mm-yyyy') {
    let newDate = new Date();
    switch (currentFormatt) {
      case 'dd-mm-yyyy':
        let dateArray = date.split('-');
        newDate = new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
        break;
    }
    return newDate;
  }

  handleTripStatusOnExcelExport(status, origin, destination, placements) {
    let title = '';
    // placements.map((placement, index) => {
    //   title += placement;
    //   if (index < placements.length - 1) title += ' - ';
    // });

    switch (status) {
      case 0:
      case 11:
      case 1:
      case 12:
      case 2:
      case 13:
      case 14:
      case 51:
      case 52:
      case 53:
        title = origin;
        title += destination ? title += ` - ${destination}` : '';
        title += ' -> ' + placements.join('-');
        break;
      case 3:
      case 4:
      case 20:
      case 21:

        title = origin;
        title += destination ? title += ` - ${destination}` : '';
        placements.length && (title += ' -> ' + placements.join('-'));
        !placements.length && (title += ' *');
        break;

      case 5:
      case 15:
      case 22:
      case 23:
        title = origin;
        title += destination ? title += ` - ${destination}` : '';
        title += ' -> ' + placements.join('-');
        break;
      default:
        title = origin;
        title += destination ? title += ` - ${destination}` : '';
        title += ' -> ' + placements.join('-');
        break;
    }
    return `<i title="${title}"></i>`
  }
  unionArrays(x, y) {
    let obj = {};
    for (var i = x.length - 1; i >= 0; --i)
      obj[x[i]] = x[i];
    for (var i = y.length - 1; i >= 0; --i)
      obj[y[i]] = y[i];
    let res = []
    for (var k in obj) {
      if (obj.hasOwnProperty(k))  // <-- optional
        res.push(obj[k]);
    }
    return res;
  }

  loaderHandling(action = 'hide') {
    if (this.loading == 0 && action == 'hide') return;
    else if (this.loading < 0) {
      this.loading = 0;
      return;
    } else if (action == 'show') this.loading++;
    else this.loading--;
  }

  enterHandler(e) {
    switch (e.keyCode) {
      case 13: //Enter
        var focusableElements = document.querySelectorAll('input,select,textarea')
        var index = Array.prototype.indexOf.call(focusableElements, document.activeElement)
        if (e.shiftKey)
          focus(focusableElements, index - 1)
        else
          focus(focusableElements, index + 1)

        e.preventDefault()
        break;
    }
    function focus(elements, index) {
      if (elements[index])
        elements[index].focus()
    }
  }

  async getFoDetails() {
    this.loading++;
    let result = await this.api.post('Voucher/GetCompanyHeadingData', { search: '1' }).toPromise();
    this.loading--;
    return result['data'][0];
  }


  number2text(value) {
    var fraction = Math.round(this.frac(value) * 100);
    var f_text = "";

    if (fraction > 0) {
      f_text = "AND " + this.convert_number(fraction) + " PAISE";
    }

    return this.convert_number(value) + " RUPEE " + f_text + " ONLY";
  }

  frac(f) {
    return f % 1;
  }

  convert_number(number) {
    if ((number < 0) || (number > 999999999)) {
      return "NUMBER OUT OF RANGE!";
    }
    var Gn = Math.floor(number / 10000000);  /* Crore */
    number -= Gn * 10000000;
    var kn = Math.floor(number / 100000);     /* lakhs */
    number -= kn * 100000;
    var Hn = Math.floor(number / 1000);      /* thousand */
    number -= Hn * 1000;
    var Dn = Math.floor(number / 100);       /* Tens (deca) */
    number = number % 100;               /* Ones */
    var tn = Math.floor(number / 10);
    var one = Math.floor(number % 10);
    var res = "";

    if (Gn > 0) {
      res += (this.convert_number(Gn) + " CRORE");
    }
    if (kn > 0) {
      res += (((res == "") ? "" : " ") +
        this.convert_number(kn) + " LAKH");
    }
    if (Hn > 0) {
      res += (((res == "") ? "" : " ") +
        this.convert_number(Hn) + " THOUSAND");
    }

    if (Dn) {
      res += (((res == "") ? "" : " ") +
        this.convert_number(Dn) + " HUNDRED");
    }


    var ones = Array("", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN");
    var tens = Array("", "", "TWENTY", "THIRTY", "FOURTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY");

    if (tn > 0 || one > 0) {
      if (!(res == "")) {
        res += " AND ";
      }
      if (tn < 2) {
        res += ones[tn * 10 + one];
      }
      else {

        res += tens[tn];
        if (one > 0) {
          res += ("-" + ones[one]);
        }
      }
    }

    if (res == "") {
      res = "zero";
    }
    return res;
  }


}
