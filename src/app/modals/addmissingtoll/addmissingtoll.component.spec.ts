import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmissingtollComponent } from './addmissingtoll.component';

describe('AddmissingtollComponent', () => {
  let component: AddmissingtollComponent;
  let fixture: ComponentFixture<AddmissingtollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddmissingtollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmissingtollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
