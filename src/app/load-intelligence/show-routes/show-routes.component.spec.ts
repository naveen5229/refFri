import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRoutesComponent } from './show-routes.component';

describe('ShowRoutesComponent', () => {
  let component: ShowRoutesComponent;
  let fixture: ComponentFixture<ShowRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
