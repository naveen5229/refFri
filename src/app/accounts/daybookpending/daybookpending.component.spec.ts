import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaybookpendingComponent } from './daybookpending.component';

describe('DaybookpendingComponent', () => {
  let component: DaybookpendingComponent;
  let fixture: ComponentFixture<DaybookpendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaybookpendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaybookpendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
