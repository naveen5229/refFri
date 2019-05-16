import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanaceDashboardComponent } from './maintenanace-dashboard.component';

describe('MaintenanaceDashboardComponent', () => {
  let component: MaintenanaceDashboardComponent;
  let fixture: ComponentFixture<MaintenanaceDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanaceDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanaceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
