import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveItemsComponent } from './receive-items.component';

describe('ReceiveItemsComponent', () => {
  let component: ReceiveItemsComponent;
  let fixture: ComponentFixture<ReceiveItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
