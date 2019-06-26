import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightInputLocationComponent } from './freight-input-location.component';

describe('FreightInputLocationComponent', () => {
  let component: FreightInputLocationComponent;
  let fixture: ComponentFixture<FreightInputLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightInputLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightInputLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
