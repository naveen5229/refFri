import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { resolve } from 'path';

@Component({
  selector: 'vehicle-ledgers',
  templateUrl: './vehicle-ledgers.component.html',
  styleUrls: ['./vehicle-ledgers.component.scss']
})
export class VehicleLedgersComponent implements OnInit {

  vehList = [];
  selectedAll: false;
  vehLedgerList = [];
  underGroupRes = [];
  showList = false;
  repearLoop = false;
  underGroupDetails = {
    name: '',
    id: '',
    primarygroup_id: ''
  };
  // autoSuggestion = {
  //   underGroupData: [],
  //   Id: '',
  //   display: '',
  //   primaryId: ''
  // };

  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal) {
    this.getVehList();
    this.setAutoSuggestion();
  }

  ngOnInit() {
  }

  getVehList() {

    let params = {};
    this.common.loading++;
    this.api.post('Accounts/vehicleLedger', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.vehList = res['data'];
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  selectAll() {


    if (this.selectedAll) {
      for (var i = 0; i < this.vehList.length; i++) {
        this.vehList[i].selected = this.selectedAll;
        this.vehLedgerList.push(this.vehList[i].name)
      }
    } else {
      for (var i = 0; i < this.vehList.length; i++) {
        this.vehList[i].selected = false;
        this.vehLedgerList = [];
      }
    }
    console.log('vehLedgerList', this.vehLedgerList);

    console.log('select All', this.selectAll);
  }

  changeStatus(vehName) {
    console.log('index', vehName);
    this.vehLedgerList.push(vehName);
    console.log('vehList', this.vehLedgerList);
  }

  setAutoSuggestion() {

    let params = {
      search: 123
    };

    this.common.loading++;
    this.api.post('Suggestion/getAllUnderGroupData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.underGroupRes = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  searchGroupInfo() {
    this.showList = true;
    let input, filter, ul, li, i;
    input = document.getElementById('undergroup');
    filter = input.value;
    console.log('input', filter.toUpperCase());
    ul = document.getElementById("gorup_list");
    console.log('gl', ul);
    li = ul.getElementsByTagName('li');
    console.log('li', li);
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      let str = ' ' + li[i].textContent || li[i].innerText;
      //  console.log('str', str);
      str = str.toUpperCase();
      // let strVal = str.textContent || str.innerText;
      if (str.includes(filter.toUpperCase())) {
        li[i].style.display = "block";
        console.log('matches');
      } else {
        li[i].style.display = "none"
        console.log(' not match');
      }

    }


  }

  // onSelect(suggestion, activeId) {
  //   this.underGroupData.name = suggestion.name;
  //   console.log('suggestion', suggestion);
  // }




  async saveVehicleLedgerList() {
    let promises = [];

    for (let i = 0; i < this.vehLedgerList.length; i++) {
      const params = {
        name: this.vehLedgerList[i],
        alias_name: this.vehLedgerList[i],
        code: 'null',
        account_id: this.underGroupDetails.id,
        per_rate: 0,
        primarygroupid: 0,
        accDetails: 'null',
        branchname: 'null',
        branchcode: 'null',
        accnumber: 'null',
        creditdays: 0,
        openingbalance: 0.0,
        isdr: 'null',
        approved: 'null',
        deleteview: 'null',
        delete: 'null',
        x_id: 0,
        bankname: 'null',
        costcenter: 'null'
      };
      console.log('params', params);
      let promise = new Promise((resolve, reject) => {
        this.api.post('Accounts/InsertLedger', params)
          .subscribe(res => resolve(res['data']), err => reject(err));
      });
      promises.push(promise);
    }

    Promise.all(promises).then(res => {
      console.log('_______________Promise____________Output:', res);
    }).catch(err => {
      console.log('__________________Promise____________Error:', err);
    });

  }

  getGroupInfo(groupDetail) {
    this.underGroupDetails.name = groupDetail.name;
    this.underGroupDetails.id = groupDetail.id;
    this.underGroupDetails.primarygroup_id = groupDetail.primarygroup_id;
    console.log('detail group;;;;;;;', groupDetail);

  }
}
