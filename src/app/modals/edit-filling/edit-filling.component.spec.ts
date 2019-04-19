import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFillingComponent } from './edit-filling.component';

describe('EditFillingComponent', () => {
  let component: EditFillingComponent;
  let fixture: ComponentFixture<EditFillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
