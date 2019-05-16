import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMappingComponent } from './map-mapping.component';

describe('MapMappingComponent', () => {
  let component: MapMappingComponent;
  let fixture: ComponentFixture<MapMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
