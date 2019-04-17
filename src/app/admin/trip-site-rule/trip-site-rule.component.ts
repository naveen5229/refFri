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


      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
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

}
