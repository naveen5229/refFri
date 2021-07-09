import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { CdkDragDrop, copyArrayItem } from '@angular/cdk/drag-drop';
import * as Chart from 'chart.js';
import * as _ from 'lodash';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { anyChanged } from '@progress/kendo-angular-common';

@AutoUnsubscribe()
@Component({
  selector: 'graphical-reports',
  templateUrl: './graphical-reports.component.html',
  styleUrls: ['./graphical-reports.component.scss']
})
export class GraphicalReportsComponent implements OnInit {
  startDate = this.common.getDate(-15);
  endDate = new Date();
  savedReportSelect = {};
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
  basicFilter:boolean = false;

  // measure = ['Date','Count','Average','Sum','distinct count']
  assign = {
    x: [],
    y: [],
    yAddvance: [],
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
  // dynamicFilter = [
  //   {id:'in',name:'in'},{id:'not in',name:'not in'},{id:'like',name:'like'},{id:'not like',name:'not like'}
  // ];

  chartTypes = [
    {
      id: 1,
      type: 'pie',
      url: "./assets/images/charts/chart-pie-solid.svg",
      blur: true
    },
    {
      id: 2,
      type: 'bar',
      url: "./assets/images/charts/chart-bar-solid.svg",
      blur: true
    },
    {
      id: 3,
      type: 'line',
      url: "./assets/images/charts/chart-line-solid.svg",
      blur: true
    },
    {
      id: 4,
      type: 'bubble',
      url: "./assets/images/charts/bubble.svg",
      blur: true
    },
    {
      id: 5,
      type: 'table',
      url: "./assets/images/charts/table-solid.svg",
      blur: true
    },
    {
      id: 6,
      type: 'bar-line',
      url: "./assets/images/charts/linebar.svg",
      blur: true
    }
  ]
  dynamicFilter = ['IN','NOT IN','LIKE','NOT LIKE'];
  dynamicfilterval = this.dynamicFilter[0];
  dropdownFilter = [];
  finalcarttype='';
  fliterflag = true;
  firstfilter='';
  secondfilter='';
  defaultdays=30;
  dynamicflag = 0;
  addvanceflag = false;
  constructor(
    public common: CommonService,
    public api: ApiService,) {
  }

  ngOnDestroy(){}
ngOnInit(): void {
  }
  
  ngAfterViewInit() {
    this.getSideBarList();
    this.getSavedReportList();
    this.generateCollapsible();
  }

  // getProcessList() {
  //   this.common.loading++;
  //   this.api.get('Processes/getProcessList').subscribe(res => {
  //     this.common.loading--;
  //     if (!res['data']) return;
  //     this.processList = res['data'];

  //   }, err => {
  //     this.common.loading--;
  //     console.log(err);
  //   });
  // }

  // getSideBarData(processId){
  //   this.resetAssignForm();
  //   this.processId = processId;
  //   if(!this.processId){
  //     this.common.showError('Select Process')
  //   }else{
  //   this.getSideBarList();
  //   this.getSavedReportList();
  // }
  // }

  getSideBarList() {
    this.common.loading++;
    this.api.get(`GraphicalReport/getAllReportFieldsForNav`).subscribe(res => {
      this.common.loading--;
      if (!res['data']) return;
      this.resetSidebarData();
      this.resetAssignForm();
      let sideBarData = res['data'];
      sideBarData.map(ele => {
        console.log('Data previous:', ele);
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
      this.assign.x = this.savedReportSelect['cols_str']["x"];
      this.assign.y = this.savedReportSelect['cols_str']["y"];
      this.assign.filter = this.savedReportSelect['filter_str'];
      this.selectedChart = this.savedReportSelect['rpt_type'];
      this.dynamicflag = 1;
      this.getReportPreview();
    } else {
      this.reportIdUpdate = null;
      this.assign.reportFileName = ''
      this.graphBodyVisi = true;
      this.common.showError('Please Select Report')
    }
    document.getElementById('graphPreview').style.display = 'block';
    console.log('viewData', this.assign)

  }

  editGraph() {
    this.editState = true;
    this.graphBodyVisi = true;
    this.dynamicflag = 1;
    this.getReportPreview();
  }
  resetAssignForm() {
    this.assign = {
      x: [],
      y: [],
      yAddvance:[],
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
    this.blurChartImage([true, true, true, true, true,true]);
    this.reportIdUpdate = null;
    this.reportPreviewData = [];
    this.graphPieCharts.forEach(ele => ele.destroy());
    document.getElementById('table').style.display = 'none';
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
      }else if (event.container.id === "assignDataColumnYadd") {
        // this.setMeasure(event.previousContainer.data[event.previousIndex])
        pushTo = 'yAddvance'
      } else if (event.container.id === "filter") {
        if(event.previousContainer.data[event.previousIndex]['r_coltype'] != 'operator'){
        this.openFilterModal(event.previousContainer.data[event.previousIndex], null);
        }
      }

      if (pushTo == 'x') {
        console.log('data type casting:',event.previousContainer.data[event.previousIndex]['r_coltype']);
        if(event.previousContainer.data[event.previousIndex]['r_coltype'] == 'operator') return;
        this.assign[pushTo].forEach(ele => {
          if (ele.r_colid === event.previousContainer.data[event.previousIndex]['r_colid'] &&
            (ele.r_isdynamic === event.previousContainer.data[event.previousIndex]['r_isdynamic'] &&
              ele.r_ismasterfield === event.previousContainer.data[event.previousIndex]['r_ismasterfield'])) {
            exists++;
          };
        })
        if (exists > 0) return; this.assign[pushTo].push(_.clone(event.previousContainer.data[event.previousIndex]));
      } else if (pushTo == 'y') {
        if(event.previousContainer.data[event.previousIndex]['r_coltype'] == 'operator'){
          exists++;
        }
        if (exists == 0)  this.assign[pushTo].push(_.clone(event.previousContainer.data[event.previousIndex]));
      }else if (pushTo == 'yAddvance') {
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
    this.basicFilter = true;
    this.filterObject = _.clone(data);
   //  console.log('filter_Object',data);
    let params = {
       //info: JSON.stringify(this.filterObject),
       info: this.filterObject['r_colcode'],
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
    if(!((this.filterObject['r_coltype'] && this.filterObject['r_coltype'].includes('number'|| 'int' || 'bigint' || 'decimal')) || this.filterObject['measure'] && this.filterObject['measure'].includes('number'|| 'int' || 'bigint' || 'decimal'))){
    this.common.loading++;
    this.api.post('GraphicalReport/getFilterList', params).subscribe(res => {
      this.common.loading--;
      if (res['code'] == 1) {
        this.fliterflag = true;
        this.dropdownFilter = res['data'];
        this.assignFilteredValue();
  this.dynamicfilterval = this.dynamicFilter[0];

      } else {
        this.common.showError(res['msg'])
      }
      console.log(res['data'])
    }, err => {
      this.common.loading--;
      console.log('Error:', err)
    })
  }else{
    this.fliterflag = false;
  this.dynamicfilterval = this.dynamicFilter[0];
    this.assignFilteredValue();

  }

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
    console.log('filter obj',this.filterObject);
    this.dynamicflag = 0;
    if((this.filterObject['r_coltype'] && this.filterObject['r_coltype'].includes('number'|| 'int' || 'bigint' || 'decimal'))|| this.filterObject['measure'] && this.filterObject['measure'].includes('number'|| 'int' || 'bigint' || 'decimal')){
// this.dynamicFilter = [
//   {id:'=',name:'='},{id:'>',name:'>'},{id:'<',name:'<'},{id:'!=',name:'!='},{id:'>=',name:'>='},{id:'<=',name:'<='},{id:'between ',name:'between '}
// ];
this.dynamicFilter = ['=','>','<','!=','>=','<=','between'];
    }else{
    this.dynamicFilter = ['IN','NOT IN','LIKE','NOT LIKE'];
    }
    console.log('dynamicFilter',this.dynamicFilter);
    if (this.filterObject['filterdata'] && this.filterObject['filterdata'].length) {


      // this.filterObject['filterdata'].map(data=>{
      //   if(data.r_operators === 5 || data.r_operators ===6){

      //     this.btnName ='Filter Raw Data'
      //     document.getElementById('rowFilter').style.display = 'none';
      //     this.basicFilter = true;

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
      //       this.basicFilter = false
      //       return this.filterObject['filterdata'];
      //     }
      // })
        console.log('filderdata with object',this.filterObject['filterdata'],((this.filterObject['filterdata']).split("'',''")));
      if (this.filterObject['filterdata'][0].r_operators  && this.filterObject['filterdata'][0].r_operators === 5 ||
        this.filterObject['filterdata'][0].r_operators === 6) {
        this.filterObject['filterdata'].map(data => {
          if (data.r_operators === 5 || data.r_operators === 6) {

            this.btnName = 'Filter Raw Data'
            document.getElementById('rowFilter').style.display = 'none';
            this.basicFilter = true;

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
      } else if (this.filterObject['filterdata'].length){
       // this.dynamicflag = 2;
        let newfilterobj =[];
        this.filterObject['filterdata'].split("'',''").forEach((data,dindex) => {
          if(dindex == 0 || dindex == (this.filterObject['filterdata'].split("'',''").length -1)){
            if(dindex == 0 ){
              data = data.substring(3,13)
            }else{
              data = data.substring(0,10);
            }
          }
        //  console.log('data edit filter', data)
          this.dropdownFilter.forEach(ele => {
            if (ele.value === data) {
              // console.log(ele)
              let array = {
              status : true,
              value: ele.value
              };
              newfilterobj.push(array);
            //  console.log('data edit filter 1', data);
            }else{
              let array = {
                status : false,
                value: ele.value
                };
                newfilterobj.push(array);
            }
          })
        })
        this.dropdownFilter = newfilterobj;
        this.dynamicflag = 1;
      }else {
        this.btnName = 'Cancel'
        document.getElementById('rowFilter').style.display = 'block';
        this.basicFilter = false
        return this.filterObject['filterdata'];
      }
    }else if (this.filterObject['data'] && (this.filterObject['data'] != 'string')){
      let newfilterobj =[];
      this.filterObject['data'].forEach((data,dindex) => {
       
        this.dropdownFilter.forEach(ele => {
          if (ele.value === data.value) {
            let array = {
            status : true,
            value: ele.value
            };
            newfilterobj.push(array);
          //  console.log('data edit filter 1', data);
          }else{
            let array = {
              status : false,
              value: ele.value
              };
              newfilterobj.push(array);
          }
        })
      })
      this.dropdownFilter = newfilterobj;
      this.dynamicflag = 1;

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
    if(count > 1 && (!this.dynamicfilterval.includes('NOT IN'))) { 
      this.dynamicfilterval = 'IN';
     }
    console.log('dropdownFilter',this.dropdownFilter);
  }

  rowFilter(btn) {
    if (btn === 'Filter Raw Data') {
      this.addFilterDropData = false;
      document.getElementById('rowFilter').style.display = 'block';
      this.basicFilter = false
      this.filterObject['filterdata'] = [{ r_threshold: [{ r_value: [{ value: '' }] }], r_operators: '' }];
      this.btnName = 'Cancel'
    }
    else if (btn === 'Cancel') {
      this.addFilterDropData = true;
      document.getElementById('rowFilter').style.display = 'none';
      this.basicFilter = true;
      this.filterObject['filterdata'] = [];
      this.btnName = 'Filter Raw Data'
    }
  }

  storeFilter() {
    console.log('before edit time filter object', this.filterObject,this.dropdownFilter)
    if(!this.fliterflag){
    this.dropdownFilter = [];
    this.dropdownFilter.push({value:this.firstfilter,status:true},{value:this.secondfilter,status:((this.dynamicfilterval == 'between')?true:false)})
    }
    if(this.dynamicfilterval == 'between' && (!this.firstfilter || !this.secondfilter)){
      this.common.showError('both min And max are mandatory');
      return false;
    }else if(this.dynamicfilterval == ('LIKE' || 'NOT LIKE' )){
      let count = 0;
        this.dropdownFilter.forEach((rdata)=>{
          if(rdata.status){
            count +=1;
          }
        });
        if((count > 1) &&  (!this.dynamicfilterval.includes('NOT IN'))) { 
         this.dynamicfilterval = 'IN';
        }
    }
    let filterObject = _.clone(this.filterObject)
    let inEle = [];
    let notInEle = [];
    filterObject['dynamicfilterval']=this.dynamicfilterval;
    console.log('edit time filter object', this.filterObject,this.dynamicfilterval,this.addFilterDropData)

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
    });
   
     // this.filterObject['data'] = this.dropdownFilter;
     let newarray = []
     this.dropdownFilter.map((data,index)=>{
        if(data.status){
          newarray.push(data);
        }
     });
    // this.assign.filter[index]['data'] =  newarray;
     filterObject['data'] =  newarray;
    if (exists > 0) {
      this.assign.filter.splice(index, 1, filterObject) ;
    console.log('data after filter add before:', this.assign)

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
    this.assign[axis].splice(index, 1);
    this.fliterflag = true;
    console.log('deleted:', index, 'from:', this.assign)
  }

  editFilter(index) {
    console.log('edit data:', this.assign.filter[index]);
    if(this.assign.filter[index].filterdata){
        this.assign.filter[index].filterdata.map(ele => {
          console.log('type of filterdata', typeof ele.r_threshold);
          if (typeof ele.r_threshold === 'string') { ele.r_threshold = JSON.parse(ele.r_threshold) };
        })
    }else{
      let dummydata:any;
      this.assign.filter[index]['filterdata'] = this.assign.filter[index].data;
    }
    if(this.assign.filter[index]['r_coltype'] && (this.assign.filter[index]['r_coltype'].includes('number'|| 'int' || 'bigint' || 'decimal'))){
      this.dynamicFilter = ['=','>','<','!=','>=','<=','between'];
      this.fliterflag = false;
          }else if(this.assign.filter[index]['measure'] && (this.assign.filter[index]['measure'].includes('number'|| 'int' || 'bigint' || 'decimal'))){
      this.dynamicFilter = ['=','>','<','!=','>=','<=','between'];
            this.fliterflag = false;
          }else{
            this.fliterflag = false;
          
          }
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
    let xnewaaray = [];
    this.assign.x.map((data)=>{
      let xarray ={
        r_coltitle:data.r_coltitle,
        r_colcode:data.r_colcode,
        measure:data.measure
      };
      xnewaaray.push(xarray);
    });

    let ynewaaray = [];
    this.assign.y.map((data)=>{
      let xarray ={
        r_coltitle:data.r_coltitle,
        r_colcode:data.r_colcode,
        measure:data.measure
      };
      ynewaaray.push(xarray);
    });
    let yaddvanceaaray = '{';
    if(this.assign.yAddvance.length){
    this.assign.yAddvance.map((data)=>{
      if(data.r_coltype == 'operator'){
        if(data.measure == 'c' || data.measure == 's'){
           console.log('operator true',data);
          yaddvanceaaray += data.r_colcode+',' ;
        }else{
          console.log('operator false',data);
          yaddvanceaaray += data.measure+',' ;
        }
      }else{
        yaddvanceaaray += data.r_colcode+','+data.measure+',' ;
      }
    });
    }
    //let info = { x: this.assign.x, y: this.assign.y };
    let info = { x: xnewaaray, y: ynewaaray };

    let newfilter=[];
    if(this.assign.filter){
      console.log('update data',this.assign.filter);
      this.assign.filter.map((data)=>{
        let arrstring='';
        if(data['filterdata'].length){
        data['filterdata'].map((fldata)=>{
          console.log('fffl data',fldata);
          fldata['r_threshold'][0]['r_value'].map((miningdata)=>{
          console.log('fffl data2',miningdata);

          if(miningdata['status']){
            arrstring += `''`+miningdata.value+`'',`;
          }
        })
        });
      }else{
        console.log(' data array', data['data']);
        data['data'].map((fldata)=>{
          if(fldata['status']){
            arrstring += `''`+fldata.value+`'',`;
          }
        });
      }
        console.log('arr',arrstring);

        
        let xarray ={
          r_coltitle:data.r_coltitle,
          r_colcode:data.r_colcode,
          measure:data.dynamicfilterval,//'in'
          data:'['+(arrstring).slice(0, -1)+']'
        };
        newfilter.push(xarray);
      });
    }
    let params = {
      reportFilter: this.assign.filter ? JSON.stringify(newfilter) : [],
      info: JSON.stringify(info),
      rpttype:this.finalcarttype,
     // jData: JSON.stringify({ filter: this.assign.filter, info: this.assign }),
      name: this.assign.reportFileName,
      id: reqID,
      defaultdays:this.defaultdays,
      yAddvance:yaddvanceaaray.substring(0,yaddvanceaaray.length-1)+'}'
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
    console.log('complete data', this.assign,this.dynamicflag)
    this.assign.y.forEach(ele => {
      if (!ele.measure) {
        ele.measure = 'Count';
      }
    });
    // console.log('data to send',this.assign.data)
    // return;
    let xnewaaray = [];
    this.assign.x.map((data)=>{
      let xarray ={
        r_coltitle:data.r_coltitle,
        r_colcode:data.r_colcode,
        measure:data.measure
      };
      xnewaaray.push(xarray);
    });

    let ynewaaray = [];
    this.assign.y.map((data)=>{
      let xarray ={
        r_coltitle:data.r_coltitle,
        r_colcode:data.r_colcode,
        measure:data.measure
      };
      ynewaaray.push(xarray);
    });
    let yaddvanceaaray = '{';
    if(this.assign.yAddvance.length){
    this.assign.yAddvance.map((data)=>{
      if(data.r_coltype == 'operator'){
        if(data.measure == 'c' || data.measure == 's'){
           console.log('operator true',data);
          yaddvanceaaray += data.r_colcode+',' ;
        }else{
          console.log('operator false',data);
          yaddvanceaaray += data.measure+',' ;
        }
      }else{
        yaddvanceaaray += data.r_colcode+','+data.measure+',' ;
      }
    });
    }
    
    //let info = { x: this.assign.x, y: this.assign.y };
    let info = { x: xnewaaray, y: ynewaaray  };

    let newfilter=[];
    if(this.assign.filter){
      this.assign.filter.map((data)=>{
        let arrstring='';
        let xarray:any;
        if(this.dynamicflag == 0){
        data['filterdata'].map((fldata)=>{
          console.log('fffl data',fldata);
          fldata['r_threshold'][0]['r_value'].map((miningdata)=>{
          console.log('fffl data2',miningdata);

          if(miningdata['status']){
            arrstring += `''`+miningdata.value+`'',`;
          }
        })
        });
        console.log('arr',arrstring);

        
         xarray ={
          r_coltitle:data.r_coltitle,
          r_colcode:data.r_colcode,
          measure:data.dynamicfilterval,//'in'
          data:'['+(arrstring).slice(0, -1)+']'
        };
      }
      else{
        console.log('type of',typeof(data.data));
            if(typeof(data.data) == 'string'){
            xarray ={
              r_coltitle:data.r_coltitle,
              r_colcode:data.r_colcode,
              measure:data.measure,//'in'
              data:data.data
            };
            }else{
              data.data.map((nrdata)=>{
                if(nrdata['status']){
                  arrstring += `''`+nrdata.value+`'',`;
                }
              })
              xarray ={
                r_coltitle:data.r_coltitle,
                r_colcode:data.r_colcode,
                measure:data.measure,//'in'
                data:'['+(arrstring).slice(0, -1)+']'
              };
            }
      }
        newfilter.push(xarray);
      });
    }
    let params = {
      reportFilter: this.assign.filter ? JSON.stringify(newfilter) : [],
      info: JSON.stringify(info),
      startTime: this.common.dateFormatter(this.assign.startDate),
      endTime: this.common.dateFormatter(this.assign.endDate),
      yAddvance:yaddvanceaaray.substring(0,yaddvanceaaray.length-1)+'}'
    };

    if (this.assign.x.length && this.assign.y.length) {
      this.common.loading++;
      this.api.post('GraphicalReport/getPreviewGraphicalReport', params).subscribe(res => {
        this.common.loading--;
        if (res['code'] == 1) {
          console.log('Response:', res);
          if (res['data']['data']) {
           let dummmy = res['data'];
            
            let xname = dummmy.x;
            let INIyname = dummmy.y;
            let reviewdata=[];
            INIyname.map((yname,intialindex)=>{
            
              let seriesmultiple =[];
            dummmy.data.map((rundata,index)=>{
              console.log('run data',rundata,yname);
            let nextdata=  {
                "x":index+1,
                "y":rundata[yname],
                "name":rundata['x'],
              }
              seriesmultiple.push(nextdata);
            });
           let freshdata = {
             "xAxis":"["+dummmy.xAxis+"]",
             "series":{
             "data":seriesmultiple,
             "y_name":yname
             }
           }
            reviewdata.push(freshdata);
            //console.log('freshdata',freshdata);
          });
          console.log('unique',reviewdata); 

            this.reportPreviewData = reviewdata;

            this.review();
          } else {
            // this.resetAssignForm();
            document.getElementById('table').style.display = 'none';
            document.getElementById('graph').style.display = 'none';
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
    console.log('chart data length',this.assign.x.length,this.assign.y.length)
    // if (this.assign.y.length > 1 || this.assign.x.length > 1) {
    //   console.log('chart data length 0',this.assign.x.length,this.assign.y.length)
  
    //     this.blurChartImage([true, false, false, false, false]);
    //   } 
    if (this.assign.x.length > 1) {
    console.log('chart data length 0',this.assign.x.length,this.assign.y.length)
      this.blurChartImage([true, false, false, false, false,true]);
    } else if (this.assign.y.length == 1) {
    console.log('chart data length 1--',this.assign.x.length,this.assign.y.length)
      this.blurChartImage([false, false, false, true, false,true]);
    }else if (this.assign.y.length == 2) {
      console.log('chart data length 2==',this.assign.x.length,this.assign.y.length)
        this.blurChartImage([true, false, false, false, false,false]);
      } 
      else if (this.assign.y.length > 2) {
        console.log('chart data length ~~',this.assign.x.length,this.assign.y.length)
          this.blurChartImage([true, false, false, false, false,true]);
        } 
      else {
    console.log('chart data length 3',this.assign.x.length,this.assign.y.length)
      this.blurChartImage([false, false, false, false, false,true]);
    }
    console.log('chart data', this.reportPreviewData,this.selectedChart)
    // this.showChart(this.reportPreviewData,'pie');
    this.getChartofType(this.selectedChart);
  }

  getChartofType(chartType) {
    // if(this.reportPreviewData.length>0){
    if (chartType === 'table') {
      this.finalcarttype = chartType;
      document.getElementById('table').style.display = 'block';
      document.getElementById('graph').style.display = 'none';
      this.getTable(this.reportPreviewData);
    } else {
      document.getElementById('table').style.display = 'none';
      document.getElementById('graph').style.display = 'block';
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
    console.log('data after end:', stateTableData,this.assign);

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
    }else if (chartType === 'bar-line') {
      dataSet.map((data, index) => {
        console.log('bar-line',data,dataSet.length);
        if(index == 0){
        chartDataSet.push({
          type: 'bar',
          label: data.label,
          data: data.data,
          borderWidth: 1,
          lineTension: 0,
          borderColor: data.bgColor[index] ? data.bgColor[index] : '#33FF83',
          yAxisID: 'y-axis-1',
          fill: true,
          borderDash: (data.yAxesGroup == 'y-right' ? [5, 5] : [5, 0])
        })
      }else if(index == 1){
        chartDataSet.push({
          type: 'line',
          label: data.label,
          data: data.data,
          borderWidth: 1,
          lineTension: 0,
          borderColor: data.bgColor[index] ? data.bgColor[index] : '#FFA233',
          yAxisID: 'y-axis-2',
          fill: false,
          borderDash: (data.yAxesGroup == 'y-right' ? [5, 5] : [5, 0])
        })
      }
      });
    } else {
      dataSet.map((data, index) => {
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
        canvas: document.getElementById('Graph'),
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
        if(chartType == 'bar-line'){
          yAxes.push({
            type: "linear",
            display: true,
            position: "left",
            id: "y-axis-1",
            gridLines:{
                display: false
            },
            labels: {
                show:true,
                
            },
            scaleLabel: {
              display: true,
              labelString: yLeftTitle.split('AND')[0]
            },
        });
        yAxes.push({
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-2",
            gridLines:{
                display: false
            },
            labels: {
                show:true,
                
            },
            scaleLabel: {
              display: true,
              labelString: yLeftTitle.split('AND')[1]
            },
        });
        }else{
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
      }
      chartData = {
        canvas: document.getElementById('Graph'),
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
    this.showLedgend = (type == 'pie')? "yes":'no';
    this.legendPosition = (type == 'pie')? "right":'top';
   let labdata =  {
      fontSize: 11,
      padding:  3,
      boxWidth: 22,
      boxHeight:60
    };

    this.finalcarttype = type;
    charDatas.forEach(chartData => {
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
