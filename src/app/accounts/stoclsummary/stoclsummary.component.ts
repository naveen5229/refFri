import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import * as _ from 'lodash';
import { AccountService } from '../../services/account.service';
import { UserService } from '../../services/user.service';
import { VoucherdetailComponent } from '../../acounts-modals/voucherdetail/voucherdetail.component';
import { OrderdetailComponent } from '../../acounts-modals/orderdetail/orderdetail.component';
import { TripdetailComponent } from '../../acounts-modals/tripdetail/tripdetail.component';
import { StockSummaryComponent } from '../../acounts-modals/stock-summary/stock-summary.component';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';

@Component({
  selector: 'stoclsummary',
  templateUrl: './stoclsummary.component.html',
  styleUrls: ['./stoclsummary.component.scss']
})
export class StoclsummaryComponent implements OnInit {
  vouchertypedata = [];
  branchdata = [];
  summaryreport = [];
  activedateid = '';
  selectedName = '';
  outStanding = {
    Date: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    endDate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    stockType: {
      name: 'All',
      id: 0
    },
    stockSubType: {
      name: 'All',
      id: 0
    },
    stockItem: {
      name: 'All',
      id: 0
    },
    wherehouse: {
      name: 'All',
      id: 0
    },
  };
warehouseid=0;
  active = {
    liabilities: {
      mainGroup: [],
      subGroup: [],
      branch: [],
      warehouse: [],
      item: [],
    }
  };

  StockTypeData = [];
  StockSubTypeData = [];
  StockIemData = [];
  StockWhereHouseData = [];
  ledgerData = [];
  voucherEntries = [];
  ledgerList = [];
  activeId = 'ledger';
  allowBackspace = true;
  showDateModal = false;
  f2Date = 'startDate';
  lastActiveId = '';
  headingName = '';
  selectedRow = -1;
  viewType = 'main';
  TripEditData = [];
  VoucherEditTime = [];
  pendingDataEditTme = [];
  tripExpDriver = [];
  tripExpenseVoucherTrips = [];
  isSingleClick: any;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public pdfService: PdfService,
    public csvService: CsvService,
    public accountService: AccountService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
    this.getStockTypeList();
    this.getWhereHouseList();
    this.setFoucus('stocktype');
    this.common.currentPage = 'Store Regiter';
  }

  activeGroup = [];

  ngOnInit() {
  }
  refresh() {
    this.getStockTypeList();
    this.getWhereHouseList();
    this.setFoucus('ledger');
  }

  getStockTypeList() {
    let params = {
      search: 123,
      all: 1
    };
    this.common.loading++;
    this.api.post('Suggestion/GetTypeOfStock', params)
      .subscribe(res => {
        this.common.loading--;
        this.StockTypeData = res['data'];
        console.log('Res stock type:', this.StockTypeData);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getWhereHouseList() {
   
    this.common.loading++;
    this.api.get('Suggestion/GetWareHouse?search=123&all=1')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.StockWhereHouseData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getStockSubtype(id) {
    let params = {
      stocktype: id
    };
    this.common.loading++;
    this.api.post('Suggestion/GetSearchStockType', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.StockSubTypeData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getStockItem(id) {
    let params = {
      stocksubtype: id
    };
    this.common.loading++;
    this.api.post('Suggestion/GetStockItemData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.StockIemData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  getStockSummary() {
    console.log('Ledger:', this.outStanding);
    let params = {
      data: this.outStanding,

    };

    this.common.loading++;
    this.api.post('Company/GetStockSummary', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerData = res['data'];
        this.generalizeData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.outStanding[date] = this.common.dateFormatternew(data.date).split(' ')[0];
      console.log(this.outStanding[date]);
    });
  }

  openVoucherDetail(voucherId, vouhercode) {
    console.log('vouher id', voucherId);
    this.common.params = {

      vchid: voucherId,
      vchcode: vouhercode
    }
    const activeModal = this.modalService.open(VoucherdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        return;
        //   if (stocksubType) {

        //     this.updateStockSubType(stocksubType.id, data.stockSubType);
        //     return;
        //   }
        //  this.addStockSubType(data.stockSubType)
      }
    });
  }
  openinvoicemodel(voucherId) {
    this.common.params = {
      invoiceid: voucherId,
      delete: 0,
      indexlg: 0
    };
    const activeModal = this.modalService.open(OrderdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        console.log('open succesfull');

        // this.addLedger(data.ledger);
      }
    });
  }
  pdfFunction() {
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
        // this.Vouchers = res['data'];
        let address = (res['data'][0]) ? res['data'][0].addressline + '\n' : '';
        let remainingstring1 = (res['data'][0]) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
        let remainingstring2 = (res['data'][0]) ? ', PAN No -  ' + res['data'][0].panno : '';
        let remainingstring3 = (res['data'][0]) ? ', GST NO -  ' + res['data'][0].gstno : '';

        let cityaddress = address + remainingstring1 + remainingstring3;
        let foname = (res['data'][0]) ? res['data'][0].foname : '';
        // this.common.getPDFFromTableIdnew('table', foname, cityaddress, '', '', 'Out Standing From :' + this.outStanding.startDate + ' To :' + this.outStanding.endDate);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  csvFunction() {
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
        // this.Vouchers = res['data'];
        let address = (res['data'][0]) ? res['data'][0].addressline + '\n' : '';
        let remainingstring1 = (res['data'][0]) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
        let remainingstring2 = (res['data'][0]) ? ', PAN No -  ' + res['data'][0].panno : '';
        let remainingstring3 = (res['data'][0]) ? ', GST NO -  ' + res['data'][0].gstno : '';

        let cityaddress = address + remainingstring1;
        let foname = (res['data'][0]) ? res['data'][0].foname : '';
        this.common.getCSVFromTableIdNew('balance-sheet', foname, cityaddress, '', '', remainingstring3);
        // this.common.getCSVFromTableIdNew('table',res['data'][0].foname,cityaddress,'','',remainingstring3);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  onSelected(selectedData, type, display) {

    this.outStanding[type].name = selectedData[display];
    this.outStanding[type].id = selectedData.id;
    if (type == 'stockType') {
      this.getStockSubtype(selectedData.id);
    }
    if (type == 'stockSubType') {
      this.getStockItem(selectedData.id);
    }
    if (type == 'wherehouse') {
    this.warehouseid=selectedData.id;
    }
    // console.log('order User: ', this.DayBook);
  }


  filterData(dayDatas) {
    let yCodes = [];
    // dayDatas.map(dayData => {
    //   if (yCodes.indexOf(dayData.y_particulars) !== -1) {
    //     dayData.y_particulars = 0;
    //   } else {
    //     yCodes.push(dayData.y_particulars);
    //   }
    // });
    return dayDatas;
  }

  generalizeData() {
    this.summaryreport = this.generateGroup(this.ledgerData, 'y_stockitem_type_name')
      .map(group => {
        group.data = this.generateGroup(group.data, 'y_stockitem_subtype_name')
          .map(group => {
            group.data = this.generateGroup(group.data, 'y_stockitem_name')
              .map(group => {
                group.data = this.generateGroup(group.data, 'y_fobranch_name')
                // .map(group => {
                // group.data = this.generateGroup(group.data, 'y_warehouse_name');
                return group;
                // })
                //return group;
              })
            return group;
          })
        return group;
      });
    console.log('summaryreport:', this.summaryreport);
    this.showAllGroups();
  }

  generateGroup(arr, groupBy) {
    let groups = _.groupBy(arr, groupBy);
    return Object.keys(groups).map(key => {
      return {
        name: key,
        data: groups[key]
      };
    });
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);

    if ((key == 'f2' && !this.showDateModal) && this.activeId.includes('Date')) {
      // document.getElementById("voucher-date").focus();
      // this.voucher.date = '';
      this.lastActiveId = this.activeId;
      this.setFoucus('voucher-date-f2', false);
      this.showDateModal = true;
      this.f2Date = this.activeId;
      this.activedateid = this.lastActiveId;
      return;
    } else if ((key == 'enter' && this.showDateModal)) {
      this.showDateModal = false;
      console.log('Last Ac: ', this.lastActiveId);
      this.handleVoucherDateOnEnter(this.activeId);
      this.setFoucus(this.lastActiveId);

      return;
    } else if ((key != 'enter' && this.showDateModal) && this.activeId.includes('startDate')) {
      return;
    }

    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('stocktype')) {
        this.setFoucus('stocksubtype');
      } else if (this.activeId.includes('stocksubtype')) {
        // this.outStanding.startDate = this.common.handleDateOnEnterNew(this.outStanding.startDate);
        this.setFoucus('stockItem');
      } else if (this.activeId.includes('stockItem')) {
        // this.outStanding.startDate = this.common.handleDateOnEnterNew(this.outStanding.startDate);
        this.setFoucus('wherehouse');
      } else if (this.activeId.includes('wherehouse')) {
        // this.outStanding.startDate = this.common.handleDateOnEnterNew(this.outStanding.startDate);
        this.setFoucus('Date');
      } else if (this.activeId.includes('endDate')) {
        // this.outStanding.endDate = this.common.handleDateOnEnterNew(this.outStanding.endDate);
        this.setFoucus('submit');
      } else if (this.activeId.includes('Date')) {
        // this.outStanding.endDate = this.common.handleDateOnEnterNew(this.outStanding.endDate);
        this.setFoucus('endDate');
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'Date') this.setFoucus('wherehouse');
      if (this.activeId == 'endDate') this.setFoucus('Date');
      if (this.activeId == 'wherehouse') this.setFoucus('stockItem');
      if (this.activeId == 'stockItem') this.setFoucus('stocksubtype');
      if (this.activeId == 'stocksubtype') this.setFoucus('stocktype');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if ((this.activeId == 'startDate' || this.activeId == 'endDate') && key !== 'backspace') {
      let regex = /[0-9]|[-]/g;
      let result = regex.test(key);
      if (!result) {
        event.preventDefault();
        return;
      }
    } else if (key != 'backspace') {
      this.allowBackspace = false;
    }
    if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.summaryreport.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.summaryreport.length - 1) this.selectedRow++;

    }
  }

  handleExpandation(event, index, type, section, parentIndex?, nextparent?, warehouse?) {
    console.log(event, index, type, section, parentIndex, nextparent, warehouse);
    event.stopPropagation();
    if (this.isSingleClick) {
      clearTimeout(this.isSingleClick);
    }
    this.isSingleClick = setTimeout(() => {
      if (this.isSingleClick) {
        if (this.active[type][section].indexOf(section + index + parentIndex + nextparent + warehouse) === -1) this.active[type][section].push(section + index + parentIndex + nextparent + warehouse)
        else {
          this.active[type][section].splice(this.active[type][section].indexOf(section + index + parentIndex + nextparent + warehouse), 1);
        }
      }
    }, 250)

  }

  handleVoucherDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'startDate') ? 'startDate' : 'endDate';
    if (this.outStanding[datestring].includes('-')) {
      dateArray = this.outStanding[datestring].split('-');
    } else if (this.outStanding[datestring].includes('/')) {
      dateArray = this.outStanding[datestring].split('/');
      separator = '/';
    } else {
      this.common.showError('Invalid Date Format!');
      return;
    }
    let date = dateArray[0];
    date = date.length == 1 ? '0' + date : date;
    let month = dateArray[1];
    month = month.length == 1 ? '0' + month : month;
    let year = dateArray[2];
    year = year.length == 1 ? '200' + year : year.length == 2 ? '20' + year : year;
    console.log('Date: ', date + separator + month + separator + year);
    this.outStanding[datestring] = date + separator + month + separator + year;
  }
  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
  }

  handleGroupView(index) {
    if (this.activeGroup.indexOf(index) !== -1) {
      this.activeGroup.splice(this.activeGroup.indexOf(index), 1);
      return;
    }
    this.activeGroup.push(index);
  }

  showAllGroups() {
    this.activeGroup = this.summaryreport.map((stocktype) => {
      let stocktypeopngqty = 0;
      let stocktypestokrecive = 0;
      let stocktypepurchasetotal = 0;
      let stocktypesalestotal = 0;
      let stocktypeissuetotal = 0;
      let stocktypewastagetotal = 0;
      let stocktypedebittotal = 0;
      let stocktypecredittotal = 0;
      let stocktypenettotal = 0;
      stocktype.data.map((stocksubtype) => {
        let stocksubtypeopngqty = 0;
        let stocksubtypestokrecive = 0;
        let stocksubtypepurchasetotal = 0;
        let stocksubtypesalestotal = 0;
        let stocksubtypeissuetotal = 0;
        let stocksubtypewastagetotal = 0;
        let stocksubtypedebittotal = 0;
        let stocksubtypecredittotal = 0;
        let stocksubtypenettotal = 0;
        stocksubtype.data.map((item) => {
          let itemopngqty = 0;
          let itemstokrecive = 0;
          let itempurchasetotal = 0;
          let itemsalestotal = 0;
          let itemissuetotal = 0;
          let itemwastagetotal = 0;
          let itemdebittotal = 0;
          let itemcredittotal = 0;
          let itemnettotal = 0;
          item.data.map((branch) => {
            let opngqty = 0;
            let stokrecive = 0;
            let purchasetotal = 0;
            let salestotal = 0;
            let issuetotal = 0;
            let wastagetotal = 0;
            let debittotal = 0;
            let credittotal = 0;
            let nettotal = 0;
            branch.data.map((warehouse) => {
              opngqty += (warehouse.y_opn_qty) ? parseFloat(warehouse.y_opn_qty) : 0;
              stokrecive += (warehouse.y_st_rec_qty) ? parseFloat(warehouse.y_st_rec_qty) : 0;
              purchasetotal += (warehouse.y_pi_qty) ? parseFloat(warehouse.y_pi_qty) : 0;
              salestotal += (warehouse.y_si_qty) ? parseFloat(warehouse.y_si_qty) : 0;
              issuetotal += (warehouse.y_st_issue_qty) ? parseFloat(warehouse.y_st_issue_qty) : 0;
              wastagetotal += (warehouse.y_wst_qty) ? parseFloat(warehouse.y_wst_qty) : 0;
              debittotal += (warehouse.y_dn_qty) ? parseFloat(warehouse.y_dn_qty) : 0;
              credittotal += (warehouse.y_cn_qty) ? parseFloat(warehouse.y_cn_qty) : 0;
              nettotal += (warehouse.y_net_qty) ? parseFloat(warehouse.y_net_qty) : 0;
            })
            console.log('totalopngqty', opngqty);
            itemopngqty += branch.totalopngqty = opngqty;
            itemstokrecive += branch.totalstokrecive = stokrecive;
            itempurchasetotal += branch.purchasetotal = purchasetotal;
            itemsalestotal += branch.salestotal = salestotal;
            itemissuetotal += branch.issuetotal = issuetotal;
            itemwastagetotal += branch.wastagetotal = wastagetotal;
            itemdebittotal += branch.debittotal = debittotal;
            itemcredittotal += branch.credittotal = credittotal;
            itemnettotal += branch.nettotal = nettotal;
          })
          stocksubtypeopngqty += item.totalqty = itemopngqty;
          stocksubtypestokrecive += item.totalstokrecive = itemstokrecive;
          stocksubtypepurchasetotal += item.totalpurchase = itempurchasetotal;
          stocksubtypesalestotal += item.totalsales = itemsalestotal;
          stocksubtypeissuetotal += item.totalissue = itemissuetotal;
          stocksubtypewastagetotal += item.totalwastage = itemwastagetotal;
          stocksubtypedebittotal += item.totaldebit = itemdebittotal;
          stocksubtypecredittotal += item.totalcredit = itemcredittotal;
          stocksubtypenettotal += item.totalnet = itemnettotal;
        })
        stocktypeopngqty += stocksubtype.totalqty = stocksubtypeopngqty;
        stocktypestokrecive += stocksubtype.totalstokrecive = stocksubtypestokrecive;
        stocktypepurchasetotal += stocksubtype.totalpurchase = stocksubtypepurchasetotal;
        stocktypesalestotal += stocksubtype.totalsales = stocksubtypesalestotal;
        stocktypeissuetotal += stocksubtype.totalissue = stocksubtypeissuetotal;
        stocktypewastagetotal += stocksubtype.totalwastage = stocksubtypewastagetotal;
        stocktypedebittotal += stocksubtype.totaldebit = stocksubtypedebittotal;
        stocktypecredittotal += stocksubtype.totalcredit = stocksubtypecredittotal;
        stocktypenettotal += stocksubtype.totalnet = stocksubtypenettotal;



      })

      stocktype.totalqty = stocktypeopngqty;
      stocktype.totalstokrecive = stocktypestokrecive;
      stocktype.totalpurchase = stocktypepurchasetotal;
      stocktype.totalsales = stocktypesalestotal;
      stocktype.totalissue = stocktypeissuetotal;
      stocktype.totalwastage = stocktypewastagetotal;
      stocktype.totaldebit = stocktypedebittotal;
      stocktype.totalcredit = stocktypecredittotal;
      stocktype.totalnet = stocktypenettotal;
    });
    console.log('totalopngqty', this.summaryreport);

  }

  openConsignmentVoucherEdit(voucherData) {
    const params = {
      vehId: 0,
      voucherid: voucherData.y_voucherid,
      isdate: 0
    };
    this.common.loading++;
    this.api.post('VehicleTrips/getTripExpenceVouher', params)
      .subscribe(res => {
        console.log('trip expence', res);
        this.common.loading--;
        this.getVoucherSummary(res['data'][0], voucherData);
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }

  getPendingOnEditTrips(vehicleid) {
    return new Promise((resolve, reject) => {
      const params = {
        vehId: vehicleid
      };
      this.common.loading++;
      this.api.post('VehicleTrips/getPendingVehicleTrips', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.TripEditData = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    })
  }

  getVocherEditTime(VoucherID) {
    return new Promise((resolve, reject) => {
      const params = {
        vchId: VoucherID
      };
      this.common.loading++;
      this.api.post('Voucher/getVoucherDetail', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.VoucherEditTime = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject(err);
        });
    })
  }

  getPendingTripsEditTime(voucherid, vhicleId) {
    return new Promise((resolve, reject) => {
      const params = {
        vehId: vhicleId,
        vchrid: voucherid
      };
      this.common.loading++;
      this.api.post('VehicleTrips/getPendingVehicleTripsEdit', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.pendingDataEditTme = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    });
  }

  getTripsExpDriver(tripvoucherid) {
    return new Promise((resolve, reject) => {
      const params = {
        tripVchrId: tripvoucherid
      };
      this.common.loading++;
      this.api.post('TripExpenseVoucher/getTripsExpDriver', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.tripExpDriver = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject(err);
        });
    })
  }

  getVoucherSummary(tripVoucher, voucherData) {
    let promises = [];
    promises.push(this.getPendingOnEditTrips(tripVoucher.y_vehicle_id));
    promises.push(this.getVocherEditTime(tripVoucher.y_voucher_id));
    promises.push(this.getPendingTripsEditTime(tripVoucher.y_id, tripVoucher.y_vehicle_id));
    if (voucherData.y_vouchertype_id == -151) {
      promises.push(this.getTripsExpDriver(tripVoucher.y_id));
    }
    promises.push(this.getTripExpenseVoucherTripsData(tripVoucher));

    Promise.all(promises).then(result => {
      this.showVoucherSummary(this.tripExpenseVoucherTrips, tripVoucher, voucherData);
    }).catch(err => {
      console.log('Error:', err);
      this.common.showError('There is some technical error occured. Please Try Again!');
    });

  }

  getTripExpenseVoucherTripsData(tripVoucher) {
    return new Promise((resolve, reject) => {
      const params = {
        voucherId: tripVoucher.y_voucher_id,
        voucherDetail: tripVoucher
      };
      this.common.loading++;
      this.api.post('TripExpenseVoucher/getTripExpenseVoucherTripsData', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.tripExpenseVoucherTrips = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    });
  }

  showVoucherSummary(tripDetails, tripVoucher, voucherData) {
    let vehId = tripVoucher.y_vehicle_id;
    let tripEditData = this.TripEditData;
    let tripPendingDataSelected = this.pendingDataEditTme;
    let VoucherData = this.VoucherEditTime;
    let typeFlag = 1;
    let permanentDelete = 0;


    // if (voucherData.y_vouchertype_id == -151) {
    //   let tripExpDriver = this.tripExpDriver;
    //   this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver, typeFlag, permanentDelete };


    //   console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
    //   const activeModal = this.modalService.open(VoucherSummaryShortComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    //   activeModal.result.then(data => {
    //     // console.log('Data: ', data);
    //     if (data.response) {
    //       //this.addLedger(data.ledger);
    //    // this.getDayBook();

    //     }
    //     // this.selectedVehicle.id =0
    //   });
    // } else
    {
      let tripExpDriver = this.tripExpDriver;
      this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver, typeFlag, permanentDelete };
      console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
      const activeModal = this.modalService.open(TripdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        if (data.response) {
          //this.addLedger(data.ledger);
          // this.getDayBook();
        }
      });
    }
  }

  changeViewType(type) {
    this.active.liabilities.mainGroup = [];
    this.active.liabilities.subGroup = [];
    setTimeout(() => {
      console.log('viewtype', this.viewType, type);
      if(this.viewType == 'main') {
        this.summaryreport.forEach((liability, i) => this.active.liabilities.mainGroup.push('mainGroup' + i + 0 + 0 + 0));
      }  else if(this.viewType == 'stock') {
        this.summaryreport.forEach((liability, i) => {
          console.log('liability', liability);
          liability.data.forEach((mainGroup, j) => {
            this.active.liabilities.mainGroup.push('mainGroup' + i + 0 + 0 + 0)
            mainGroup.data.forEach((subGroup, k) => {
              this.active.liabilities.subGroup.push('subGroup' + i + j + 0 + 0)
            });
          });

        });


      } else if(this.viewType == 'all') {
        this.summaryreport.forEach((liability, i) => {
          console.log('liability', liability);
          liability.data.forEach((mainGroup, j) => {
            this.active.liabilities.mainGroup.push('mainGroup' + i + 0 + 0 + 0)
            mainGroup.data.forEach((subGroup, k) => {
              this.active.liabilities.subGroup.push('subGroup' + i + j + 0 + 0)
              subGroup.data.forEach((branch, l) => {
                this.active.liabilities.branch.push('branch' + i + j + k + 0)
                branch.data.forEach((warehouse, m) => {
                  this.active.liabilities.warehouse.push('warehouse' + i + j + k + l)
                });
              });
            });
          });

        });


      }
     
    }, 20);
  }


  openmodal(data,type) {
    if (this.isSingleClick) {
      clearTimeout(this.isSingleClick);
    }
    setTimeout(() => {
    console.log('datail data',type, data);
    if(type.includes('stock')){
      this.common.params = {
        startDate :this.outStanding.Date,
        endDate :this.outStanding.endDate,
        stocktype:data.y_stockitem_type_id,
        stocksubtype:data.y_stockitem_subtype_id,
        stockItem:data.y_stockitem_id,
        branchid:data.y_fobranch_id,
        warehouse:data.y_warehouse_id
      };
    }else if(type.includes('branch')){
      this.common.params = {
        startDate :this.outStanding.Date,
        endDate :this.outStanding.endDate,
        stocktype:data.y_stockitem_type_id,
        stocksubtype:data.y_stockitem_subtype_id,
        stockItem:data.y_stockitem_id,
        branchid:data.y_fobranch_id
      };
    }else{
      this.common.params = {
        startDate :this.outStanding.Date,
        endDate :this.outStanding.endDate,
        stocktype:data.y_stockitem_type_id,
        stocksubtype:data.y_stockitem_subtype_id,
        stockItem:data.y_stockitem_id,
        branchid:data.y_fobranch_id,
        warehouse:data.y_warehouse_id
      };
      console.log('param model',this.common.params);
    }


    const activeModal = this.modalService.open(StockSummaryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        //this.addLedger(data.ledger);
        // this.getDayBook();
      }
    });





    
  }, 20);
  }

  generateCsvData() {
    let liabilitiesJson = [];
    liabilitiesJson.push(Object.assign({Stocktype:" Stock Type",stocksubtype:'Stock Sub Type',stockitem:'Stock Item',branch:'Branch',warehouse:'Ware House',openingqty:'Opening Qty',stockrecived:'Stock Recived',purchase:'Purchase',sales:'Sales',issue:'Issue/Transefer',wastage:'Wastage',debitnote:'Debit Note',creditnote:'Credit Note',net:'Net Available'}));

    this.summaryreport.forEach(liability => {
      liabilitiesJson.push({ Stocktype: '(ST)'+liability.name, stocksubtype:'',stockitem:'',branch:'',warehouse:'',openingqty:liability.totalqty,stockrecived:liability.totalstokrecive,purchase:liability.totalpurchase,sales:liability.totalsales,issue:liability.totalissue,wastage:liability.totalwastage,debitnote:liability.totaldebit,creditnote:liability.totalcredit,net: liability.totalnet });
      liability.data.forEach(subGroup => {
        liabilitiesJson.push({Stocktype: '', stocksubtype:'(SS)'+subGroup.name,stockitem:'',branch:'',warehouse:'',openingqty:subGroup.totalqty,stockrecived:subGroup.totalstokrecive,purchase:subGroup.totalpurchase,sales:subGroup.totalsales,issue:subGroup.totalissue,wastage:subGroup.totalwastage,debitnote:subGroup.totaldebit,creditnote:subGroup.totalcredit,net: subGroup.totalnet });
        subGroup.data.forEach(balanceSheet => {
          liabilitiesJson.push({Stocktype: '', stocksubtype:'',stockitem:'(SI)'+balanceSheet.name,branch:'',warehouse:'',openingqty:balanceSheet.totalqty,stockrecived:balanceSheet.totalstokrecive,purchase:balanceSheet.totalpurchase,sales:balanceSheet.totalsales,issue:balanceSheet.totalissue,wastage:balanceSheet.totalwastage,debitnote:balanceSheet.totaldebit,creditnote:balanceSheet.totalcredit,net: balanceSheet.totalnet });
          balanceSheet.data.forEach(warehouse => {
            liabilitiesJson.push({Stocktype: '', stocksubtype:'',stockitem:'',branch:'(BR)'+warehouse.name,warehouse:'',openingqty:warehouse.totalopngqty,stockrecived:warehouse.totalstokrecive,purchase:warehouse.purchasetotal,sales:warehouse.salestotal,issue:warehouse.issuetotal,wastage:warehouse.wastagetotal,debitnote:warehouse.debittotal,creditnote:warehouse.credittotal,net: warehouse.nettotal });
              warehouse.data.forEach(branch => {
                liabilitiesJson.push({Stocktype: '', stocksubtype:'',stockitem:'',branch:'',warehouse:'(WH)'+branch.y_warehouse_name,openingqty:(branch.y_opn_qty)? branch.y_opn_qty : 0,stockrecived:(branch.y_st_rec_qty) ? branch.y_st_rec_qty :0,purchase:(branch.y_pi_qty) ? branch.y_pi_qty :0,sales:(branch.y_si_qty) ? branch.y_si_qty:0,issue:(branch.y_st_issue_qty) ? branch.y_st_issue_qty:0,wastage:(branch.y_wst_qty) ? branch.y_wst_qty:0 ,debitnote:(branch.y_dn_qty) ? branch.y_dn_qty:0,creditnote:(branch.y_cn_qty) ? branch.y_cn_qty : 0,net: (branch.y_net_qty) ? branch.y_net_qty:0 });
                });
           });
        });
      });
    });

    
    let mergedArray = [];

    for (let i = 0; i < liabilitiesJson.length; i++) {
       if (liabilitiesJson[i] && i < liabilitiesJson.length - 1) {
        mergedArray.push(Object.assign({}, liabilitiesJson[i], { asset: '', assetAmount: '' }));
      } 
    }
    mergedArray.push(Object.assign({}, liabilitiesJson[liabilitiesJson.length - 1]))
    mergedArray.push(Object.assign({}, {"":'ST = Stock Type ,SS =Stock Sub Type, SI = Stock Item, BR = Branch, WH = Ware House'}))

   this.csvService.jsonToExcel(mergedArray);
    console.log('Merged:', mergedArray);
  }
}
