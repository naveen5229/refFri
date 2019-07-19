import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteInOutComponent } from './site-in-out.component';

describe('SiteInOutComponent', () => {
  let component: SiteInOutComponent;
  let fixture: ComponentFixture<SiteInOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteInOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteInOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
