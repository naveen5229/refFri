import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';

@Component({
  selector: 'fo-user-role',
  templateUrl: './fo-user-role.component.html',
  styleUrls: ['./fo-user-role.component.scss']
})
export class FoUserRoleComponent implements OnInit {
  getUsersList = [];
  getAllPagesList = [];

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService) {
    this.common.refresh = this.refresh.bind(this);
    this.getAllUserList();
  }

  ngOnInit() {
  }
  refresh() {
    this.getAllUserList();
    document.getElementById('name')['value'] = '';
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
    const params = {
      userId: user.id
    };
    this.common.loading++;
    this.api.post('UserRoles/getAllPages', params)
      .subscribe(res => {
        this.common.loading--;
        this.getAllPagesList = res['data'];
        console.log("Res Data:", this.getAllPagesList)


      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }


}
