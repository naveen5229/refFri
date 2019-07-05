import { Component, OnInit, Renderer } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lr-pod-receipts',
  templateUrl: './lr-pod-receipts.component.html',
  styleUrls: ['./lr-pod-receipts.component.scss']
})
export class LrPodReceiptsComponent implements OnInit {
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
    var enddate = new Date(this.common.dateFormatter(this.endDate).split(' ')[0]);
    let params = "startDate=" + this.common.dateFormatter(this.startDate).split(' ')[0] +
      "&endDate=" + this.common.dateFormatter(enddate.setDate(enddate.getDate() + 1)).split(' ')[0];

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
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'blue', action: this.getImage.bind(this, doc, 'site') };

        }
        else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  getImage(receipt) {
    console.log(receipt);
    let images = [{
      name: "POD-1",
      image: receipt._img1
    },
    {
      name: "POD-2",
      image: receipt._img2
    },
    ];
    console.log("images:", images);
    this.common.params = { images, title: 'LR Details' };
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout' });
  }
}
