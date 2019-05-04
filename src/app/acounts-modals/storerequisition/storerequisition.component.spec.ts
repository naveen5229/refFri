import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorerequisitionComponent } from './storerequisition.component';

describe('StorerequisitionComponent', () => {
  let component: StorerequisitionComponent;
  let fixture: ComponentFixture<StorerequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorerequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorerequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
