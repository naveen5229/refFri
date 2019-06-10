import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubModalServiceComponent } from './view-sub-modal-service.component';

describe('ViewSubModalServiceComponent', () => {
  let component: ViewSubModalServiceComponent;
  let fixture: ComponentFixture<ViewSubModalServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSubModalServiceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubModalServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
