import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss', '../../pages/pages.component.css']
})
export class ReminderComponent implements OnInit {

  reminder = {
    date: '',
    time: ''
  };
  title = '';
  dates = [{
    name: 'Today',
    date: this.common.getDate(),
  }, {
    name: 'Tomorrow',
    date: this.common.getDate(1)
  }, {
    name: 'Tomorrow + 1',
    date: this.common.getDate(2)
  }];

  hours = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24]
  ];

  showHours = false;


  constructor(
    private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
    if (this.common.params.title) {
      this.title = this.common.params.title;
    }
    else {
      this.title = "Reminder";
    }
  }

  ngOnDestroy(){}
ngOnInit() {
    console.log('ionViewDidLoad BuyTimePage');
  }

  dismiss() {
    this.activeModal.close();
  }

  setReminder() {
    if (!this.reminder.date) {
      this.common.showToast('Select A Date!');
      return;
    } else if (!this.reminder.time) {
      this.common.showToast('Select An hour!');
      return;
    }
    console.log("returndata", this.common.params.returnData);

    if (this.common.params.returnData) {
      console.log("returndata", this.common.dateFormatter(this.reminder.date).split(' ')[0] + ' ' + (this.reminder.time < '10' ? '0' + this.reminder.time : this.reminder.time) + ':00')
      setTimeout(() => {
        this.activeModal.close({ date: this.common.dateFormatter(this.reminder.date).split(' ')[0] + ' ' + (this.reminder.time < '10' ? '0' + this.reminder.time : this.reminder.time) + ':00' });
      });
    }
    else {
      const params = {
        fo_ticket_allocation_id: this.common.params['fo_ticket_allocation_id'],
        remindtime: this.common.dateFormatter(this.reminder.date).split(' ')[0] + ' ' + (this.reminder.time < '10' ? '0' + this.reminder.time : this.reminder.time) + ':00'
      };

      console.log('Params: ', params);
      this.common.loading++;
      this.api.post('FoTickets/setReminderTime', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.common.showToast(res['msg']);
          this.dismiss();
        }, err => {
          console.error(err);
          this.common.showError();
          this.common.loading--;
        });
    }
  }

  handleDate(event) {
    console.log('Reminder:', event.target.value, event.target.value[0], (event.target.value[0] > '1'));

    if (!event.target.value || event.target.value[0] < '2') return;

    this.reminder.date = this.common.dateFormatter(event.target.value);
    console.log("Date error:", this.reminder.date);
    if (this.reminder.date)
      this.showHours = true;
  }

}
