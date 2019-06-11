import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoSiteCountComponent } from './fo-site-count.component';

describe('FoSiteCountComponent', () => {
  let component: FoSiteCountComponent;
  let fixture: ComponentFixture<FoSiteCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoSiteCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoSiteCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
