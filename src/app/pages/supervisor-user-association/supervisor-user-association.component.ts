import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'supervisor-user-association',
  templateUrl: './supervisor-user-association.component.html',
  styleUrls: ['./supervisor-user-association.component.scss']
})
export class SupervisorUserAssociationComponent implements OnInit {
  getUsersList=[];
  supervisorId = null;
  users = [{
    id:null,
    name:'',
    mobileno:''
  }]
  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    public user: UserService) {
    this.getAllUserList();
   }

   ngOnInit() {
  }
   getAllUserList() {
    this.common.loading++;
    this.api.get('Suggestion/getAllFoAdminUsersWrtFo?')
      .subscribe(res => {
        this.common.loading--;
        this.getUsersList = res['data'];
        console.log("api Data:", this.getUsersList);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }


  getUserDetails(user) {
    console.log(user);
    this.supervisorId = user.id;
    this.common.loading++;
    this.api.get('FoAdmin/GetSuperUserAndUserMapping?superUserId='+ this.supervisorId)
      .subscribe(res => {
        this.common.loading--;  
        this.users = res['data']  ||  [{
          id:null,
          name:'',
          mobileno:''
        }];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }
  

  saveAssociation() {
    const params = {
      superUserId: this.supervisorId,
      viewUsers: JSON.stringify(this.users),
    };
    this.common.loading++;
    this.api.post('FoAdmin/saveSuperUserAndUserMapping', params)
      .subscribe(res => {
        this.common.loading--;  
       if(res['data'] && res['data'][0]) 
       {
        if(res['data'][0].y_id>0){
          this.common.showToast(res['data'][0].y_msg);
        }
        else{
          this.common.showError(res['data'][0].y_msg);
        }
       }
       else{
         this.common.showError("Something went wrong");
       }
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }
 
  addUser(){
   let user =  {
      id:null,
      name:'',
      mobileno:''
    };
    this.users.push(user);
  }
}
