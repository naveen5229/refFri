import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxdetailComponent } from './taxdetail.component';

describe('TaxdetailComponent', () => {
  let component: TaxdetailComponent;
  let fixture: ComponentFixture<TaxdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
