import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLorryDetailsComponent } from './edit-lorry-details.component';

describe('EditLorryDetailsComponent', () => {
  let component: EditLorryDetailsComponent;
  let fixture: ComponentFixture<EditLorryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLorryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLorryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
