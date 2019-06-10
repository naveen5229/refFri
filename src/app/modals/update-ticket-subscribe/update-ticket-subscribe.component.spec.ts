import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTicketSubscribeComponent } from './update-ticket-subscribe.component';

describe('UpdateTicketSubscribeComponent', () => {
  let component: UpdateTicketSubscribeComponent;
  let fixture: ComponentFixture<UpdateTicketSubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTicketSubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTicketSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
