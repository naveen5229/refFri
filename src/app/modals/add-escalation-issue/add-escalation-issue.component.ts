import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ConstraintsComponent } from '../constraints/constraints.component';
import { constants } from 'os';
@Component({
  selector: 'add-escalation-issue',
  templateUrl: './add-escalation-issue.component.html',
  styleUrls: ['./add-escalation-issue.component.scss']
})
export class AddEscalationIssueComponent implements OnInit {
  startTime = new Date(new Date().setDate(new Date().getDate() - 7));;
  endTime = new Date();
  issueDetails = [];
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



  issueFieldValues = [];
  userLevel = "one";
  level = 1;
  escalationType = {
    id: '',
    issueType: ''
  };
  addIssueField = {
    userId: '',
    SeniorId: '',
    foid: '',
    userLevel: '',
    issue_type_id: ''
  };



  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public modalService: NgbModal,
    public api: ApiService) {
    if (this.common.params) {
      this.escalationType = {
        id: this.common.params.foid,
        issueType: this.common.params.issueType
      };
    }
    this.getAddIssueTable();
    this.common.handleModalSize('class', 'modal-lg', '1100', 'px');
  }

  ngOnInit() {
  }
  getUser(user) {
    console.log('getUser: ', user);
    this.addIssueField.userId = user.id;

  }
  getSenior(senior) {
    console.log('getSenior: ', senior);
    this.addIssueField.SeniorId = senior.id;
  }
  dismiss(status) {
    this.activeModal.close({ status: status });
  }
  getAddIssueTable() {
    let params = {
      foid: this.escalationType.id,
      issue_type_id: this.escalationType.issueType
    };
    this.common.loading++;
    this.api.post('FoTicketEscalation/getUsers', params)
      .subscribe(res => {
        this.common.loading--
        console.log('res: ', res['data']);
        this.issueDetails = res['data'] || [];
        console.log("result", res);
        let first_rec = this.issueDetails[0];
        let headings = {};
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            headings[key] = headerObj;
          }
        }
        this.table.data = {
          headings: headings,
          columns: this.getTableColumns()
        };
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }


  getTableColumns() {
    let columns = [];
    console.log("Data=", this.issueDetails);
    this.issueDetails.map(matrix => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'black', action: '' };
      }
      this.valobj['Action'] = { class: '', icons: this.actionIcons(matrix) };
      columns.push(this.valobj);
    });
    return columns;
  }

  actionIcons(details) {
    let icons = [];
    icons.push(
      {
        class: "fa fa-trash",
        action: this.removeField.bind(this, details)
      },
        {
          class: "fa fa-filter ml-2",
          action: this.addIssueConstraints.bind(this, details)
        }
    )
    return icons;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  addIssue() {
    if (this.userLevel == "one") {
      this.level = 1;
    } else if (this.userLevel == "two") {
      this.level = 2;
    } else if (this.userLevel == "three") {
      this.level = 3;
    } else if (this.userLevel == "four") {
      this.level = 4;
    }
    let params = {
      foid: this.common.params.foid,
      issue_type_id: this.common.params.issueType,
      user_id: this.addIssueField.userId,
      senior_user_id: this.addIssueField.SeniorId,
      user_level: this.level,
      from_time: this.common.dateFormatter1(this.startTime),
      to_time: this.common.dateFormatter1(this.endTime),
    };
    console.log('params to insert', params);
    this.common.loading++;
    this.api.post('FoTicketEscalation/insertTicketEscalation', params)
      .subscribe(res => {
        this.common.loading--
        this.issueFieldValues = res['success'];

        console.log('addIssue', res['success']);
        this.common.showToast(res['data'][0]['y_msg']);
        this.getAddIssueTable();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }


  removeField(result) {
    console.log("result:",result);
    let params = {
      fId: result._row_id

    };

    if (result._row_id) {
      this.common.params = {
        title: 'Delete Matrix ',
        description: `<b>&nbsp;` + 'Are You Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log('removeld', result.id)
          this.common.loading++;
          this.api.post('FoTicketEscalation/deleteUser ', params)
            .subscribe(res => {
              this.common.loading--
              console.log('removeField', res);
              
              if (res['code'] == "1") {
                console.log("test");
                this.common.showToast([res][0]['msg']);
                this.getAddIssueTable();
              }
            }, err => {
              this.common.loading--;
              this.common.showError();
            })
        }
      });
    }
  }

  addIssueConstraints(constraint)
  {
  console.log("constaints",constraint);
    
   let constraints={
    foId:constraint._foid,
    issueType:constraint._issue_type_id,
    id:constraint._row_id
    };
    this.common.params={constraints:constraints};
    const activeModal= this.modalService.open(ConstraintsComponent, {size: 'lg', container: 'nb-layout', backdrop: 'static'});
     activeModal.result.then(data =>{
     });
  }
}
