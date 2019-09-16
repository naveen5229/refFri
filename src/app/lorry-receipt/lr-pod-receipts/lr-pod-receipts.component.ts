import { Component, OnInit, Renderer } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LrPodDetailsComponent } from '../../modals/lr-pod-details/lr-pod-details.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

@Component({
  selector: 'lr-pod-receipts',
  templateUrl: './lr-pod-receipts.component.html',
  styleUrls: ['./lr-pod-receipts.component.scss']
})
export class LrPodReceiptsComponent implements OnInit {


  dropDown = [
    { name: 'Pending', id: 0 },
    { name: 'Complete', id: 1 },
  ];

  vehicleStatus = 0;
  data = [];
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
  viewImages = null;
  startDate = new Date(new Date().setDate(new Date().getDate() - 15));
  endDate = new Date();
  constructor(
    public api: ApiService,
    public common: CommonService,
    private datePipe: DatePipe,
    public user: UserService,
    public route: ActivatedRoute,
    private modalService: NgbModal,
    public renderer: Renderer
  ) {

  }

  ngOnInit() {
  }

  getLorryPodReceipts() {
    console.log("status", this.vehicleStatus);
    var enddate = new Date(this.common.dateFormatter(this.endDate).split(' ')[0]);
    let params = "startDate=" + this.common.dateFormatter(this.startDate).split(' ')[0] +
      "&endDate=" + this.common.dateFormatter(enddate.setDate(enddate.getDate() + 1)).split(' ')[0] + "&status=" + this.vehicleStatus;

    ++this.common.loading;
    this.api.get('LorryReceiptsOperation/getLRPodReceipts?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        this.table = {
          data: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        this.valobj = {};
        if (!this.data || !this.data.length) {
          //document.getElementById('mdl-body').innerHTML = 'No record exists';
          return;
        }
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      }, err => {

        this.common.loading--;
        console.log(err);
      });
  }
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        if (this.headings[i] == "Action") {
          this.valobj[this.headings[i]] = {
            value: "", action: null,
            icons: [{ class: 'fa fa-edit', action: this.openPodDeatilsModal.bind(this, doc) },
            { class: 'fa fa-eye', action: this.getPodImage.bind(this, doc) },
            { class: 'fa fa-trash', action: this.deleteLr.bind(this, doc) }]
          };
        }
        else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  deleteLr(doc) {
    console.log("values", doc);
    const params = {
      rowid: doc._id,
    }

  }


  openPodDeatilsModal(pod) {
    console.log("====podr=====", pod);
    let podDetails = {
      podId: pod._id,
      lrId: pod._lrid
    }
    console.log("====podDetails=====", podDetails);

    this.common.params = { podDetails: podDetails };
    const activeModel = this.modalService.open(LrPodDetailsComponent, { size: 'lg', container: 'nb-layout', windowClass: 'lrpoddetail' });
    activeModel.result.then(data => {
    })
  }

  getPodImage(receipt) {
    console.log("val", receipt);
    if (receipt._docid) {
      let refdata = {
        refid: "",
        reftype: "",
        doctype: "",
        docid: receipt._docid
      }
      this.common.params = { refdata: refdata, title: 'docImage' };
      const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', windowClass: 'imageviewcomp' });
    }
    else {
      this.common.showError("There is No image");
    }
  }
}
