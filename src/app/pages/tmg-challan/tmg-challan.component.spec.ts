import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmgChallanComponent } from './tmg-challan.component';

describe('TmgChallanComponent', () => {
  let component: TmgChallanComponent;
  let fixture: ComponentFixture<TmgChallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmgChallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmgChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
