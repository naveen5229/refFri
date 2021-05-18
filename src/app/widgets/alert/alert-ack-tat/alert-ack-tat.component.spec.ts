import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertAckTatComponent } from './alert-ack-tat.component';

describe('AlertAckTatComponent', () => {
  let component: AlertAckTatComponent;
  let fixture: ComponentFixture<AlertAckTatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertAckTatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertAckTatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
