import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MvGpsApiHistoryComponent } from './mv-gps-api-history.component';

describe('MvGpsApiHistoryComponent', () => {
  let component: MvGpsApiHistoryComponent;
  let fixture: ComponentFixture<MvGpsApiHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MvGpsApiHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvGpsApiHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
