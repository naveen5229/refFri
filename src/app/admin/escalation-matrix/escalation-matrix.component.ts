import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEscalationIssueComponent } from '../../modals/add-escalation-issue/add-escalation-issue.component';

@Component({
  selector: 'escalation-matrix',
  templateUrl: './escalation-matrix.component.html',
  styleUrls: ['./escalation-matrix.component.scss','../../pages/pages.component.css']
})
export class EscalationMatrixComponent implements OnInit {

  escalationMatrix = null;
  matrixList= [];

  constructor(public api: ApiService, public common: CommonService,
              public user: UserService,
               public modalService: NgbModal) {
                this.common.refresh = this.refresh.bind(this);
                }

  ngOnInit() {
  }

  refresh(){
    console.log('Refresh');
  }
  getMatrix(user) {
    this.escalationMatrix = user;
    console.log('escalationMatrix-id', this.escalationMatrix.id);
    console.log('escalationMatrix-name', this.escalationMatrix.name);
    let params = {
      foid: this.escalationMatrix.id
    };
    this.common.loading++;
    this.api.post('FoTicketEscalation/getEscalationMatrix',params)
            .subscribe(res =>{
              this.common.loading--;
              console.log('res: '+res['msg']);
              this.matrixList= res['msg'];
            }, err => {
              this.common.loading--;
              this.common.showError();
            });
  }
  openAddIssueModel(matrix?){
    let foid=this.escalationMatrix.id;
    let issueType=matrix.fo_issue_type_id;
    console.log("foid is:",foid);
    console.log("foid is:",matrix);
    if(matrix) this.common.params= {foid,issueType};
    const activeModal= this.modalService.open(AddEscalationIssueComponent, {size: 'lg', container: 'nb-layout', backdrop: 'static'});
     activeModal.result.then(data =>{
       if(!data.status){
        
       }
     });
  }
}
