import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstdataComponent } from './gstdata.component';

describe('GstdataComponent', () => {
  let component: GstdataComponent;
  let fixture: ComponentFixture<GstdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
