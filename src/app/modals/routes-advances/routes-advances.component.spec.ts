import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesAdvancesComponent } from './routes-advances.component';

describe('RoutesAdvancesComponent', () => {
  let component: RoutesAdvancesComponent;
  let fixture: ComponentFixture<RoutesAdvancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutesAdvancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesAdvancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
