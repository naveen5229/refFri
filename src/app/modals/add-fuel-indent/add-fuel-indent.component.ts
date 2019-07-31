import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ReminderComponent } from '../reminder/reminder.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'add-fuel-indent',
  templateUrl: './add-fuel-indent.component.html',
  styleUrls: ['./add-fuel-indent.component.scss']
})
export class AddFuelIndentComponent implements OnInit {

  isFormSubmit = false;
  Form: FormGroup;
  reg = null;
  isFlag: boolean = true;
  rowid = null;
  refData = {
    id: null,
    type: 1,
    name: null,
    vehasstype: 1,
    regno: null,
    vid: null,
    typeName: null
  };
  fuelStations = [];
  value = null;
  source = '';
  issueDate = new Date();
  expiryTime = new Date(new Date().setDate(new Date(this.issueDate).getDate() + 3));
  amount = null;
  indentType = 1;
  amt = null;
  ltr = null;
  fsid = null;
  status = null;
  remark = null;
  sourceId = null;

  title = '';
  fuelId = null;
  result = [];
  brands = [];

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
  vehicle = {
    type: 1,
    subType: "-1"
  };

  dropDown = [
    { name: 'Own', id: 1 },
    { name: 'Group', id: 2 },
    { name: 'Market', id: 3 },
  ];

  dropDownSubType = {
    1: [{ name: 'LR', id: 11 }, { name: 'Manifest', id: 12 }, { name: 'States', id: 13 }, { name: 'Trip', id: 14 }],
    2: [{ name: 'LR', id: 11 }, { name: 'Manifest', id: 12 }],
    3: [{ name: 'LR', id: 11 }, { name: 'Manifest', id: 12 }]

  };

  constructor(public activeModel: NgbActiveModal,
    public api: ApiService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public common: CommonService) {
    this.getFuelStationList();
    this.common.handleModalSize('class', 'modal-lg', '900', 'px', 1);
    console.log("Title", this.common.params);
    if (this.common.params.doc) {
      this.fuelId = this.common.params.doc._fsid;
      console.log("fsname", this.fuelId);
      this.refData.regno = this.common.params.doc.regno ? this.common.params.doc.regno : null;
      this.getFuelIndent();
      this.refData.vid = this.common.params.doc._vid ? this.common.params.doc._vid : null;
      this.remark = this.common.params.doc.Remarks ? this.common.params.doc.Remarks : '--'
      this.vehicle.subType = this.common.params.doc._ref_type;
      this.vehicle.type = this.common.params.doc._vehasstype;
      this.sourceId = this.common.params.doc._ref_id;
      this.refData.name = this.common.params.doc['Ref Details'];
      if (this.common.params.doc.Fuel) {
        this.amount = this.common.params.doc.Fuel;
        this.indentType = 1;
        console.log('fuel:::::')
      } else {
        this.amount = this.common.params.doc.Amount;
        this.indentType = 0;
        console.log('amount:::::')
      }
      this.fsid = this.common.params.doc._fsid ? this.common.params.doc._fsid : null;
      if (this.common.params.doc._ref_id !== null) {
        this.value = 1;
        this.refData.type = this.common.params.doc._ref_type;
        this.selectedlist(this.refData.type);
        this.refData.id = this.common.params.doc._ref_id ? this.common.params.doc._ref_id : null;
      }
      this.rowid = this.common.params.doc._id;
      this.issueDate = new Date(this.common.dateFormatter(this.common.params.doc._issue_date));
      this.expiryTime = new Date(this.common.dateFormatter(this.common.params.doc._expiry_date));
    }
    if (this.common.params && this.common.params.refData) {
      this.refData.type = this.common.params.refData.refType;
      this.refData.id = this.common.params.refData.refId;
      this.getReferenceData();
      this.getFuelIndent();
    }
  }

  ngOnInit() {
    if (!this.refData.id)
      this.Form = this.formBuilder.group({
        amount: ['', Validators.required],
        autosuggestion: ['', Validators.required],
        autosuggestion1: ['', Validators.required],
        dropDown: ['',],
        source_dest: ['',],
        select1: ['',],
        dropDownsubtype: ['',],
      });
    else
      this.Form = this.formBuilder.group({
        amount: ['', Validators.required],
        autosuggestion1: ['', Validators.required],
        dropDown: ['',],
        source_dest: ['',],
        select1: ['',],
        dropDownsubtype: ['',],
      });
  }

  get f() {
    return this.Form.controls;
  }

  dismiss() {
    this.activeModel.close();

  }

  changeVehicleType(type) {
    this.refData.type = type.target.value;
    this.selectedlist(this.refData.type);

  }

  selectedlist(Type) {
    if (Type == 11) {
      this.isFlag = true;
      this.value = 1;
      const params = {
        vid: this.refData.vid,
        regno: this.refData.regno,
      };
      console.log("Lr", params);
      this.api.post('Suggestion/getLorryReceipts', params)
        .subscribe(res => {
          this.brands = res['data'];
          console.log('Activity Api Response:', res)
        },
          err => console.error('Activity Api Error:', err));
    }
    if (Type == 12) {
      this.value = 1;
      this.isFlag = true;
      const params = {
        vid: this.refData.vid,
        regno: this.refData.regno,
      };
      console.log("manifest", params);
      this.api.post('Suggestion/getLorryManifest', params)
        .subscribe(res => {
          this.brands = res['data'];
        },
          err => console.error('Activity Api Error:', err));
    }
    if (Type == 13) {
      this.value = 1;
      this.isFlag = true;
      const params = {
        vid: this.refData.vid,
      };
      this.api.post('Suggestion/getVehicleStates', params)
        .subscribe(res => {
          this.brands = res['data'];
        },
          err => console.error('Activity Api Error:', err));
    }
  }

  submit() {
    if (this.issueDate == null) {
      this.common.showToast("please enter issue Date");
    }
    else if (this.expiryTime == null) {
      this.common.showToast("please enter expiryTime");
    }
    else if (this.issueDate < this.expiryTime) {
      this.amt = null;
      this.ltr = this.amount;
      if (this.vehicle.type == 3) {
        this.refData.vid = null;
      }
      if (this.indentType == 0) {
        this.amt = this.amount;
        this.ltr = null;
      }
      else {
        this.amt = null;
        this.ltr = this.amount;
      }
      if (this.common.params.flag == 'Update') {
        const params = {
          rowid: this.rowid,
          vid: this.refData.vid,
          regno: this.refData.regno,
          ref_name: this.refData.name,
          remarks: this.remark,
          vehasstype: this.refData.vehasstype,
          reftype: this.refData.type,
          refid: this.refData.id,
          amt: this.amt,
          ltr: this.ltr,
          issueDate: this.common.dateFormatter(this.issueDate),
          expDate: this.common.dateFormatter(this.expiryTime),
          fsid: this.fsid
        }
        this.common.loading++;
        this.api.post('Fuel/addFuelIndent', params)
          .subscribe(res => {
            this.common.loading--;
            if (res['data'][0].y_id > 0) {
              this.common.showToast(res['data'][0].y_msg);
              this.result = res['data'];
              this.activeModal.close({ response: this.result });
            }
            else {
              this.common.showError(res['data'][0].y_msg)
            }


          },
            err => console.error('Api Error:', err));
        console.log("parameter", params);

      }
      else {
        const params = {
          rowid: null,
          vid: this.refData.vid,
          regno: this.refData.regno,
          ref_name: this.refData.name,
          remarks: this.remark,
          vehasstype: this.refData.vehasstype,
          reftype: this.refData.type,
          refid: this.refData.id,
          amt: this.amt,
          ltr: this.ltr,
          issueDate: this.common.dateFormatter(this.issueDate),
          expDate: this.common.dateFormatter(this.expiryTime),
          fsid: this.fsid
        }
        this.common.loading++;
        this.api.post('Fuel/addFuelIndent', params)
          .subscribe(res => {
            this.common.loading--;
            if (res['data'][0].y_id > 0) {
              this.common.showToast(res['data'][0].y_msg);
              this.result = res['data'];
              this.activeModal.close({ response: this.result });
            }
            else {
              this.common.showError(res['data'][0].y_msg)
            }
            console.log('Api Response:', res)
          },
            err => console.error('Api Error:', err));
        console.log("parameter", params);
      }

    }
    else {
      this.common.showToast("issueDate is always less then expiry date");
    }


  }

  getRefDetails(details) {
    console.log("refname", details);
    this.refData.id = details.target.value;
    this.isFlag = false;
  }

  handleVehicleTypeChange() {
    this.vehicle.subType = "-1";
    if (this.vehicle.type == 2 || this.vehicle.type == 3) {
      this.refData.vid = null;
      this.refData.regno = null;
      this.value = null;
    }
  }

  getVehicleList(vehlist) {
    this.refData.vid = vehlist.id;
    this.refData.regno = vehlist.regno;
    this.value = null;
    this.vehicle.subType = '-1';
    this.getFuelIndent();
    return this.refData.vid;
  }

  getFuelStation(stationList) {
    this.fsid = stationList.target.value;
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

  getFuelIndent() {
    const params = "startdate=" + this.common.dateFormatter1(new Date(new Date().setDate(new Date(new Date).getDate() - 7))) + "&enddate=" + this.common.dateFormatter1(new Date) + "&addedBy=" + null +
      "&status=" + -2 + "&regno=" + this.refData.regno + "&refType=" + this.refData.type + "&refId=" + this.refData.id;
    console.log("params", params);
    console.log("params", params);
    ++this.common.loading;
    this.api.get('Fuel/getPendingFuelIndentWrtFo?' + params)
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
        console.log("Type", this.headings[i]);
        console.log("doc index value:", doc[this.headings[i]]);


        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  getReferenceData() {
    const params = "id=" + this.refData.id +
      "&type=" + this.refData.type;
    this.api.get('Vehicles/getRefrenceDetails?' + params)
      .subscribe(res => {
        console.log(res['data']);
        let resultData = res['data'][0];
        this.refData.vid = resultData.vid;
        this.refData.regno = resultData.regno;
        this.refData.name = resultData.ref_name;
        this.refData.vehasstype = resultData.vehasstype
        this.refData.typeName = this.dropDownSubType['1'].find(element => { return element.id == 14; }).name;
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


}
