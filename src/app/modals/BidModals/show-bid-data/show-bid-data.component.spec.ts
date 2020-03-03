import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBidDataComponent } from './show-bid-data.component';

describe('ShowBidDataComponent', () => {
  let component: ShowBidDataComponent;
  let fixture: ComponentFixture<ShowBidDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowBidDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowBidDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
