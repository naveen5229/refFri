import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrictMappingComponent } from './strict-mapping.component';

describe('StrictMappingComponent', () => {
  let component: StrictMappingComponent;
  let fixture: ComponentFixture<StrictMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrictMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrictMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
