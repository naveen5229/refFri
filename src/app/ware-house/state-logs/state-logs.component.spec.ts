import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateLogsComponent } from './state-logs.component';

describe('StateLogsComponent', () => {
  let component: StateLogsComponent;
  let fixture: ComponentFixture<StateLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
