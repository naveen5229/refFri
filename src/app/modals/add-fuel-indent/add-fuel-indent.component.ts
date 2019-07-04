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
  Type: number = 1;
  vid = null;
  regno = null;
  rowid = null;
  value = null;
  issueDate = new Date();
  expiryTime = new Date(new Date().setDate(new Date(this.issueDate).getDate() + 15));
  amount = null;
  indentType = 1;
  amt = null;
  ltr = null;
  fsid = null;
  status = null;
  refid = null;
  refname = null;
  remark = null;
  source_dest = null;
  title = '';
  name = '';
  result = [];
  brands = [];
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
    1: [{ name: 'LR', id: 11 }, { name: 'Manifest', id: 12 }, { name: 'States', id: 13 }],
    2: [{ name: 'LR', id: 11 }, { name: 'Manifest', id: 12 }],
    3: [{ name: 'LR', id: 11 }, { name: 'Manifest', id: 12 }]

  };

  constructor(public activeModel: NgbActiveModal,
    public api: ApiService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public common: CommonService) {
    this.common.handleModalSize('class', 'modal-lg', '500');
    console.log("Title", this.common.params.flag);
    console.log("doc", this.common.params.doc);
    if (this.common.params.doc) {
      this.regno = this.common.params.doc.regno ? this.common.params.doc.regno : null;
      this.vid = this.common.params.doc._vid ? this.common.params.doc._vid : null;
      this.remark = this.common.params.doc.Remarks ? this.common.params.doc.Remarks : '--'
      this.vehicle.subType = this.common.params.doc._ref_type;
      this.vehicle.type = this.common.params.doc._vehasstype;
      this.source_dest = this.common.params.doc['Ref Details'];
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
        this.Type = this.common.params.doc._ref_type;
        this.selectedlist(this.Type);
        this.refid = this.common.params.doc._ref_id ? this.common.params.doc._ref_id : null;
      }

      this.name = this.common.params.doc['Fuel Station'];
      console.log("NAME123", this.name);
      this.rowid = this.common.params.doc._id;
      this.issueDate = new Date(this.common.dateFormatter(this.common.params.doc._issue_date));
      this.expiryTime = new Date(this.common.dateFormatter(this.common.params.doc._expiry_date));
    }

  }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      amount: ['', Validators.required],
      autosuggestion: ['', Validators.required],
      autosuggestion1: ['', Validators.required],
      dropDown: ['',],
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
    this.Type = type.target.value;
    console.log("type", this.Type);
    console.log("id", this.vid, this.regno);
    this.selectedlist(this.Type);

  }

  resetData() {
    document.getElementById('brand')['value'] = '';
  }

  selectedlist(Type) {
    if (Type == 11) {
      this.value = 1;
      const params = {
        vid: this.vid,
        regno: this.regno,
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
      const params = {
        vid: this.vid,
        regno: this.regno,
      };
      console.log("manifest", params);
      this.api.post('Suggestion/getLorryManifest', params)
        .subscribe(res => {
          this.brands = res['data'];
          console.log('res', this.brands)
        },
          err => console.error('Activity Api Error:', err));
    }
    if (Type == 13) {
      this.value = 1;
      const params = {
        vid: this.vid,
      };
      console.log("states", params);
      this.api.post('Suggestion/getVehicleStates', params)
        .subscribe(res => {
          this.brands = res['data'];
          // let data = res['data'];
          // for (const eleement in data) {
          //   if (data.hasOwnProperty(eleement)) {
          //     const thisdata = data[eleement];
          //     data[eleement]['source_dest'] = data[eleement]['loc_site'];
          //   }
          // }
          // this.brands = data;
          // console.log(' Api Response:', this.brands);
        },
          err => console.error('Activity Api Error:', err));
    }
  }

  // openReminderModal() {
  //   this.common.params = { title: "Target Time", returnData: true };
  //   const activeModal = this.modalService.open(ReminderComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     console.log("data", data);
  //     this.expiryTime = data.date;
  //    });
  // }

  submit() {
    if(this.issueDate==null){
      this.common.showToast("please enter issue Date");
    }
    else if(this.expiryTime==null){
      this.common.showToast("please enter expiryTime");
    }
    else if(this.issueDate < this.expiryTime) {
      this.amt = null;
      this.ltr = this.amount;
      if (this.vehicle.type == 3) {
        this.vid = null;
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
        console.log("Update")
        const params = {
          rowid: this.rowid,
          vid: this.vid,
          regno: this.regno,
          ref_name: this.source_dest,
          remarks: this.remark,
          vehasstype: this.vehicle.type,
          reftype: this.Type,
          refid: this.refid,
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
          vid: this.vid,
          regno: this.regno,
          ref_name: this.source_dest,
          remarks: this.remark,
          vehasstype: this.vehicle.type,
          reftype: this.Type,
          refid: this.refid,
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
    this.source_dest = details.source_dest;
    this.refid = details.id ? details.id : null;
    return this.refid;
  }

  handleVehicleTypeChange() {
    this.vehicle.subType = "-1";
    console.log('subtype', this.vehicle.subType);
    if (this.vehicle.type == 2 || this.vehicle.type == 3) {
      this.vid = null;
      this.regno = null;
      this.value = null;
    }
    console.log('___vid:', this.vid);
  }

  getVehicleList(vehlist) {
    console.log('vehlist', vehlist);
    this.vid = vehlist.id;
    this.regno = vehlist.regno;
    this.value = null;
    this.vehicle.subType = '-1';
    console.log('regno', this.regno, this.vid);
    return this.vid;

  }

  getFuelStation(stationList) {
    this.fsid = stationList.id;
    return this.fsid;
  }

  testFunction(){
    console.log('_______');
  }

}
