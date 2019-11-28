import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFuelFullRuleComponent } from '../../modals/add-fuel-full-rule/add-fuel-full-rule.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { ModalWiseFuelAverageComponent } from '../../modals/modal-wise-fuel-average/modal-wise-fuel-average.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'fuel-master',
  templateUrl: './fuel-master.component.html',
  styleUrls: ['./fuel-master.component.scss']
})
export class FuelMasterComponent implements OnInit {
  fuelAvg = [];
  fuelTable = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true

    }

  };

  fuelHeadings = [];
  fuelValobj = {};
  table = null;
  fuelNorms = [];
  table1 = null;
  foFsMapping = [];
  fsid = null;
  foid = null;
  fuelData = []
  vehicleId = null;
  activeTab = 'Credit Fuel Station';



  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
    this.getFuelNorms();
    this.getFoFsMapping();
    this.getFuelAvg();
  }

  ngOnInit() {
  }

  refresh() {
    this.getFuelNorms();
    this.getFoFsMapping();
    this.getFuelAvg();
  }

  addFuelRule() {
    this.common.params = {};
    const activeModal = this.modalService.open(AddFuelFullRuleComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getFuelNorms();
      }
    });
  }

  getFuelNorms() {
    this.fuelNorms = [];
    this.common.loading++;
    this.api.get('Fuel/getFuelFullNorms')
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.fuelNorms = res['data'] || [];
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  setTable() {
    let headings = {
      FoName: { title: 'Fo Name', placeholder: 'Fo Name' },
      RuleType: { title: 'Rule Type ', placeholder: 'Rule Type' },
      Name: { title: 'Name ', placeholder: 'Name' },
      AngleFrom: { title: 'Angle From ', placeholder: 'Angle From' },
      AngleTo: { title: 'Angle To ', placeholder: 'Angle To' },
      action: { title: 'Action ', placeholder: 'Action', hideSearch: true, class: 'tag' },
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "72vh"

      }
    }
  }

  getTableColumns() {
    let columns = [];
    this.fuelNorms.map(norm => {
      let column = {
        FoName: { value: norm.fo_name },
        RuleType: { value: norm.type },
        Name: { value: norm.name },
        AngleFrom: { value: norm.angle_from },
        AngleTo: { value: norm.angle_to },
        action: {
          value: '', isHTML: false, action: null, icons: this.actionIcons(norm)
        },
        rowActions: {
          click: 'selectRow'
        }

      };
      columns.push(column);
    });
    return columns;
  }


  actionIcons(norm) {
    let icons = [];
    this.user.permission.edit && icons.push({ class: 'far fa-edit', action: this.updateRule.bind(this, norm) });
    this.user.permission.delete && icons.push({ class: " fa fa-trash-alt", action: this.deleteRule.bind(this, norm) });

    return icons;
  }

  updateRule(rule) {
    this.common.params = { title: 'Edit Fuel Rule', rule };
    const activeModal = this.modalService.open(AddFuelFullRuleComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getFuelNorms();
      }
    });
  }

  deleteRule(rule) {
    if (window.confirm("Are You Want Delete Record")) {
      const params = {
        rowid: rule.id,
      }
      console.log('params', params);
      this.common.loading++;
      this.api.post('Fuel/deleteRule', params)
        .subscribe(res => {
          this.common.loading--;
          let output = res['data'];
          console.log("data:");
          console.log(output);
          this.common.showToast(res['msg']);
          this.getFuelNorms();
        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
  }

  getFoFsMapping() {
    this.common.loading++;
    this.api.get('Fuel/getFoFsMapping')
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.foFsMapping = res['data'] || [];
        this.table1 = this.setTable1();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  addFoFsMapping() {
    if (!this.fsid) {
      this.common.showToast('Fuel Station Is Missing');
      return;
    }
    let params = {
      foid: null,
      fsid: this.fsid
    };
    this.common.loading++;
    this.api.post('Fuel/insertFoFsMapping', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.common.showToast(res['msg']);
        if (res['success'])
          this.getFoFsMapping();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  getFo(foList) {
    this.foid = foList.id;
  }

  getFs(fsList) {
    this.fsid = fsList.id;
  }

  setTable1() {
    let headings = {
      StationName: { title: 'Station Name', placeholder: 'Station Name' },
      SiteName: { title: 'Site Name', placeholder: 'Site Name' },
      Location: { title: 'Location', placeholder: 'Location' },
      action: { title: 'Action ', placeholder: 'Action', hideSearch: true, class: 'tag' },
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns1()
      },
      settings: {
        hideHeader: true,
        tableHeight: "72vh"
      }
    }
  }

  getTableColumns1() {
    let columns = [];
    this.foFsMapping.map(mapped => {
      let column = {
        StationName: { value: mapped.station_name },
        SiteName: { value: mapped.site_name },
        Location: { value: mapped.location },
        action: {
          value: '', isHTML: false, action: null, icons: [
            this.user.permission.delete && { class: " fa fa-trash-alt", action: this.deleteMapping.bind(this, mapped) }
          ]
        },
        rowActions: {
          click: 'selectRow'
        }

      };
      columns.push(column);
    });
    return columns;
  }

  deleteMapping(details) {
    let params = {
      rowid: details.id
    };
    console.log('rowid', params);
    this.common.loading++;
    this.api.post('Fuel/deleteFoFsMapping', params)
      .subscribe(res => {
        this.common.loading--;
        this.common.showToast(res['msg'])
        if (res['success'])
          this.getFoFsMapping();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  addFuelAvg() {
    this.common.params = {
      row: null,
      load: null,
      unload: null,
      vehicle: null
    };
    const activeModal = this.modalService.open(ModalWiseFuelAverageComponent, { container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.getFuelAvg();
    });
  }

  getFuelAvg() {
    this.fuelAvg = [];
    this.fuelTable = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    this.fuelHeadings = [];
    this.fuelValobj = {};
    this.common.loading++;
    this.api.get('Fuel/getModelWiseFuelAvgWrtFo')
      .subscribe(res => {
        this.common.loading--;
        this.fuelAvg = [];
        this.fuelAvg = res['data'] || [];
        console.log("result", res);
        // console.log("idd",this.fuelAvg[0]._id);

        let first_rec = this.fuelAvg[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.fuelHeadings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.fuelTable.data.headings[key] = headerObj;
          }
        }
        this.fuelTable.data.columns = this.getTableFuelColumns();
      }
      );
  }

  getTableFuelColumns() {
    let columns = [];
    console.log("Data=", this.fuelAvg);
    this.fuelAvg.map(fuelAvgDoc => {
      this.fuelValobj = {};
      for (let i = 0; i < this.fuelHeadings.length; i++) {
        console.log("doc index value:", fuelAvgDoc[this.fuelHeadings[i]]);
        if (this.fuelHeadings[i] == 'Action') {
          this.fuelValobj['Action'] = { value: "", action: null, icons: this.actionIcon(fuelAvgDoc) }

        }
        else
          this.fuelValobj[this.fuelHeadings[i]] = { value: fuelAvgDoc[this.fuelHeadings[i]], class: 'black', action: '' };
      }

      columns.push(this.fuelValobj);
    });
    return columns;
  }

  actionIcon(fuelAvgDoc) {
    let icons = [];
    this.user.permission.edit && icons.push({ class: 'far fa-edit', action: this.updateFuel.bind(this, fuelAvgDoc._id, fuelAvgDoc.LoadMileage, fuelAvgDoc.UnloadMileage, fuelAvgDoc._vm_id, fuelAvgDoc.VehicleModel, fuelAvgDoc.Brand) });
    this.user.permission.delete && icons.push({ class: "fas fa-trash-alt", action: this.deleteFuel.bind(this, fuelAvgDoc._id) });

    return icons;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  updateFuel(row, load, unLoad, vehicle, name, brand) {
    this.common.params = { row, load, unLoad, vehicle, name, brand };

    const activeModal = this.modalService.open(ModalWiseFuelAverageComponent, { container: 'nb-layout' });
    activeModal.result.then(data => {
      this.getFuelAvg();
    });

  }


  deleteFuel(row) {
    console.log("id", row)
    const params = {
      rowId: row,
    }
    console.log("id2", params)
    if (row) {
      this.common.params = {
        title: 'Delete  ',
        description: `<b>&nbsp;` + 'Are you Sure You Want  To Delete This Record?' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          console.log("par", params);
          this.api.post('Fuel/deleteModelWiseFuelAvgWrtFo', params)
            .subscribe(res => {
              console.log('Api Response:', res)
              this.common.showToast(res['msg']);
              this.getFuelAvg();
              this.common.loading--;
            },
              err => console.error(' Api Error:', err));
        }
      });
    }
  }

}
