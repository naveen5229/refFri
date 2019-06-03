import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModalServiceComponent } from './view-modal-service.component';

describe('ViewModalServiceComponent', () => {
  let component: ViewModalServiceComponent;
  let fixture: ComponentFixture<ViewModalServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewModalServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewModalServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
