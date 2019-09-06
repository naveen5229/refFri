import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstraintsComponent } from '../constraints/constraints.component';
@Component({
  selector: 'add-escalation-issue',
  templateUrl: './add-escalation-issue.component.html',
  styleUrls: ['./add-escalation-issue.component.scss']
})
export class AddEscalationIssueComponent implements OnInit {

  issueDetails = [];
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
    public modalService: NgbModal,
    public common: CommonService,
    public api: ApiService) {
    if (this.common.params) {
      this.escalationType = {
        id: this.common.params.foid,
        issueType: this.common.params.issueType
      };
    }
    this.getAddIssueTable();
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
      foid: this.common.params.foid,
      issue_type_id: this.common.params.issueType
    };
    this.common.loading++;
    this.api.post('FoTicketEscalation/getUsers', params)
      .subscribe(res => {
        this.common.loading--
        console.log('res: ', res['data']);
        this.issueDetails = res['data'];
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
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
      user_level: this.level

    };
    console.log('params to insert', params);
    this.common.loading++;
    this.api.post('FoTicketEscalation/insertTicketEscalation', params)
      .subscribe(res => {
        this.common.loading--
        this.issueFieldValues = res['success'];
        console.log('addIssue', res['success']);
        this.getAddIssueTable();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  removeField(result?) {
    let params = {
      fId: result.id

    };
    console.log('removeld', result.id)
    this.common.loading++;
    this.api.post('FoTicketEscalation/deleteUser ', params)
      .subscribe(res => {
        this.common.loading--
        console.log('removeField', res);
        if (res['code'] == "1") {
          this.getAddIssueTable();
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  addConstraints() {
    this.common.params = { foId: 1215, issueType: 10001 };
    const activeModal = this.modalService.open(ConstraintsComponent, { size: 'lg', container: 'nb-layout', });
    activeModal.result.then(data => {
      console.log("Test");
    });
  }


}
