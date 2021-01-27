import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'issue-alerts',
  templateUrl: './issue-alerts.component.html',
  styleUrls: ['./issue-alerts.component.scss', '../../pages/pages.component.css']
})
export class IssueAlertsComponent implements OnInit {
  issues = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  constructor(
    public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal

  ) {

    this.getIssueAlerts();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {
    console.log('Refresh');
    this.getIssueAlerts();
  }

  getIssueAlerts() {
    ++this.common.loading;
    this.api.get('IssueDetection/getIssueAlerts?')
      .subscribe(res => {
        --this.common.loading;
        console.log('Res: ', res['data']);
        this.issues = res['data'];
        this.issues.length ? this.setTable() : this.resetTable();
      }, err => {
        --this.common.loading;
        console.error(err);
        this.common.showError();
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
    for (var key in this.issues[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: key, placeholder: this.formatTitle(key) };
      }
    }
    return headings;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }


  getTableColumns() {
    let columns = [];
    this.issues.map(iss => {
      let column = {};
      for (let key in this.generateHeadings()) {
        if (key == 'Action') {
          column[key] = {
            value: "",
            isHTML: false,
            action: null,
            icons: this.actionIcons(iss)
          };
        } else {
          column[key] = { value: iss[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    })

    return columns;
  }

  actionIcons(issue) {
    let icons = [
      {
        class: 'fa fa-question-circle mr-3',
        action: this.goToTrail.bind(this, issue),
      },

      {
        class: 'fa fa-check-circle mr-3',
        action: this.issueComplete.bind(this, issue),
      },

    ];

    return icons;
  }

  goToSiteFencing() {
    window.open('http://dev.elogist.in/dost/#/admin/site-fencing');
  }

  goToTrail(issue) {
    if (!issue._site_id) {
      let ltime = new Date(issue.addtime);
      let subtractLTime = new Date(ltime.setHours(ltime.getHours() - 48));
      let latch_time = this.common.dateFormatter(subtractLTime);
      let VehicleStatusData = {
        vehicle_id: issue._referid,
        tTime: issue.addtime,
        suggest: 11,
        latch_time: latch_time
      }
      console.log("VehicleStatusData", VehicleStatusData);

      this.common.params = VehicleStatusData;
      const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
      activeModal.result.then(data => {
      });
    } else {
      this.goToSiteFencing();
    }
  }

  issueComplete(issue) {
    console.log("issue", issue);
    this.common.loading++;
    let params = {
      alertId: issue._id,
      status: 1
    };
    console.log(params);
    this.api.post('IssueDetection/issueStatusUpdate?', params)
      .subscribe(res => {
        this.common.loading--;
        this.getIssueAlerts();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


}
