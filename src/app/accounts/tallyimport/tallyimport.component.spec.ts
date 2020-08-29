import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TallyimportComponent } from './tallyimport.component';

describe('TallyimportComponent', () => {
  let component: TallyimportComponent;
  let fixture: ComponentFixture<TallyimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TallyimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TallyimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
