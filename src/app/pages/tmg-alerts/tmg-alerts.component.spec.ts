import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmgAlertsComponent } from './tmg-alerts.component';

describe('TmgAlertsComponent', () => {
  let component: TmgAlertsComponent;
  let fixture: ComponentFixture<TmgAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmgAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmgAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
