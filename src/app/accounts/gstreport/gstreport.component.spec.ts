import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstreportComponent } from './gstreport.component';

describe('GstreportComponent', () => {
  let component: GstreportComponent;
  let fixture: ComponentFixture<GstreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
