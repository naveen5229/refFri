import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoFsMappingComponent } from './fo-fs-mapping.component';

describe('FoFsMappingComponent', () => {
  let component: FoFsMappingComponent;
  let fixture: ComponentFixture<FoFsMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoFsMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoFsMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
