import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ticket-trails',
  templateUrl: './ticket-trails.component.html',
  styleUrls: ['./ticket-trails.component.scss','../../pages/pages.component.css']
})
export class TicketTrailsComponent implements OnInit {
  trails = [];
  comments = [];
  commentsFlag = false;
  trailFlag = false;
  
  title="";
  headings = [];
  datas = [];
  

  constructor(public common: CommonService,
    private activeModal: NgbActiveModal) {
    // this.title = this.common.params.title;
    //this.headings = this.common.params.headers;
    console.log(this.common.params)

    if (this.common.params.type && this.common.params.type == 'comments') {
      this.title="Comment List"
      this.comments = this.common.params.commmentList;
      this.commentsFlag = true;

    }

   else{
      this.title="Trail List";
      this.trails=this.common.params.trailList ? this.common.params.trailList : this.common.params.data ?this.common.params.data:[];
      this.trailFlag=true;
    }
    
     
      if(!this.common.params.type || this.common.params.type == 'trail'){
        if(this.trails){
      this.trails.map(data => {
        if (data.spent_time > 0) {
          let t = data.spent_time;
          let m = Math.floor((t / 60));
          let M = m % 60 > 9 ? m % 60 : '0' + m % 60;
          let H: any = Math.floor(m / 60) > 9 ? Math.floor(m / 60) : '0' + Math.floor(m / 60);
          let S = t % 60 > 9 ? t % 60 : '0' + t % 60;
          data.spent_time = H + ":" + M + ":" + S;
          console.log(H + ":" + M + ":" + S);
          if (H > 23) {
            let D = Math.floor(H / 24);
            let h = H % 24 > 9 ? H % 24 : '0' + H % 24;
            data.spent_time = D + " Day" + ' ' + h + ":" + M + ":" + S;
            console.log(D + " Day" + ' ' + h + ":" + M + ":" + S);
          }
      }});
    }
      
    console.log(this.trails)
  }
}

  ngOnInit() {
  }

 
  closeModal() {
    this.activeModal.close();
  }
}
