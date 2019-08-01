import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicPartyDetailsComponent } from './basic-party-details.component';

describe('BasicPartyDetailsComponent', () => {
  let component: BasicPartyDetailsComponent;
  let fixture: ComponentFixture<BasicPartyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicPartyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicPartyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
