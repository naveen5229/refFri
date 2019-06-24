import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'battery-inventory',
  templateUrl: './battery-inventory.component.html',
  styleUrls: ['./battery-inventory.component.scss']
})
export class BatteryInventoryComponent implements OnInit {

  csv = null;
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
  searchedTyreDetails = [];
  userType = null;
  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public user: UserService
  ) {
    console.log("user", user._loggedInBy);
    this.userType = this.common.user._loggedInBy;
    //this.searchData();
  }

  ngOnInit() {
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


  // getTyreSize(batsize, i) {
  //   this.inventories[i].batterySize = batsize.size;
  // }

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

  // searchData() {
  //   let params = this.inventories;
  //   console.log("params ", params)
  //   this.api.get('Tyres/getTyreDetailsAccordingFO?')
  //     .subscribe(res => {
  //       this.searchedTyreDetails = res['data'];
  //       console.log("searchedTyreDetails", this.searchedTyreDetails);

  //     }, err => {
  //       console.error(err);
  //       this.common.showError();
  //     });

  // }

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

  // valueReset(index) {
  //   console.log("change event", index);
  //   this.inventories[index].nsd1 = null;
  //   this.inventories[index].nsd2 = null;
  //   this.inventories[index].nsd3 = null;
  //   this.inventories[index].psi = null;
  // }

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
