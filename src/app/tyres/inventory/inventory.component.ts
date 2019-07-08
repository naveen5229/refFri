import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { StockitemComponent } from '../../acounts-modals/stockitem/stockitem.component';
import { StockSubtypeComponent } from '../../acounts-modals/stock-subtype/stock-subtype.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss', '../../pages/pages.component.css', '../tyres.component.css']
})
export class InventoryComponent implements OnInit {
  csv = null;
  inventories = [{
    modelName: null,
    modelId: null,
    modelBrand: null,
    tyreNo: null,
    date1: this.common.dateFormatter(new Date()),
    searchModelString: null,
    is_health: false,
    nsd1: null,
    nsd2: null,
    nsd3: null,
    psi: null,
    tyreSize: null
  },
  {
    modelName: null,
    modelId: null,
    modelBrand: null,
    tyreNo: null,
    date1: this.common.dateFormatter(new Date()),
    searchModelString: null,
    is_health: false,
    nsd1: null,
    nsd2: null,
    nsd3: null,
    psi: null,
    tyreSize: null
  },
  {
    modelName: null,
    modelId: null,
    modelBrand: null,
    tyreNo: null,
    date1: this.common.dateFormatter(new Date()),
    searchModelString: null,
    is_health: false,
    nsd1: null,
    nsd2: null,
    nsd3: null,
    psi: null,
    tyreSize: null
  }];

  activeRow = -1;
  modelSuggestion = false;
  models = [];
  sizeSuggestion = [];
  searchedTyreDetails = [];
  userType = null;
  typeListId = -1;

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
  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public user: UserService
  ) {
    console.log("user", user._loggedInBy);
    this.userType = this.common.user._loggedInBy;
    this.searchData();
    this.getviewData();
  }

  ngOnInit() {
  }

  searchModels(searchModelString, index) {
    this.modelSuggestion = true;
    let params = 'search=' + searchModelString;
    this.activeRow = index;
    if (searchModelString.length > 2) {
      setTimeout(() => {    //<<<---    using ()=> syntax

        console.log("length=", searchModelString.length);
        this.api.get('Suggestion/getTyreNamesWithBrands?' + params) // Customer API
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
    this.inventories[index].modelName = model.name;
    this.inventories[index].modelId = model.item_id;
    this.inventories[index].modelBrand = model.brand;
    this.inventories[index].searchModelString = this.inventories[index].modelName + " : " + this.inventories[index].modelBrand;

    this.modelSuggestion = false;
  }

  testFilledData() {

    let alerts = false;
    let count = this.inventories.length;
    let afterRemove = [];
    for (let i = 0; i < count; i++) {
      console.log("tyreno", this.inventories[i].tyreNo);
      if (this.inventories[i].tyreNo) {
        afterRemove.push(this.inventories[i]);
      }
    }
    // console.log("inv",afterRemove);
    this.inventories = afterRemove;
    for (let i = 0; i < this.inventories.length; i++) {
      this.inventories[i].date1 = this.common.dateFormatter(new Date(this.inventories[i].date1));
      if ((this.inventories[i].is_health == true) && ((!this.inventories[i].nsd1) || (!this.inventories[i].nsd2) || (!this.inventories[i].nsd3) || (!this.inventories[i].psi))) {
        alerts = true;
        break;
      }

    }
    if (alerts == true) {
      alert("NSD-1 , NSD-2 , NSD-3 , PSI fields are mandatory is  Is_Health is Checked");
    }
    else {
      this.saveDetails();
    }

  }

  getDate(index) {
    this.common.params = { ref_page: "Inventory" };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.inventories[index].date1 = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.inventories[index].date1);
    });
  }

  size(i) {
    console.log('size-' + i);
    this.inventories[i].tyreSize = document.getElementById('size-' + i)['value'];
  }

  getTyreSize(tsize, i) {
    this.inventories[i].tyreSize = tsize.size;
  }

  saveDetails() {
    this.common.loading++;
    let params = { inventories: JSON.stringify(this.inventories) };//JSON.stringify(this.inventories) ;
    console.log('Params:', params);
    this.api.post('Tyres/saveTyreMaster', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("return id ", res['data'][0].rtn_id);
        if (res['data'][0].rtn_id > 0) {
          this.common.showToast("sucess");
        } else {
          this.common.showError(res['data'][0].rtn_msg);
        }
        //this.searchData();
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  searchData() {
    let params = this.inventories;
    console.log("params ", params)
    this.api.get('Tyres/getTyreDetailsAccordingFO?')
      .subscribe(res => {
        this.searchedTyreDetails = res['data'];
        console.log("searchedTyreDetails", this.searchedTyreDetails);

      }, err => {
        console.error(err);
        this.common.showError();
      });

  }

  addMore() {
    this.inventories.push({
      modelName: null,
      modelId: null,
      modelBrand: null,
      tyreNo: null,
      date1: this.common.dateFormatter(new Date()),
      searchModelString: null, is_health: false,
      nsd1: null,
      nsd2: null,
      nsd3: null,
      psi: null,
      tyreSize: null
    });
  }

  remove() {
    this.inventories.pop();
  }

  valueReset(index) {
    console.log("change event", index);
    this.inventories[index].nsd1 = null;
    this.inventories[index].nsd2 = null;
    this.inventories[index].nsd3 = null;
    this.inventories[index].psi = null;
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

  typeList() {
    console.info("Data", this.typeListId);
    this.getviewData();
  }
  getviewData() {
    let params = {
      // startTime: this.common.dateFormatter(this.startTime),
      // endTime: this.common.dateFormatter(this.endTime)
    }
    console.log("params", params);
    ++this.common.loading;

    this.api.get('tyres/getTyreInventry?mapped=' + this.typeListId)
      .subscribe(res => {
        --this.common.loading;
        this.data = [];
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

        if (!res['data']) return;
        this.data = res['data'];
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
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }
  getTableColumns() {

    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};

      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };

      }
      columns.push(this.valobj);

    });

    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }



}

