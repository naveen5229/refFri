import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightInputWithoutLocationComponent } from './freight-input-without-location.component';

describe('FreightInputWithoutLocationComponent', () => {
  let component: FreightInputWithoutLocationComponent;
  let fixture: ComponentFixture<FreightInputWithoutLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightInputWithoutLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightInputWithoutLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
