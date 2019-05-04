import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSitesComponent } from './sub-sites.component';

describe('SubSitesComponent', () => {
  let component: SubSitesComponent;
  let fixture: ComponentFixture<SubSitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubSitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
