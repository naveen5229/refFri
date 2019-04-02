import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualHaltComponent } from './manual-halt.component';

describe('ManualHaltComponent', () => {
  let component: ManualHaltComponent;
  let fixture: ComponentFixture<ManualHaltComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualHaltComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualHaltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
