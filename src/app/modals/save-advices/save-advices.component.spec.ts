import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAdvicesComponent } from './save-advices.component';

describe('SaveAdvicesComponent', () => {
  let component: SaveAdvicesComponent;
  let fixture: ComponentFixture<SaveAdvicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveAdvicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveAdvicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
