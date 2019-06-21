import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BufferPolylineComponent } from './buffer-polyline.component';

describe('BufferPolylineComponent', () => {
  let component: BufferPolylineComponent;
  let fixture: ComponentFixture<BufferPolylineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BufferPolylineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BufferPolylineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
