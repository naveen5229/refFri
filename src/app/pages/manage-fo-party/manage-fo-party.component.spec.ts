import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFoPartyComponent } from './manage-fo-party.component';

describe('ManageFoPartyComponent', () => {
  let component: ManageFoPartyComponent;
  let fixture: ComponentFixture<ManageFoPartyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageFoPartyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFoPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
