import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { UserService } from '../../services/user.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'battery-inventory',
  templateUrl: './battery-inventory.component.html',
  styleUrls: ['./battery-inventory.component.scss']
})
export class BatteryInventoryComponent implements OnInit {

  csv = null;
  startDate = '';
  endDate = '';
  mapped = -1;
  data = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};
  inventories = [{
    modelId: null,
    months: null,
    batteryNo: null,
    buydate: this.common.dateFormatter(new Date()),
  },
  {
    modelId: null,
    months: null,
    batteryNo: null,
    buydate: this.common.dateFormatter(new Date()),
  },
  {
    modelId: null,
    months: null,
    batteryNo: null,
    buydate: this.common.dateFormatter(new Date()),
  }];

  activeRow = -1;
  modelSuggestion = false;
  models = [];
  sizeSuggestion = [];
  userType = null;
  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public user: UserService
  ) {
    console.log("user", user._loggedInBy);
    this.userType = this.common.user._loggedInBy;
    let today;
    today = new Date();
    this.endDate = this.common.dateFormatter(today);
    this.startDate = this.common.dateFormatter(new Date(today.setDate(today.getDate() - 7)));
    console.log('dates ', this.endDate, this.startDate)
    this.getBatteries();
    this.common.refresh = this.refresh.bind(this);
  
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    this.getBatteries();
  }

  searchModels(searchModelString, index) {
    this.modelSuggestion = true;
    let params = 'search=' + searchModelString + '&typeId=' + '-2';
    console.log('params', params);
    this.activeRow = index;
    if (searchModelString.length > 2) {
      setTimeout(() => {    //<<<---    using ()=> syntax

        console.log("length=", searchModelString.length);
        console.log('parmas', params);
        this.api.get('Suggestion/getBatteryNamesWithBrands?' + params) // Customer API
          // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
          .subscribe(res => {
            this.models = res['data'];
            console.log("suggestions", this.models);
          }, err => {
            console.error(err);
            this.common.showError();
          });
      }, 3000);
    }
  }

  selectModel(model, index) {
    console.log('model', model);
    //this.inventories[index].modelName = model.name;
    this.inventories[index].modelId = '' + model.item_id;
    this.inventories[index].months = model.max_limit;
    //this.inventories[index].searchModelString = this.inventories[index].modelName + " : " + this.inventories[index].modelBrand;
    this.modelSuggestion = false;
  }

  testFilledData() {

    let alerts = false;
    let count = this.inventories.length;
    let afterRemove = [];

    for (let i = 0; i < count; i++) {
      console.log("batteryno.", this.inventories[i].batteryNo);
      if (this.inventories[i].batteryNo == null && this.inventories[i].modelId != null) {
        this.common.showToast('fill battery number to continue');
        return;

      }
      else if (this.inventories[i].batteryNo != null && this.inventories[i].modelId != null) {
        if (this.inventories[i].months && this.inventories[i].months > 99) {
          this.common.showToast('warrenty month can not be exceeded 99');
          return;
        } else {
          afterRemove.push(this.inventories[i]);
        }

      }

    }


    console.log("inv", afterRemove);
    this.inventories = afterRemove;
    for (let i = 0; i < this.inventories.length; i++) {
      this.inventories[i].buydate = this.common.dateFormatter(new Date(this.inventories[i].buydate)).split(' ')[0];
    }
    this.saveDetails();

  }

  getDate(index) {
    this.common.params = { ref_page: "Inventory" };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.inventories[index].buydate = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.inventories[index].buydate);
    });
  }

  size(i) {
    console.log('size-' + i);
    this.inventories[i].batteryNo = document.getElementById('size-' + i)['value'];
  }



  saveDetails() {

    console.log('inventories', this.inventories);
    this.common.loading++;
    let params = { batterydetails: JSON.stringify(this.inventories) };//JSON.stringify(this.inventories) ;
    console.log('Params:', params);
    this.api.post('Battery/saveBatteryInventory', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("return id ", res['data'][0].r_id);
        if (res['data'][0].r_id > 0) {
          this.common.showToast("sucess");

          //this.addMore();
        } else {
          this.common.showError(res['data'][0].r_msg);
          this.addMore();
        }
        //this.searchData();
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  getDate2(type) {
    this.common.params = { ref_page: 'LrView' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {
          this.startDate = '';
          return this.startDate = this.common.dateFormatter1(data.date).split(' ')[0];
          console.log('fromDate', this.startDate);
        }
        else {

          this.endDate = this.common.dateFormatter1(data.date).split(' ')[0];
          // return this.endDate = date.setDate( date.getDate() + 1 )
          console.log('endDate', this.endDate);
        }

      }

    });


  }

  getBatteries() {
    var enddate = new Date(this.common.dateFormatter1(this.endDate).split(' ')[0]);
    let params = {
      startDate: this.common.dateFormatter1(this.startDate).split(' ')[0],
      endDate: this.common.dateFormatter1(enddate.setDate(enddate.getDate() + 1)).split(' ')[0],
      mapped: this.mapped
    };

    ++this.common.loading;
    this.api.post('Battery/getBatteryInventory', params)
      .subscribe(res => {
        --this.common.loading;
        this.data = res['data'];
        this.table = {
          data: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        this.valobj = {};
        // if (!this.data || !this.data.length) {
        //   //document.getElementById('mdl-body').innerHTML = 'No record exists';
        //   return;
        // }
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  addMore() {
    this.inventories.push({
      // modelName: null,
      modelId: null,
      months: null,
      batteryNo: null,
      buydate: this.common.dateFormatter(new Date()),
    });
  }

  remove() {
    this.inventories.pop();
  }

  handleFileSelection(event) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        this.common.loading--;
        let file = event.target.files[0];
        if (file.type != "text/csv") {
          alert("valid Format Are : CSV");
          return false;
        }

        res = res.toString().replace('vnd.ms-excel', 'csv');
        console.log('Base 64: ', res);
        this.csv = res;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }

  importCsv() {
    const params = {
      inventoryCsv: this.csv,
    };

    if (!params.inventoryCsv) {
      return this.common.showError("Select csv");
    }
    console.log("Data :", params);
    this.common.loading++;
    this.api.post('Tyres/importTyreInventoryCsv ', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("upload result", res);
        let successData = res['data']['s'];
        let errorData = res['data']['f'];
        console.log("error: ", errorData);
        alert(res["msg"]);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

}
