import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUserTemplateComponent } from './save-user-template.component';

describe('SaveUserTemplateComponent', () => {
  let component: SaveUserTemplateComponent;
  let fixture: ComponentFixture<SaveUserTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveUserTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUserTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
