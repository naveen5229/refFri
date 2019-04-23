import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddSiteRuleComponent } from '../../modals/add-site-rule/add-site-rule.component';
@Component({
  selector: 'trip-site-rule',
  templateUrl: './trip-site-rule.component.html',
  styleUrls: ['./trip-site-rule.component.scss', '../../pages/pages.component.css']
})
export class TripSiteRuleComponent implements OnInit {
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
  bodyType = [
    {
      id: 11,
      name: "3axle"
    },
    {
      id: 21,
      name: "4axle"
    },
    {
      id: 31,
      name: "6axle"
    }
  ];
  materialType = "";
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
    this.vehicle= null;
    this.siteId=null;
  }
  addsite() {
    this.common.params = {};
    const activeModal = this.modalService.open(AddSiteRuleComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getSiteData();
      }
    });
  }

  getSiteData() {
    this.common.loading++;
    this.api.get('TripSiteRule')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
       
        let index = 0;
        for (const data of this.data) {
          let bodyName = this.bodyType.find((element) => {
            return element.id == this.data[index].bodytype_id;
          });
          this.data[index].bodyName = bodyName ? bodyName.name : 'N.A';
          let ruleName = this.ruleType.find((element) => {
            return element.id == this.data[index].ruletype_id;
          });
          this.data[index].ruleName = ruleName ? ruleName.name : 'N.A';

          this.data[index].preSiteType = data.pre_site_name ? data.pre_site_name : 'N.A';
          this.data[index].materialType = data.mt_name ? data.mt_name : 'N.A';
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
      preSiteName: { title: 'Pre Site Name ', placeholder: 'Pre Site Name' },
      currentSiteName: { title: 'Current Site Name ', placeholder: 'Current Site Name' },
      materialName: { title: 'Material Name ', placeholder: 'Material Name' },
      bodyType: { title: 'Body Type ', placeholder: 'Body Type' },
      ruleType: { title: 'Rule Type', placeholder: 'Rule Type' },
      edit: { title: 'Edit ', placeholder: 'Edit',hideSearch: true, class:'tag' },
      delete: { title: 'delete ', placeholder: 'delete',hideSearch: true, class:'tag' },
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
        preSiteName: { value: doc.preSiteType },
        currentSiteName: { value: doc.curr_site_name },
        materialName: { value: doc.materialType },
        bodyType: { value: doc.bodyName },
        ruleType: { value: doc.ruleName },
        edit: { value: `<i class="fa fa-pencil-alt"></i>`, isHTML: true, action: this.editRule.bind(this, doc), class: 'icon text-center del',},
        delete: { value: `<i class="fa fa-trash"></i>`, isHTML: true, action: this.deleteRule.bind(this, doc), class: 'icon text-center del',},

      };
      columns.push(column);
    });
    return columns;
  }


  editRule(row) {
    console.log("row", row);
    this.common.params = { title: 'Edit Site Rule', row };
    const activeModal = this.modalService.open(AddSiteRuleComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getSiteData();
      }
    });

  }

  deleteRule(doc) {
    alert("Are You Want Delete Record"); {
      const params = {
        foid: doc.foid,
        currSiteId: doc.current_siteid,
        preSiteId: doc.pre_siteid
      }
      this.common.loading++;
      this.api.post('TripSiteRule/delete', params)
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
  getAllSiteData(){
    this.common.loading++;
    this.api.get('TripSiteRule?vehicleId='+this.vehicle.id+'&siteId=' + this.siteId)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
    
        let index = 0;
        for (const data of this.data) {
          let bodyName = this.bodyType.find((element) => {
            return element.id == this.data[index].bodytype_id;
          });
          this.data[index].bodyName = bodyName ? bodyName.name : 'N.A';
          let ruleName = this.ruleType.find((element) => {
            return element.id == this.data[index].ruletype_id;
          });
          this.data[index].ruleName = ruleName ? ruleName.name : 'N.A';

          this.data[index].preSiteType = data.pre_site_name ? data.pre_site_name : 'N.A';
          this.data[index].materialType = data.mt_name ? data.mt_name : 'N.A';
          index++;
        }
        
        this.table = this.setTable();


      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }



}
