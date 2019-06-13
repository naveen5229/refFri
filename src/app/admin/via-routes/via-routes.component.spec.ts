import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViaRoutesComponent } from './via-routes.component';

describe('ViaRoutesComponent', () => {
  let component: ViaRoutesComponent;
  let fixture: ComponentFixture<ViaRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViaRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViaRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
