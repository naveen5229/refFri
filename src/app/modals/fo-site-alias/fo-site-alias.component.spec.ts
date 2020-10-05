import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoSiteAliasComponent } from './fo-site-alias.component';

describe('FoSiteAliasComponent', () => {
  let component: FoSiteAliasComponent;
  let fixture: ComponentFixture<FoSiteAliasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoSiteAliasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoSiteAliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
