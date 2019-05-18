import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFoComponent } from './add-fo.component';

describe('AddFoComponent', () => {
  let component: AddFoComponent;
  let fixture: ComponentFixture<AddFoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
