import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreModalsComponent } from './tyre-modals.component';

describe('TyreModalsComponent', () => {
  let component: TyreModalsComponent;
  let fixture: ComponentFixture<TyreModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TyreModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TyreModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
