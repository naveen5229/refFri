import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherUsageComponent } from './other-usage.component';

describe('OtherUsageComponent', () => {
  let component: OtherUsageComponent;
  let fixture: ComponentFixture<OtherUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
