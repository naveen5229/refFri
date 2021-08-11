import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskPermissionComponent } from './ask-permission.component';

describe('AskPermissionComponent', () => {
  let component: AskPermissionComponent;
  let fixture: ComponentFixture<AskPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
