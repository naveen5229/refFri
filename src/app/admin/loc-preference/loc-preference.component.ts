import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'loc-preference',
  templateUrl: './loc-preference.component.html',
  styleUrls: ['./loc-preference.component.scss']
})
export class LocPreferenceComponent implements OnInit {

  vehicleId = null;
  modeData: any;
  p1Data: any;
  pData: any;
  viewData:any=[];
  
  p1Second = "";
  p2Second = "";
  p3Second = "";
  p4Second = "";

  items = [
    {
      value: null,
      name: null,
      p1: 0,
      p2:null,
      p3:null,
      p4:null,
      p1Second: '',
      p2Second: '',
      p3Second: '',
      p4Second: ''
    }
  ];

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.getModes();
    this.showData();
  }

  ngOnInit(): void {
  }

  selectVehicle(event, index) {
    this.items[index]['value'] = event['id'];
    this.items[index]['name'] = event['regno'];
  }

  getModes() {
    this.common.loading++;
    this.api.getJavaPortDost(8083, 'ldmp/getmodtype')
      .subscribe(res => {
        this.common.loading--;
        console.log("res:", res);
        this.modeData = res['data'];

        this.p1Data = this.modeData.filter(obj => {
          return obj.value === 0
        })

        this.pData = this.modeData.filter(obj => {
          return obj.value !== 0
        })

        console.log("plData:", this.p1Data);
        console.log("pData:", this.pData);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  addMoreItems(i) {
    this.items.push({
      value: null,
      name: null,
      p1: 0,
      p2: null,
      p3: null,
      p4: null,
      p1Second: '',
      p2Second: '',
      p3Second: '',
      p4Second: '',
    });
  }

  saveData() {
    const data = this.items
      .map(item => {
        let preferences = [
          { modetype: item.p1, priority:item.p1, seconds: item.p1Second }
        ];
        if (item.p2) {
          preferences.push({ modetype:item.p2, priority: 1, seconds: item.p2Second });
        }

        if (item.p3) {
          preferences.push({ modetype:item.p3, priority: 2, seconds: item.p3Second });
        }

        if (item.p4) {
          preferences.push({ modetype:item.p4, priority: 3, seconds: item.p4Second });
        }
        return {
          "vehicleId": item.value,
          "preferences":preferences
        }
      })
      this.common.loading++;
      this.api.postJavaPortDost(8083, 'ldmp/save', JSON.stringify(data))
        .subscribe(res => {
          this.common.loading--;
          if (res['success']) {
            this.common.showToast(res['msg']);
          }
        }, err => {
          this.common.loading--;
          console.log(err);
        });
    console.log("items:", data);
  }

  showData() {
    this.common.loading++;
    this.api.getJavaPortDost(8083, 'ldmp/view')
      .subscribe(res => {
        this.common.loading--;
        this.viewData=res['data'];
        console.log("siteDet:", res);
        // console.log("vehId:",this.viewData[0]['vehicleId']);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

}
