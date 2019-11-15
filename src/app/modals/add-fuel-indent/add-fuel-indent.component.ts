import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'add-fuel-indent',
  templateUrl: './add-fuel-indent.component.html',
  styleUrls: ['./add-fuel-indent.component.scss']
})
export class AddFuelIndentComponent implements OnInit {
  title = '';
  button = '';
  isFormSubmit = false;
  fuelIndent: FormGroup;
  vehicleTypes = [
    { name: 'Own', id: 1 },
    { name: 'Group', id: 2 },
    { name: 'Market', id: 3 },
  ];

  dropDownRefTypes = {
    1: [{ name: 'LR', id: 11 }, { name: 'Manifest', id: 12 }, { name: 'States', id: 13 }, { name: 'Trip', id: 14 }],
    2: [{ name: 'LR', id: 11 }, { name: 'Manifest', id: 12 }],
    3: [{ name: 'LR', id: 11 }, { name: 'Manifest', id: 12 }]
  };

  fuelIndentData = this.setFuelIndent();
  refTypeResults = [];
  indentType = '1';
  fuelStations = [];
  refData = {
    type: null,
    id: null,
  };
  edit = false;
  index = 0;
  fuelData = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      tableHeight: "58vh",
    }
  };
  selectModalTypeId = '0';
  apiUrl = "Fuel/addFuelIndent";
  branchList = [];

  constructor(public activeModel: NgbActiveModal,
    public api: ApiService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public common: CommonService) {
    this.getFuelStationList();
    this.getBranchList();
    this.index = this.common.params.index;
    this.common.handleModalSize('class', 'modal-lg', '900', 'px', this.index);
    if (this.common.params && this.common.params.title) {
      this.title = this.common.params.title;
      this.button = this.common.params.button;
    }
    if (this.common.params && this.common.params.editFuelData) {
      this.edit = true;
      this.fuelIndentData.rowId = this.common.params.editFuelData._id ? this.common.params.editFuelData._id : null;
      this.fuelIndentData.issueDate = new Date(this.common.dateFormatter(this.common.params.editFuelData._issue_date));
      this.fuelIndentData.expiryDate = new Date(this.common.dateFormatter(this.common.params.editFuelData._expiry_date));
      this.fuelIndentData.fuelId = this.common.params.editFuelData._fsid;
      this.fuelIndentData.regno = this.common.params.editFuelData.regno;
      this.fuelIndentData.vehicleId = this.common.params.editFuelData._vid;
      this.fuelIndentData.vehicleType = this.common.params.editFuelData._vehasstype;
      this.fuelIndentData.remark = this.common.params.editFuelData.Remarks;
      this.fuelIndentData.amount = this.common.params.editFuelData.Amount ? this.common.params.editFuelData.Amount : this.common.params.editFuelData.Fuel;
      this.indentType = this.common.params.editFuelData.Amount ? '0' : '1';
      this.fuelIndentData.refTypeSourceId = this.common.params.editFuelData._ref_id;
      this.fuelIndentData.refType = this.common.params.editFuelData._ref_type;
      this.fuelIndentData.refName = this.common.params.editFuelData._ref_name;
      this.fuelIndentData.ledgerId = this.common.params.editFuelData._ledger_id;
      this.fuelIndentData.branchId = this.common.params.editFuelData._branchid;
      this.fuelIndentData.branchName = this.common.params.editFuelData['Branch Name'];
      if (this.fuelIndentData.ledgerId) {
        this.fuelIndentData.ledgerName = this.common.params.editFuelData['Ledger Name'];
        this.selectModalTypeId = '1';
      }
    }

    if (this.common.params && this.common.params.refData) {
      this.edit = true;
      this.refData.type = this.common.params.refData.refType;
      this.refData.id = this.common.params.refData.refId;
      this.getReferenceData();
      if (!this.fuelIndentData.ledgerId) {
        this.getFuelIndent();
      }
    }
  }

  ngOnInit() {
    if (!this.fuelIndentData.rowId) {
      this.fuelIndent = this.formBuilder.group({
        vehicleType: [''],
        regno: ['', Validators.required],
        refType: [''],
        refTypeSource: [''],
        indentTypeValue: ['', Validators.required],
        fuelStation: [''],
        ledger: ['']
      });
    } else {
      this.fuelIndent = this.formBuilder.group({
        refTypeSource: [''],
        indentTypeValue: ['', Validators.required],
        fuelStation: [''],
        ledger: ['']
      });
    }

  }
  ngOnDestroy() {
    this.common.params = null;
  }

  setFuelIndent() {
    return {
      rowId: null,
      vehicleType: 1,
      vehicleId: null,
      regno: null,
      amount: null,
      fuelId: null,
      issueDate: new Date(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      remark: '',
      refType: null,
      refTypeSourceId: null,
      refName: null,
      ledgerId: null,
      ledgerName: null,
      branchId: null,
      branchName: '',
    }
  };
  resetData() {
    this.setFuelIndent();
    document.getElementById('regno')['value'] = '';
    document.getElementById('refType')['value'] = '-1';
    document.getElementById('refTypeSource')['value'] = '';
    document.getElementById('refTypeSource')['value'] = '';
    document.getElementById('indentTypeValue')['value'] = null;
    (<HTMLInputElement>document.getElementById('indentTypeValue')).value = '';
    document.getElementById('branchId')['value'] = null;
  }

  changeModal(type) {
    this.indentType = '0';
    console.log("Indent Type", this.indentType);
    this.selectModalTypeId = type;
    this.resetData();
    console.log(this.apiUrl);
    return this.apiUrl;
  }
  get f() {
    return this.fuelIndent.controls;
  }

  closeModal() {
    this.activeModal.close(false);
  }

  selectVehicle(vehicle) {
    this.fuelIndentData.vehicleId = vehicle.id;
    this.fuelIndentData.regno = vehicle.regno;
    this.fuelIndentData.refType = "-1";
  }

  handleVehicleTypeChange() {
    this.fuelIndentData.refType = "-1";
    this.fuelIndentData.vehicleId = null;
    this.fuelIndentData.regno = null;
  }

  selectRefType(type) {
    this.fuelIndentData.refType = type.target.value;
    console.log(">>>>>>>", this.fuelIndentData.refType);
    this.selectedlist(this.fuelIndentData.refType);
  }

  selectedlist(type) {
    const params = {
      vid: this.fuelIndentData.vehicleId,
      regno: this.fuelIndentData.regno,
    };
    let url = null;
    let refType = '';
    switch (type) {
      case '11':
        url = "Suggestion/getLorryReceipts";
        refType = 'Lr Data is not available you can\'t Add Data';
        break;
      case '12':
        url = "Suggestion/getLorryManifest";
        refType = 'Manifest Data is not available you can\'t Add Data';
        break;
      case '13':
        url = "Suggestion/getVehicleStates";
        refType = 'State Data is not available you can\'t Add Data ';
        break;
      default:
        url = null;
        return;
    }
    this.api.post(url, params)
      .subscribe(res => {
        this.refTypeResults = res['data'];
        if (this.refTypeResults.length == 0) {
          this.common.showError(refType);
          return;
        }
      }, err => {
        console.log(err);
      });
  }

  selectRefTypeSource(source) {
    this.fuelIndentData.refTypeSourceId = source.target.value;
  }

  getFuelStationList() {
    this.api.get("Suggestion/getFuelStaionWrtFo").subscribe(
      res => {
        this.fuelStations = res['data'];
      },
      err => {
        console.log(err);
      }
    );
  }

  selectLedger(ledger) {
    this.fuelIndentData.ledgerId = ledger.id;
    return this.fuelIndentData.ledgerId;
  }

  getBranchList() {
    this.api.get("Suggestion/GetBranchList").subscribe(
      res => {
        console.log("Branch List", res['data']);
        this.branchList = res['data'];
      },
      err => {
        console.log(err);
      }
    );
  }


  saveFuelIndent() {
    console.log("hello m aa gya hu");

    if (this.fuelIndentData.issueDate == null && this.fuelIndentData.expiryDate == null) {
      this.common.showToast("Select Date");
    }
    if (this.fuelIndentData.issueDate > this.fuelIndentData.expiryDate) {
      this.common.showError("Enter Valid  Date");
      return;
    }
    if (this.selectModalTypeId === '1') {
      this.apiUrl = "Fuel/addCashIndent";
    }
    else {
      this.apiUrl = "Fuel/addFuelIndent";
    }
    const params = {
      rowid: this.fuelIndentData.rowId ? this.fuelIndentData.rowId : null,
      vid: this.fuelIndentData.vehicleId,
      vehasstype: this.fuelIndentData.vehicleType,
      regno: this.fuelIndentData.regno,
      ref_name: this.fuelIndentData.refName ? this.fuelIndentData.refName : null,
      reftype: this.fuelIndentData.refType,
      refid: this.fuelIndentData.refTypeSourceId,
      amt: this.indentType == '0' ? this.fuelIndentData.amount : null,
      remarks: this.fuelIndentData.remark,
      ltr: this.indentType == '1' ? this.fuelIndentData.amount : null,
      issueDate: this.common.dateFormatter(this.fuelIndentData.issueDate),
      expDate: this.common.dateFormatter(this.fuelIndentData.expiryDate),
      fsid: this.fuelIndentData.fuelId,
      ledgerId: this.fuelIndentData.ledgerId,
      branchId: this.fuelIndentData.branchId
    };
    console.log("Params", params);
    let result: any;
    return;
    this.common.loading++;
    this.api.post(this.apiUrl, params)
      .subscribe(res => {
        this.common.loading--;
        if (this.selectModalTypeId == '0') {
          console.log('Fuel Indent :::::::')
          if (res['data'][0].y_id > 0) {
            this.common.showToast(res['data'][0].y_msg);
            result = res['data'];
            this.activeModal.close({ response: result });
          } else {
            this.common.showError(res['data'][0].y_msg)
          }
        }
        else if (this.selectModalTypeId == '1') {
          if (res['success']) {
            this.common.showToast(res['msg']);
            console.log('Cash Indent :::::::')
            this.activeModal.close({ response: 'success' });
          } else {
            this.common.showError(res['msg']);
          }

        }

      },
        err => console.error('Api Error:', err));
  }

  getReferenceData() {
    if (!this.fuelIndentData.rowId) {
      const params = "id=" + this.refData.id +
        "&type=" + this.refData.type;
      this.api.get('Vehicles/getRefrenceDetails?' + params)
        .subscribe(res => {
          console.log("using refID:", res['data']);
          let resultData = res['data'][0];
          this.fuelIndentData.vehicleId = resultData.vid;
          this.fuelIndentData.regno = resultData.regno;
          this.fuelIndentData.refName = resultData.ref_name;
          this.fuelIndentData.vehicleType = resultData.vehasstype;
          this.fuelIndentData.refType = this.dropDownRefTypes['1'].find(element => { return element.id == 14; }).id;
          this.fuelIndentData.refTypeSourceId = 7457;
          console.log(".............", this.fuelIndentData.refType);
        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
  }

  getFuelIndent() {
    const params = "startdate=" + this.common.dateFormatter1(new Date(new Date().setDate(new Date(new Date).getDate() - 7)))
      + "&enddate=" + this.common.dateFormatter1(new Date) + "&addedBy=" + null +
      "&status=" + -2 + "&regno=" + this.fuelIndentData.regno
      + "&refType=" + this.refData.type + "&refId=" + this.refData.id;
    ++this.common.loading;
    this.api.get('Fuel/getPendingFuelIndentWrtFo?' + params)
      .subscribe(res => {
        --this.common.loading;
        this.fuelData = res['data'];
        if (this.fuelData == null) {
          this.fuelData = [];
          return;
        }
        this.fuelData.length ? this.setTable() : this.resetTable();

      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  resetTable() {
    this.table.data = {
      headings: {},
      columns: []
    };
  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(),
      columns: this.getTableColumns()
    };
    return true;
  }

  generateHeadings() {
    let headings = {};
    for (var key in this.fuelData[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: key, placeholder: this.formatTitle(key) };
      }
    }
    return headings;
  }

  getTableColumns() {
    let columns = [];
    this.fuelData.map(fuel => {
      let column = {};
      for (let key in this.generateHeadings()) {
        column[key] = { value: fuel[key], class: 'black', action: '' };
      }
      columns.push(column);
    })
    return columns;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

}