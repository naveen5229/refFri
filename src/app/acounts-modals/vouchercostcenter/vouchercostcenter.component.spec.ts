import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchercostcenterComponent } from './vouchercostcenter.component';

describe('VouchercostcenterComponent', () => {
  let component: VouchercostcenterComponent;
  let fixture: ComponentFixture<VouchercostcenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VouchercostcenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VouchercostcenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
