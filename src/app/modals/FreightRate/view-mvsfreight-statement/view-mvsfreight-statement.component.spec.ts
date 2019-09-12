import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMVSFreightStatementComponent } from './view-mvsfreight-statement.component';

describe('ViewMVSFreightStatementComponent', () => {
  let component: ViewMVSFreightStatementComponent;
  let fixture: ComponentFixture<ViewMVSFreightStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMVSFreightStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMVSFreightStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
