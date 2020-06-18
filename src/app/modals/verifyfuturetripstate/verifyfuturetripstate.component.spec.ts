import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyfuturetripstateComponent } from './verifyfuturetripstate.component';

describe('VerifyfuturetripstateComponent', () => {
  let component: VerifyfuturetripstateComponent;
  let fixture: ComponentFixture<VerifyfuturetripstateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyfuturetripstateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyfuturetripstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
