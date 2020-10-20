import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPlacementSiteRuleComponent } from '../../modals/add-placement-site-rule/add-placement-site-rule.component';

@Component({
  selector: 'placement-site-rule',
  templateUrl: './palacement-site-rule.component.html',
  styleUrls: ['./palacement-site-rule.component.scss', '../../pages/pages.component.css']
})
export class PalacementSiteRuleComponent implements OnInit {
  data = [];
  ruleType = [
    {
      id: 11,
      name: "Loading"
    },
    {
      id: 21,
      name: "UnLoading"
    },
    {
      id: 31,
      name: "Loading & Unloading"
    }
  ];

  siteId = null;
  vehicle = {
    id: null,
    regno: null,
  };
  table = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
    this.getSiteData();
  }

  ngOnInit() {
  }

  refresh() {
    this.getSiteData();
    this.vehicle.id = null;
    this.siteId = null;
  }
  addsite() {
    this.common.params = {};
    const activeModal = this.modalService.open(AddPlacementSiteRuleComponent, { container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getSiteData();
      }
    });
  }

  getSiteData() {
    this.common.loading++;
    this.api.get('PlacementSiteRule/index')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];

        let index = 0;
        for (const data of this.data) {


          let ruleName = this.ruleType.find((element) => {
            return element.id == this.data[index].ruletype_id;
          });
          this.data[index].ruleName = ruleName ? ruleName.name : 'N.A';

          this.data[index].preSiteType = data.next_site_name ? data.next_site_name : 'N.A';
          index++;
        }
        this.table = this.setTable();

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  setTable() {
    let headings = {
      foName: { title: 'Fo Name', placeholder: 'Fo Name' },
      currentSiteName: { title: 'Current Site Name ', placeholder: 'Current Site Name' },
      nextSiteName: { title: 'Next Site Name ', placeholder: 'Next Site Name' },
      ruleType: { title: 'Rule Type', placeholder: 'Rule Type' },
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
    this.data.map(doc => {
      let column = {
        foName: { value: doc.f_name },
        currentSiteName: { value: doc.curr_site_name },
        nextSiteName: { value: doc.preSiteType },
        ruleType: { value: doc.ruleName },
        action: {
          value: '', isHTML: false, action: null, icons: [
            { class: 'fas fa-edit  edit-btn', action: this.editRule.bind(this, doc) },
            { class: " fa fa-trash remove", action: this.deleteRule.bind(this, doc) }
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


  editRule(row) {
    console.log("row", row);
    this.common.params = { title: 'Edit Site Rule', row };
    const activeModal = this.modalService.open(AddPlacementSiteRuleComponent, { container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getSiteData();
      }
    });

  }

  deleteRule(doc) {

    console.log("doc:", doc);
    if (window.confirm("Are You Want Delete Record")) {
      const params = {
        foid: doc.foid,
        currSiteId: doc.current_siteid,
        nextSiteId: doc.next_siteid
      }


      this.common.loading++;
      this.api.post('PlacementSiteRule/delete', params)
        .subscribe(res => {
          this.common.loading--;
          let output = res['data'];
          console.log("data:");
          console.log(output);
          this.common.showToast(res['msg']);
          this.getSiteData();

        }, err => {

          this.common.loading--;
          console.log(err);
        });
    }
  }
  getAllSiteData() {
    this.common.loading++;
    this.api.get('TripSiteRule?vehicleId=' + this.vehicle.id + '&siteId=' + this.siteId)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];

        let index = 0;
        for (const data of this.data) {


          let ruleName = this.ruleType.find((element) => {
            return element.id == this.data[index].ruletype_id;
          });
          this.data[index].ruleName = ruleName ? ruleName.name : 'N.A';

          this.data[index].preSiteType = data.next_site_name ? data.next_site_name : 'N.A';
          this.data[index].materialType = data.mt_name ? data.mt_name : 'N.A';
          index++;
        }
        this.table = null;
        this.table = this.setTable();


      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  selectVehicle(vehicle) {
    this.vehicle.id = vehicle.id;
  }
  selectSite(site) {
    this.siteId = site.id;

  }
}

