import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VechileTrailsComponent } from './vechile-trails.component';

describe('VechileTrailsComponent', () => {
  let component: VechileTrailsComponent;
  let fixture: ComponentFixture<VechileTrailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VechileTrailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VechileTrailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
