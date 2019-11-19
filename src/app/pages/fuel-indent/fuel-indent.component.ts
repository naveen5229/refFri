import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ReminderComponent } from '../../modals/reminder/reminder.component';
import { AddFuelIndentComponent } from '../../modals/add-fuel-indent/add-fuel-indent.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'fuel-indent',
  templateUrl: './fuel-indent.component.html',
  styleUrls: ['./fuel-indent.component.scss']
})
export class FuelIndentComponent implements OnInit {

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
  vehicleType = 0;
  vehicleStatus = 0;
  regno = null;

  dropDown1 = [
    { name: 'Self', id: 0 },
    { name: 'Company', id: 1 },
  ];

  dropDown2 = [
    { name: 'Pending', id: 0 },
    { name: 'Complete', id: 1 },
    { name: 'Reject', id: -1 },
    { name: 'All', id: -2 },

  ];

  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 7));
  indentType = '0';
  apiUrl = "Fuel/getPendingFuelIndentWrtFo?";
  constructor(public api: ApiService,
    private modalService: NgbModal,
    public user: UserService,
    public common: CommonService) {
    this.getFuelIndent();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.getFuelIndent();
  }

  getFuelIndent() {
    let startDate = this.common.dateFormatter1(this.startDate);
    let endDate = this.common.dateFormatter1(this.endDate);
    if (startDate > endDate) {
      this.common.showError("Start Date should less then End Date");
      return;
    }
    if (this.indentType == '0') {
      this.apiUrl = "Fuel/getPendingFuelIndentWrtFo?";
    } else {
      this.apiUrl = "Fuel/getPendingCashIndentWrtFo?";
    }
    const params = "startdate=" + this.common.dateFormatter1(this.startDate) + "&enddate=" + this.common.dateFormatter1(this.endDate) + "&addedBy=" + this.vehicleType + "&status=" + this.vehicleStatus + "&regno=" + this.regno;
    ++this.common.loading;
    this.api.get(this.apiUrl + params)
      .subscribe(res => {
        --this.common.loading;
        console.log('API Res:', res);
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
    // console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        // console.log("Type", this.headings[i]);
        // console.log("doc index value:", doc[this.headings[i]]);
        if (this.headings[i] == "Action") {
          console.log("Test");
          this.valobj[this.headings[i]] = { value: "", action: null, icons: this.actionIcons(doc) };
        } else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  actionIcons(fuel) {
    let icons = [
      { class: "fa fa-print", action: this.printReceipt.bind(this, fuel) }
    ];
    this.user.permission.edit && icons.push({ class: 'fa fa-edit', action: this.editFuelIndent.bind(this, fuel) });
    this.user.permission.delete && icons.push({ class: 'fa fa-trash', action: this.deleteFuelIndent.bind(this, fuel) });

    return icons;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  editFuelIndent(editFuelData) {
    console.log("Edit fuel Data", editFuelData);
    let refData = {
      refType: editFuelData._ref_type,
      refId: editFuelData._ref_id,
    };
    this.common.params = {
      title: 'Edit Fuel Indent',
      editFuelData: editFuelData,
      button: 'update',
      index: 0,
      refData: refData
    };
    const activeModal = this.modalService.open(AddFuelIndentComponent, { size: "lg", container: "nb-layout", backdrop: 'static' })
    activeModal.result.then(data => {
      if (data.response) {
        this.getFuelIndent();
      }
    });
  }



  deleteFuelIndent(fuel) {
    let deleteUrl = "Fuel/deleteFuelIndent";
    if (this.indentType == '0') {
      deleteUrl = "Fuel/deleteFuelIndent";
    }
    else {
      deleteUrl = "Fuel/deleteCashIndent";

    }
    const params = {
      rowid: fuel._id,
    }
    if (fuel._id) {
      this.common.params = {
        title: 'Delete Indent ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post(deleteUrl, params)
            .subscribe(res => {
              console.log('Api Response:', res)
              this.common.showToast(res['msg']);
              this.getFuelIndent();
              this.common.loading--;
            },
              err => console.error(' Api Error:', err));
        }
      });
    }
  }

  addFuelIndent() {
    this.common.params = {
      title: 'Add Fuel Indent',
      button: 'add',
      index: 0,

    };
    const activeModal = this.modalService.open(AddFuelIndentComponent, { size: "lg", container: "nb-layout", backdrop: 'static' })
    activeModal.result.then(data => {
      if (data.response) {
        this.getFuelIndent();
      }
    });
  }

  printReceipt(receipt) {
    console.log('Receipt:', receipt);
    let html = `
    <div style="padding: 20px 40px;/* background: #B2B2B2 !important; */width: 90%;margin: auto;margin-top: 30px;border: 2px solid #555;"><div _ngcontent-wbc-c12="" style="
    background: #fff;
    padding: 15px;
"><div style="text-align:center;"><span style="
    font-size: 35px;
    font-weight: 600;
">${receipt._fo_name}</span></div><div _ngcontent-wbc-c12="" style="text-align:center;margin-bottom: 30px;"><span _ngcontent-wbc-c12="" style="
    font-size: 18px;
    margin-bottom: 30px;
">${receipt._fo_address}</span></div><div _ngcontent-wbc-c12="" class="row" style="
    margin: 10px -15px;
    font-size: 20px;
"><div class="col" style="text-align:left"><span _ngcontent-wbc-c12="" style="
    font-weight: 600;
    margin-right: 10px;
">Ref No:</span><span>${receipt._ref_id}</span></div><div _ngcontent-wbc-c12="" class="col" style="text-align:right"><span _ngcontent-wbc-c12="" style="
    font-weight: 600;
    margin-right: 0px;
">Date:</span><span _ngcontent-wbc-c12="" style="
    border-bottom: 1px solid #000;
    padding-left: 7px;
">${receipt['Issue Date']}</span></div></div><div _ngcontent-wbc-c12="" style="
    margin-bottom: 10px;
    font-size: 20px;
    margin-top: 30px;
"><span _ngcontent-wbc-c12="" style="
    font-weight: 600;
    margin-right: 5px;
    display: inline-block;
    width: 30px;
    /* background: red; */
">To,</span><span _ngcontent-wbc-c12="" style="
    border-bottom: 1px solid #000;
    display: inline-block;
    width: calc(100% - 40px);
">${receipt['Fuel Station']}</span></div><div _ngcontent-wbc-c12="" style="
    font-size: 20px;
    margin-top: 30px;
"><span _ngcontent-wbc-c12="" style="
    font-weight: 600;
    margin-right: 5px;
    display: inline-block;
    width: 110px;
    /* background: red; */
">Vehicle No.</span><span _ngcontent-wbc-c12="" style="
    border-bottom: 1px solid #000;
    display: inline-block;
    width: calc(100% - 115px);
">${receipt.regno}</span></div><div _ngcontent-wbc-c12="" style="
    margin-bottom: 15px;
    padding-left: 115px;
    font-size: 14px;
    width: 70%;
"><span _ngcontent-wbc-c12="">Please Supply to the bearer the following on credit &amp; debit the cost of my/our account:-</span></div><table _ngcontent-wbc-c12="" class="table table-bordered" style="
    margin-top: 40px;
    border-color: #000 !important;
    border-width: 2px;
"><tbody _ngcontent-wbc-c12="" style="
    border: none;
"><tr _ngcontent-wbc-c12="" style="
    border: none;
"><td _ngcontent-wbc-c12="" style="
    border-left: none;
    border-top-width: 2px;
    border-bottom-width: 2px;
    padding-top: 30px;
    padding-bottom: 30px;
    border-color: #000 !important;
"><span _ngcontent-wbc-c12="" style="
    font-weight: 600;
    margin-right: 10px;
">${receipt._ledger_id ? 'CASH' : 'FUEL'}:</span><span _ngcontent-wbc-c12="" style="
    display: inline-block;
    width: 80%;
    padding-left: 10px;
">${receipt._ledger_id ? '₹' + receipt.Amount : receipt.Fuel + ' ltr'}</span></td><td _ngcontent-wbc-c12="" style="
    border-top-width: 2px;
    border-bottom-width: 2px;
    border-color: #000 !important;
"><span _ngcontent-wbc-c12=""></span></td></tr></tbody></table><div _ngcontent-wbc-c12="" class="row" style="
    margin-top: 80px;
    font-size: 16px;
    font-weight: bold;
"><div _ngcontent-wbc-c12="" class="col"><span _ngcontent-wbc-c12="">Sign. of Driver</span></div><div _ngcontent-wbc-c12="" class="col" style="
    text-align: right;
"><span _ngcontent-wbc-c12="">Signature with Stamp</span></div></div></div>
    </div>
    `;


    let ele = document.createElement('div');
    ele.id = "print-receipt";
    ele.className = "print-receipt";
    ele.innerHTML = html;
    ele.style.left = '0';
    ele.style.position = "absolute";
    ele.style.top = "0";
    ele.style.width = "100%";
    ele.style.height = "100%";
    ele.style.backgroundColor = "#fff";
    ele.style.zIndex = '9999999999999999999999';


    document.body.appendChild(ele);
    document.getElementsByTagName('ngx-app')[0]['style'].visibility = "hidden";

    window.print();
    let printWindowListener = setInterval(() => {
      if (document.readyState == "complete") {
        clearInterval(printWindowListener);
        document.getElementsByTagName('ngx-app')[0]['style'].visibility = "visible";
        let bodyElement = document.getElementsByTagName('body')[0];
        let printElement = document.getElementById('print-receipt');
        bodyElement.removeChild(printElement);
      }
    }, 200);

  }



}
