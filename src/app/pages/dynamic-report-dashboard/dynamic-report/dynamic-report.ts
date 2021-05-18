import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { CdkDragDrop, copyArrayItem } from '@angular/cdk/drag-drop';
import * as Chart from 'chart.js';
import * as _ from 'lodash';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'dynamic-report',
  templateUrl: './dynamic-report.html',
  styleUrls: ['./dynamic-report.scss']
})
export class DynamicReportComponent implements OnInit {
  @Input() savedReportSelect = {};
  @Input() startDate: any = this.common.getDate(-15);
  @Input() endDate = new Date();
  graphId: string = (Math.random() * 10000000).toFixed(0);
  isDisplayTable = false;
  reportIdUpdate = null;
  editState = false;
  graphBodyVisi = true;
  addFilterDropData = false;
  btnName = 'Filter Raw Data'
  checked: Boolean;
  active = null;
  selectedChart = 'pie';
  processList = [];
  reportPreviewData = [];
  graphPieCharts = [];
  savedReports = [];
  legendPosition = 'top';
  showLedgend = 'no';
  canvasname='';
  // measure = ['Date','Count','Average','Sum','distinct count']
  assign = {
    x: [],
    y: [],
    filter: [],
    startDate: this.startDate,
    endDate: this.endDate,
    reportFileName: '',
    // chart: []
  }
  processId = '';
  sideBarData = [
    {
      title: 'Fields', children: [{ title: '', children: '', isHide: false }]
    },
  ];
  Operators = [];
  filterObject = {};
  tableGraph = {
    data: {
      headings: {},
      columns: []
    },
    label: [],
    settings: {
      hideHeader: true,
      tableHeight: '45vh',
    }
  }

  chartTypes = [
    {
      id: 1,
      type: 'pie',
      url: "./assets/images/charts/piechart.jpg",
      blur: true
    },
    {
      id: 2,
      type: 'bar',
      url: "./assets/images/charts/barchart.png",
      blur: true
    },
    {
      id: 3,
      type: 'line',
      url: "./assets/images/charts/linechart.png",
      blur: true
    },
    {
      id: 4,
      type: 'bubble',
      url: "./assets/images/charts/bubblechart.png",
      blur: true
    },
    {
      id: 5,
      type: 'table',
      url: "./assets/images/charts/table.webp",
      blur: true
    }
  ]

  dropdownFilter = [];

  constructor(
    public common: CommonService,
    public api: ApiService,) {
  }

  ngOnDestroy() { }
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.openPreviewModal();
  }

  ngOnChanges(changes) {
    let isChanged = false;
    if (changes.savedReportSelect) {
      this.savedReportSelect = changes.savedReportSelect.currentValue;
      isChanged = true;
    }

    if (changes.startDate) {
      this.startDate = changes.startDate.currentValue;
      isChanged = true;

    }

    if (changes.endDate) {
      this.endDate = changes.endDate.currentValue;
      isChanged = true;

    }
    if (isChanged)
      this.openPreviewModal();
  }


  getSideBarList() {
    this.common.loading++;
    this.api.get(`GraphicalReport/getAllReportFieldsForNav`).subscribe(res => {
      this.common.loading--;
      if (!res['data']) return;
      this.resetSidebarData();
      this.resetAssignForm();
      let sideBarData = res['data'];
      sideBarData.map(ele => {
        this.sideBarData.map(data => {
          if (data.title == ele.reftype) {
            data.children.push({ title: ele.title, children: JSON.parse(ele.children), isHide: false })
          }
        })
      })
      console.log('Data:', this.sideBarData);

    }, err => {
      this.common.loading--;
      console.log(err);
    });
  }

  getSavedReportList() {
    this.common.loading++;
    this.api.get(`GraphicalReport/getGraphicalReportList`).subscribe(res => {
      this.common.loading--;
      this.savedReports = [];
      if (res['code'] == 1) {
        // if (!res['data']) return;
        this.savedReports = res['data'] ? res['data'] : [];
      } else {
        this.common.showError(res['msg']);
      }
      console.log('savedData:', this.savedReports);
    }, err => {
      this.common.loading--;
      console.log(err);
    });
  }

  resetSidebarData() {
    this.sideBarData = [
      {
        title: 'Fields', children: [{ title: '', children: '', isHide: false }]
      },
    ];
  }


  openPreviewModal() {
    let objectLength = Object.keys(this.savedReportSelect).length

    console.log(this.savedReportSelect, 'preview data')
    if (objectLength > 0) {
      this.reportIdUpdate = this.savedReportSelect['_id'];
      this.assign.reportFileName = this.savedReportSelect['name'];
      this.graphBodyVisi = false;
      console.log('this.savedReportSelect:', this.savedReportSelect);
      this.assign.x = this.savedReportSelect['jData']['info']["x"];
      this.assign.y = this.savedReportSelect['jData']['info']["y"];
      this.assign.filter = this.savedReportSelect['jData']['filter'];
      this.getReportPreview();
    } else {
      this.reportIdUpdate = null;
      this.assign.reportFileName = ''
      this.graphBodyVisi = true;
      this.common.showError('Please Select Report')
    }
    // document.getElementById('graphPreview').style.display = 'block';
    console.log('viewData', this.assign)

  }

  editGraph() {
    this.editState = true;
    this.graphBodyVisi = true;
    this.getReportPreview();
  }
  resetAssignForm() {
    this.assign = {
      x: [],
      y: [],
      filter: [],
      reportFileName: '',
      startDate: this.startDate,
      endDate: this.endDate,
    }
    this.tableGraph = {
      data: {
        headings: {},
        columns: []
      },
      label: [],
      settings: {
        hideHeader: true,
        tableHeight: '45vh',
      }
    }
    this.blurChartImage([true, true, true, true, true]);
    this.reportIdUpdate = null;
    this.reportPreviewData = [];
    this.graphPieCharts.forEach(ele => ele.destroy());
    this.isDisplayTable = false;
    // this.getReportPreview();
  }

  // closePreviewModal(){
  //   document.getElementById('graphPreview').style.display = 'none';
  // }

  // editPreviewReport(){

  // }


  drop(event: CdkDragDrop<number[]>) {
    console.log("drop event:", event);
    if (event.previousContainer === event.container) {
      console.log("if1:", event.container.data);
      if (event.container.id == "menuList")
        return false;
    } else {
      console.log("if2:", event.previousContainer.data);

      let exists = 0;
      let pushTo = '';
      if (event.container.id === "assignDataRow") {
        pushTo = 'x'
      } else if (event.container.id === "assignDataColumn") {
        // this.setMeasure(event.previousContainer.data[event.previousIndex])
        pushTo = 'y'
      } else if (event.container.id === "filter") {
        this.openFilterModal(event.previousContainer.data[event.previousIndex], null);
      }

      if (pushTo == 'x') {
        this.assign[pushTo].forEach(ele => {
          if (ele.r_colid === event.previousContainer.data[event.previousIndex]['r_colid'] &&
            (ele.r_isdynamic === event.previousContainer.data[event.previousIndex]['r_isdynamic'] &&
              ele.r_ismasterfield === event.previousContainer.data[event.previousIndex]['r_ismasterfield'])) {
            exists++;
          };
        })
        if (exists > 0) return; this.assign[pushTo].push(_.clone(event.previousContainer.data[event.previousIndex]));
      } else if (pushTo == 'y') {
        this.assign[pushTo].push(_.clone(event.previousContainer.data[event.previousIndex]));
      }

      console.log('stored:', this.assign)
    }
  }
  noReturnPredicate() {
    return false;
  }

  openFilterModal(data, type) {
    document.getElementById('rowFilter').style.display = 'none';
    document.getElementById('basicFilter').style.display = 'block';
    this.filterObject = _.clone(data);
    // console.log('filter_Object',this.filterObject)
    let params = {
      info: JSON.stringify(this.filterObject),
      startTime: this.common.dateFormatter(this.assign.startDate),
      endTime: this.common.dateFormatter(this.assign.endDate),
    }

    let checkCount = 0;
    this.dropdownFilter.map(ele => {
      if (ele.status) {
        checkCount++;
      }
    })
    if (checkCount == this.dropdownFilter.length) {
      this.checked = true;
    } else {
      this.checked = false
    }

    this.common.loading++;
    this.api.post('GraphicalReport/getFilterList', params).subscribe(res => {
      this.common.loading--;
      if (res['code'] == 1) {
        this.dropdownFilter = res['data'];
        this.assignFilteredValue();
      } else {
        this.common.showError(res['msg'])
      }
      console.log(res['data'])
    }, err => {
      this.common.loading--;
      console.log('Error:', err)
    })

    if (this.filterObject['r_coltype'] === "number") {
      this.Operators = [
        { id: 0, name: '=' },
        { id: 1, name: '<' },
        { id: 2, name: '>' },
        { id: 7, name: '<>' },
      ];
    } else if (this.filterObject['r_coltype'] === "text" && this.filterObject['r_coltype'] === "auto") {
      this.Operators = [
        { id: 0, name: '=' },
        { id: 3, name: 'ilike' },
        { id: 4, name: 'not ilike' },
        { id: 7, name: '<>' },
      ];
    } else if (this.filterObject['r_coltype'] === "boolean" && this.filterObject['r_coltype'] === "checkbox") {
      this.Operators = [
        { id: 0, name: '=' },
      ];
    } else if (this.filterObject['r_coltype'] === "timestamp") {
      this.Operators = [
        { id: 0, name: '=' },
        { id: 1, name: '<' },
        { id: 2, name: '>' },
        { id: 7, name: '<>' },
      ];
    } else {
      this.Operators = [
        { id: 0, name: '=' },
        { id: 1, name: '<' },
        { id: 2, name: '>' },
        { id: 3, name: 'ilike' },
        { id: 4, name: 'not ilike' },
        { id: 7, name: '<>' },
      ];
    }
    console.log('filter modal data test first', this.filterObject)
    if (!type) {
      this.filterObject['filterdata'] = [];
      this.addFilterDropData = true;
    }
    // this.filterObject['filterdata'] = [{r_threshold:[{r_value:''}],r_operators:''}];
    console.log('filter modal data', data)
    this.btnName = 'Filter Raw Data'
    document.getElementById('filterModal').style.display = 'block';
  }

  assignFilteredValue() {
    if (this.filterObject['filterdata'] && this.filterObject['filterdata'].length) {

      console.log(this.filterObject['filterdata'][0].r_operators)

      // this.filterObject['filterdata'].map(data=>{
      //   if(data.r_operators === 5 || data.r_operators ===6){

      //     this.btnName ='Filter Raw Data'
      //     document.getElementById('rowFilter').style.display = 'none';
      //     document.getElementById('basicFilter').style.display = 'block';

      //       console.log('datafiltered',this.filterObject['filterdata'])
      //       this.filterObject['filterdata'][0].r_threshold[0]['r_value'].forEach((data)=> {
      //         console.log('data edit filter',data)
      //         this.dropdownFilter.forEach(ele=>{
      //           if(ele.value === data.value){
      //             // console.log(ele)
      //             ele.status = data.status;
      //             console.log('data edit filter 1',data);
      //           }
      //         })
      //       })
      //     }else{
      //       this.btnName ='Cancel'
      //       document.getElementById('rowFilter').style.display = 'block';
      //       document.getElementById('basicFilter').style.display = 'none';
      //       return this.filterObject['filterdata'];
      //     }
      // })

      if (this.filterObject['filterdata'][0].r_operators === 5 ||
        this.filterObject['filterdata'][0].r_operators === 6) {
        this.filterObject['filterdata'].map(data => {
          if (data.r_operators === 5 || data.r_operators === 6) {

            this.btnName = 'Filter Raw Data'
            document.getElementById('rowFilter').style.display = 'none';
            document.getElementById('basicFilter').style.display = 'block';

            console.log('datafiltered', this.filterObject['filterdata'])
            this.filterObject['filterdata'][0].r_threshold[0]['r_value'].forEach((data) => {
              console.log('data edit filter', data)
              this.dropdownFilter.forEach(ele => {
                if (ele.value === data.value) {
                  // console.log(ele)
                  ele.status = data.status;
                  console.log('data edit filter 1', data);
                }
              })
            })
          }
        });
      } else {
        this.btnName = 'Cancel'
        document.getElementById('rowFilter').style.display = 'block';
        document.getElementById('basicFilter').style.display = 'none';
        return this.filterObject['filterdata'];
      }
    }
    this.filterObject['filterdata'] = [];
    this.manageCheckUncheckAll();
  }

  addFilter() {
    // if(this.filterObject['filterdata'].length>0){
    if (this.filterObject['filterdata'][this.filterObject['filterdata'].length - 1].r_threshold[0].r_value[0].value &&
      this.filterObject['filterdata'][this.filterObject['filterdata'].length - 1].r_operators) {
      this.filterObject['filterdata'].push({ r_threshold: [{ r_value: [{ value: '' }] }], r_operators: '' });
    } else {
      this.common.showError('Insert values')
    }
    // }
  }

  deletFilter(index) {
    if (index === 0) {
      return;
    } else {
      this.filterObject['filterdata'].splice(index, 1)
    }
  }

  checkUncheckAll(event) {
    const checked = event.target.checked;
    this.dropdownFilter.forEach(ele => {
      ele.status = checked;
    })
  }

  manageCheckUncheckAll() {
    let count = 0;
    this.dropdownFilter.map(ele => {
      if (ele.status) {
        count++;
      }
    });
    if (count < this.dropdownFilter.length) {
      this.checked = false;
    } else if (count == this.dropdownFilter.length) {
      this.checked = true;
    }
  }

  rowFilter(btn) {
    if (btn === 'Filter Raw Data') {
      this.addFilterDropData = false;
      document.getElementById('rowFilter').style.display = 'block';
      document.getElementById('basicFilter').style.display = 'none';
      this.filterObject['filterdata'] = [{ r_threshold: [{ r_value: [{ value: '' }] }], r_operators: '' }];
      this.btnName = 'Cancel'
    }
    else if (btn === 'Cancel') {
      this.addFilterDropData = true;
      document.getElementById('rowFilter').style.display = 'none';
      document.getElementById('basicFilter').style.display = 'block';
      this.filterObject['filterdata'] = [];
      this.btnName = 'Filter Raw Data'
    }
  }

  storeFilter() {
    let filterObject = _.clone(this.filterObject)
    let inEle = [];
    let notInEle = [];

    console.log('edit time filter object', this.filterObject)

    if (this.addFilterDropData) {
      console.log('edit time', this.dropdownFilter)
      inEle = this.dropdownFilter.filter(ele => ele.status)
      notInEle = this.dropdownFilter.filter(ele => !ele.status)

      console.log('in', inEle, 'notin:', notInEle)
      // if(inEle.length > notInEle.length){
      filterObject['filterdata'].push({ r_threshold: [{ r_value: notInEle.length > 0 ? notInEle : [{ value: '' }] }], r_operators: 6 });
      // }else{
      filterObject['filterdata'].push({ r_threshold: [{ r_value: inEle.length > 0 ? inEle : [{ value: '' }] }], r_operators: 5 });
      // }
    }
    let exists = 0;
    let index = null;
    this.assign.filter.forEach((ele, ind) => {
      if (ele.r_colid === this.filterObject['r_colid'] &&
        (ele.r_isdynamic === this.filterObject['r_isdynamic'] &&
          ele.r_ismasterfield === this.filterObject['r_ismasterfield'])) {
        exists++;
        index = ind;
      };
    })
    // console.log('check 3:',this.filterObject['filterdata'])
    if (exists > 0) {
      this.assign.filter.splice(index, 1, filterObject);
    } else {
      this.assign.filter.push(filterObject);
    }
    this.closeFilterModal()
    console.log('data after filter add:', this.assign)
  }

  closeFilterModal() {
    document.getElementById('filterModal').style.display = 'none';
  }

  removeField(index, axis) {
    this.assign[axis].splice(index, 1)
    console.log('deleted:', index, 'from:', this.assign)
  }

  editFilter(index) {
    console.log('edit data:', this.assign.filter[index]);
    this.assign.filter[index].filterdata.map(ele => {
      console.log('type of filterdata', typeof ele.r_threshold);
      if (typeof ele.r_threshold === 'string') { ele.r_threshold = JSON.parse(ele.r_threshold) };
    })
    this.openFilterModal(this.assign.filter[index], 'edit');
  }

  generateCOlorPallet() {
    let colors = [];
    for (let angleIndex = 0; angleIndex < 360; angleIndex += 15) {
      colors.push(this.common.HSLToHex(angleIndex, 100, 70));
    }
    console.log('pallet', colors);
    return this.common.shuffle(colors);
  }

  addMeasure(index, axis, measure) {
    console.log('index:', index, 'axis:', axis, 'measure:', measure);
    if (measure === 'None') {
      this.assign[axis][index].measure = null;
    } else {
      this.assign[axis][index].measure = measure;
    }
    console.log('measure inserted:', this.assign)

  }

  openSaveModal() {
    if (this.assign.x.length > 0 && this.assign.y.length > 0) {
      document.getElementById('saveAs').style.display = 'block'
      if (!this.editState) {
        this.assign.reportFileName = ''
      }
    } else {
      this.common.showError('please fill Mandatory fileds first')
    }
  }
  closeSaveModal() {
    document.getElementById('saveAs').style.display = 'none'
  }
  saveGraphicReport() {
    this.assign.y.forEach(ele => {
      if (!ele.measure) {
        ele.measure = 'Count';
      }
    })
    let reqID = null;
    if (!this.editState) {
      reqID = null;
    } else {
      reqID = this.reportIdUpdate;
    }

    let info = { x: this.assign.x, y: this.assign.y };
    let params = {
      jData: JSON.stringify({ filter: this.assign.filter, info: this.assign }),
      name: this.assign.reportFileName,
      id: reqID
    };

    if (params.name) {
      this.common.loading++;
      this.api.post('GraphicalReport/saveGraphicalReportList', params).subscribe(res => {
        this.common.loading--;
        if (res['code'] == 1) {
          if (res['data'][0].y_id > 0) {
            this.common.showToast(res['data'][0].y_msg);
            this.reportPreviewData = res['data'];
            this.getSavedReportList();
            // this.getChartofType(this.selectedChart);
            this.closeSaveModal();
          } else {
            this.common.showError(res['data'][0].y_msg);
          }

        } else {
          this.common.loading--;
          this.common.showError(res['msg']);
        }
      }, err => {
        this.common.loading--;
        console.log('Error:', err)
      })
    } else {
      this.common.showError('Please enter File Name')
    }
  }

  getReportPreview() {
    console.log('complete data', this.assign)
    this.assign.y.forEach(ele => {
      if (!ele.measure) {
        ele.measure = 'Count';
      }
    });
    // console.log('data to send',this.assign.data)
    // return;
    let info = { x: this.assign.x, y: this.assign.y };
    let params = {
      reportFilter: this.assign.filter ? JSON.stringify(this.assign.filter) : [],
      info: JSON.stringify(info),
      startTime: this.common.dateFormatter(this.assign.startDate),
      endTime: this.common.dateFormatter(this.assign.endDate),
    };

    if (this.assign.x.length && this.assign.y.length) {
      this.common.loading++;
      let i = 0;
      this.api.post('GraphicalReport/getPreviewGraphicalReport', params).subscribe(res => {
        this.common.loading--;
        if (res['code'] == 1) {
          console.log('Response reportPreviewData :',this.assign,i);
          i = i + 1;
          if (res['data']) {
            this.reportPreviewData = res['data'];
            this.canvasname = this.assign['reportFileName'];
            this.review();
          } else {
            // this.resetAssignForm();
            this.common.showError('No Data to Display');
            this.graphPieCharts.forEach(ele => ele.destroy());
          }
          
        } else {
          this.common.showError(res['msg'])
        }
      }, err => {
        this.common.loading--;
        console.log('Error:', err)
      })
    } else {
      this.common.showError('please fill Mandatory fileds first');
      this.graphPieCharts.forEach(ele => ele.destroy());
      this.resetAssignForm();

    }
  }

  review() {
    if (this.assign.x.length > 1 || this.assign.y.length > 1) {
      this.blurChartImage([true, false, false, false, false]);
    } else {
      this.blurChartImage([false, false, false, false, false]);
    }
    console.log('chart data', this.reportPreviewData)
    // this.showChart(this.reportPreviewData,'pie');
    this.getChartofType(this.selectedChart);
  }

  getChartofType(chartType) {
    // if(this.reportPreviewData.length>0){
    if (chartType === 'table') {
      this.isDisplayTable = true;
      document.getElementById(this.graphId).style.display = 'none';
      this.getTable(this.reportPreviewData);
    } else {
      this.isDisplayTable = false;
      document.getElementById(this.graphId).style.display = 'block';
      this.showChart(this.reportPreviewData, chartType);
    }
    // }else{
    //   return;
    // }
  }

  getTable(stateTableData) {
    stateTableData = this.changeDataForXMulti(stateTableData);
    this.tableGraph.data = {
      headings: this.setHeaders(stateTableData),
      columns: this.setColumns(stateTableData)
    };
    return true;;
  }
  setHeaders(stateTableData) {
    let headers = [];
    stateTableData.map(ele => { headers.push(ele.series['y_name']) });
    let head = headers;
    let headings = {};
    headings['X-Axis'] = { title: 'X-Axis', placeholder: 'X-Axis' }
    for (let key in head) {
      headings[head[key]] = { title: head[key], placeholder: head[key] }
    };
    return headings;
  }

  setColumns(stateTableData) {
    let columns = [];
    let labels = [];
    stateTableData[0].series.data.map(label => {
      labels.push(_.clone(label.name))
    });

    console.log('preview of report', stateTableData);

    for (let key in this.setHeaders(stateTableData)) {
      stateTableData.map((ele, index) => {
        let column = {};
        console.log('key is', key, ele.y_name)
        if (key === ele.series.y_name) {
          ele.series.data.map((data, subindex) => {
            if (index == 0) {
              console.log('data in loop', data)
              column[key] = { value: data['y'] };
              columns.push(_.clone(column));
            } else {
              columns[subindex][key] = _.clone({ value: data['y'] })
            }
          })
        }
        // else if(key == 'Label'){
        //   ele.series.data.map(data => {
        //     column['Label'] = { value: this.common.formatTitle(data['name']), class: 'black font-weight-bold'};
        // })
        // }
      })
      console.log(labels, 'labels for table')
    }
    labels.map((val, indexLabel) => {
      columns[indexLabel]['X-Axis'] = { value: val, class: 'black font-weight-bold' };
    })
    console.log('headings', this.tableGraph)
    return columns;
  }

  getRestSplit(str, seprator) {
    let rest = "";
    str.split(seprator).map((e, index) => {
      if (index != 0)
        rest = rest + e + seprator;
    })
    let lastIndex = rest.lastIndexOf(seprator);
    return rest.substring(0, lastIndex);
  }

  changeDataForXMulti(stateTableData) {
    let stateTableDataLatest = [];
    if (this.assign.x.length >= 2) {
      let seprator = ' | ';
      stateTableData.map((stateTabledt, index) => {
        let stateTableDataMap = {};
        let xAxisDistinct = {};
        JSON.parse(stateTableData[index].xAxis).map(condt => {
          if (!xAxisDistinct[condt.split(seprator)[0]])
            xAxisDistinct[condt.split(seprator)[0]] = 1;
        });
        let yAxisDistinct = {};
        JSON.parse(stateTableData[0].xAxis).map(condt => {
          if (!yAxisDistinct[this.getRestSplit(condt, seprator)])
            yAxisDistinct[this.getRestSplit(condt, seprator)] = 1;
        });
        let yName = stateTabledt.series['y_name'];
        let yAxis = stateTabledt.series['yaxis'];
        stateTabledt.series.data.map(dt => {
          let splitFirst = dt.name.split(seprator)[0];
          let splitRest = this.getRestSplit(dt.name, seprator);
          let pushObj = { x: dt.x, y: dt.y, name: splitFirst };
          if (stateTableDataMap[splitRest]) {
            if (stateTableDataMap[splitRest][splitFirst]) {
              stateTableDataMap[splitRest][splitFirst] = pushObj;
            } else {
              stateTableDataMap[splitRest][splitFirst] = pushObj;
            }
          } else {
            stateTableDataMap[splitRest] = {};
            stateTableDataMap[splitRest][splitFirst] = pushObj;
          }
        });
        Object.keys(yAxisDistinct).map(y => {
          let dataPut = [];
          Object.keys(xAxisDistinct).map((x, xi) => {
            dataPut.push(stateTableDataMap[y][x] ? stateTableDataMap[y][x] : { x: xi, y: 0, name: x });
          });
          stateTableDataLatest.push({ series: { data: dataPut, yaxis: yAxis, y_name: y + (this.assign.y.length > 1 ? '(' + yName + ')' : '') }, xAxis: "[\"" + Object.keys(xAxisDistinct).join(",") + "\"]" });
        });
      });
      stateTableData = stateTableDataLatest;
    }
    console.log('data manupulated x axis:', stateTableData);
    return stateTableData;
  }

  showChart(stateTableData, chartType) {
    this.graphPieCharts.forEach(ele => ele.destroy());
    console.log('data to send to chart module:', stateTableData);
    // const labels = stateTableData.map((e) => JSON.parse(e['xAxis']));
    // const data = stateTableData.map((e) => e['series']);

    let labels = [];
    let dataSet = [];
    let chartDataSet = [];
    stateTableData = this.changeDataForXMulti(stateTableData);

    if (stateTableData.length == 1) {
      stateTableData.map(e => {
        labels = [];
        e.series.data.map(label => {
          labels.push(label.name)
        })
      });
      console.log('data after label:', stateTableData);

      stateTableData.map(e => {
        dataSet.push({ label: e.series.y_name, data: [], bgColor: [], yAxesGroup: e.series.yaxis });
        dataSet.map(sub => {
          if (sub.label === e.series.y_name) {
            e.series.data.map(data => {
              sub.data.push(data.y)
            })
          }
        })
      });
    } else if (!stateTableData) {
      chartDataSet = [];
    }
    else {
      stateTableData.map(e => {
        labels = [];
        e.series.data.map(label => {
          labels.push(label.name)
        })
      });

      stateTableData.map((e, index) => {
        dataSet.push({ label: e.series.y_name, data: [], yAxesGroup: e.series.yaxis, bgColor: this.generateCOlorPallet() });
        dataSet.map(sub => {
          if (sub.label === e.series.y_name) {
            e.series.data.map(data => {
              sub.data.push({ x: data.x, y: data.y, r: (index + 1) * 4 })
            })
          }
        })
      });

      console.log('DataSet from graphics', dataSet)
    }
    console.log('data after end:', stateTableData);

    // start:managed service data
    if (chartType === 'line') {
      dataSet.map((data, index) => {
        chartDataSet.push({
          label: data.label,
          data: data.data,
          borderWidth: 1,
          lineTension: 0,
          borderColor: data.bgColor[index] ? data.bgColor[index] : '#1AB399',
          yAxisID: data.yAxesGroup,
          fill: false,
          borderDash: (data.yAxesGroup == 'y-right' ? [5, 5] : [5, 0])
        })
      });
    } else {
      dataSet.map((data, index) => {
        console.log('data label',data);
        chartDataSet.push({
          label: data.label,
          data: data.data,
          backgroundColor: data.bgColor[index] ? data.bgColor[index] : this.generateCOlorPallet(),
          yAxisID: data.yAxesGroup,
          borderWidth: 1
        })
      });
    }
    // end:managed service data


    let chartData: any;
    if (chartType === 'pie') {
      chartData = {
        canvas: document.getElementById(this.graphId),
        data: chartDataSet,
        labels: labels,
        showLegend: true
      };
    } else {
      let yAxes = [];
      let sepratorAxisLabel = ' AND ';
      let yLeftTitle = '';
      let yRightTitle = '';
      this.assign.y.map(e => {
        if (e.yaxis == 'y-left')
          yLeftTitle += (e.r_coltitle + " -> " + e.measure) + sepratorAxisLabel;
        if (e.yaxis == 'y-right')
          yRightTitle += (e.r_coltitle + " -> " + e.measure) + sepratorAxisLabel;
      });
      yLeftTitle = yLeftTitle.slice(0, -5);
      yRightTitle = yRightTitle.slice(0, -5);
      if (this.assign.x.length > 1 && this.assign.y.length > 1 && this.assign.y.find(e => { return e.yaxis == 'y-left' }) && this.assign.y.find(e => { return e.yaxis == 'y-right' })) {
        yAxes.push({
          name: 'y-left',
          id: 'y-left',
          position: 'left',
          scalePositionLeft: true,
          scaleLabel: {
            display: true,
            labelString: yLeftTitle
          },
          ticks: {
            beginAtZero: true,
            stepSize: 1
          }
        }, {
          name: 'y-right',
          id: 'y-right',
          position: 'right',
          scalePositionLeft: false
          , scaleLabel: {
            display: true,
            labelString: yRightTitle
          },
          ticks: {
            beginAtZero: true,
            stepSize: 1
          }
        });
      } else {
        yAxes.push({
          name: 'y-left',
          id: 'y-left',
          position: 'left',
          scalePositionLeft: true,
          scaleLabel: {
            display: true,
            labelString: yLeftTitle
          },
          ticks: {
            beginAtZero: true,
            stepSize: 1
          }
        });
      }
      chartData = {
        canvas: document.getElementById(this.graphId),
        data: chartDataSet,
        labels: labels,
        scales: {
          yAxes: yAxes,
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.assign.x[0].r_coltitle + ' -> ' + this.assign.x[0].measure
            },
            ticks: {
              beginAtZero: true,
              stepSize: 1
            }
          }]
        },
        showLegend: true
      };
    }
    this.graphPieCharts = this.generateChart([chartData], chartType);

  }

  generateChart(charDatas, type = 'pie') {
    let charts = [];
    console.log('chartData', charDatas, type);
    this.showLedgend = (type == 'pie')? "yes":'np';
    this.legendPosition = (type == 'pie')? "right":'top';
   let labdata =  {
      fontSize: 11,
      padding:  3,
      boxWidth: 22,
      boxHeight:60
    };

    charDatas.forEach(chartData => {
      //console.log('chartData label  11',chartData.data.label,chartData.data[0].label);
      charts.push(new Chart(chartData.canvas.getContext('2d'), {
        type: type,
        data: {
          labels: chartData.labels,
          datasets: chartData.data,
        },
        options: {
          legend: {
            position: this.legendPosition,
            display: this.showLedgend === "yes" ? true : false,
            labels: (type == 'pie')? labdata:''
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            position: 'nearest'
          },
          scales: chartData.scales,
          responsive: true,
         
        }
      }));
    })
    console.log('chartData Final', charts);
    return charts;
  }

  onHideShow(head, index) {
    this.sideBarData.forEach(element => {
      let i = 0;
      if (element.children && element.children.length) {
        element.children.forEach(element2 => {
          if (element2.isHide && index != i) {
            element2.isHide = false;
          }
          i++;
        });
      }
    });
    console.log("head:", head);
    setTimeout(() => {
      head.isHide = !head.isHide;
    }, 10);
  }

  blurChartImage(setBlur) {
    this.chartTypes.map((e, i) => { e.blur = setBlur[i] });
    let setIndex = this.chartTypes[0]['id'];
    setBlur.find((e, i) => { if (!e) setIndex = i; return !e; });
    if (!this.active || this.chartTypes[this.active - 1].blur) {
      this.active = setIndex + 1;
    }
    this.selectedChart = this.chartTypes[this.active - 1].type;
  }

  generateCollapsible() {
    let coll = document.getElementsByClassName("collapsible");
    let i;
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }
  }

}
