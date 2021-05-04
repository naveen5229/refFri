import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

@Component({
  selector: 'loc-preference',
  templateUrl: './loc-preference.component.html',
  styleUrls: ['./loc-preference.component.scss']
})
export class LocPreferenceComponent implements OnInit {


  table = null;

  vehicleId = null;
  modeData: any;
  p1Data: any;
  pData: any;
  viewData:any=[];
  objData:any={};
  data=[];
  
  p1Second = "";
  p2Second = "";
  p3Second = "";
  p4Second = "";

  items = [
    {
      value: null,
      name: null,
      p1: null,
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
    this.common.refresh = this.refresh.bind(this);
    this.getModes();
    this.showData();
  }

  ngOnInit(): void {
  }

  refresh() {
    this.showData();
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

        // this.p1Data = this.modeData.filter(obj => {
        //   return obj.value === 0
        // })

        // this.pData = this.modeData.filter(obj => {
        //   return obj.value !== 0
        // })

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
      p1: null,
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

        // if (item.p3) {
        //   preferences.push({ modetype:item.p3, priority: 2, seconds: item.p3Second });
        // }

        // if (item.p4) {
        //   preferences.push({ modetype:item.p4, priority: 3, seconds: item.p4Second });
        // }
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
            this.common.showToast(res['message']);
            this.refresh();
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
        console.log("realData:",this.viewData);
        this.data = []
        this.viewData.map(e=>{
          let singleRow = {
            vehicle_id:e.vehicleId,
            regNo : e.regNo,
            p1Name : e.preferences[0].modeName,
            p1Sec : e.preferences[0].seconds,
            p2Name : e.preferences[1]?e.preferences[1].modeName:null,
            p2Sec : e.preferences[1]?e.preferences[1].seconds:null
          };
          this.data.push(singleRow);
        });
        this.table = this.setTable();
      
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }



  // resetTable() {
  //   this.table.data = {
  //     headings: {},
  //     columns: []
  //   };
  // }

  setTable() {
  let headings = {
    vehicle: { title: 'Vehicle', placeholder: 'Vehicle' },
    p1Name: { title: 'P1 Mode', placeholder: 'P1 Mode' },
    p1Sec: { title: 'P1 Sec', placeholder: 'P1 Sec' },
    p2Name: { title: 'P2 Mode', placeholder: 'P2 Mode' },
    p2Sec: { title: 'P2 Sec', placeholder: 'P2 Sec' },
    action: { title: 'Action', placeholder: 'Action' }
  };
  return {
    data: {
      headings: headings,

      columns: this.getTableColumns(),
    },
    settings: {
      hideHeader: true,
      tableHeight: "auto"
    }
  }
}

getTableColumns() {
  let columns = [];
  this.data.map(doc => {
    let column = {
      vehicle: { value: doc.regNo },
      p1Name : { value: doc.p1Name },
      p1Sec: { value: doc.p1Sec },
      p2Name: { value: doc.p2Name },
      p2Sec: { value: doc.p2Sec },
      action:{value: "",isHTML: false,action: null,icons: this.actionIcons(doc)}
      // action: { value: '', class: 'far fa-edit', action: this.setData.bind(this, doc) }
    };
    columns.push(column);
  });
  return columns;
}

actionIcons(doc){
  let icons = [
    {
      class: "fas fa-trash-alt",
      action: this.deleteRecord.bind(this, doc)
    }
  ];
  return icons;
}









  deleteRecord(doc) {
    console.log("doc:",doc);
      this.common.params = {
        title: 'Delete  ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.postJavaPortDost(8083, 'ldmp/delete'+(doc.vehicle_id?'/'+doc.vehicle_id:''),null)
            .subscribe(res => {
              this.common.loading--;
              this.common.showToast(res['message']);
              this.refresh();

            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
  }

}
