import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsigneeComponent } from './add-consignee.component';

describe('AddConsigneeComponent', () => {
  let component: AddConsigneeComponent;
  let fixture: ComponentFixture<AddConsigneeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddConsigneeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConsigneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
