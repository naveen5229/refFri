import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VscTatComponent } from './vsc-tat.component';

describe('VscTatComponent', () => {
  let component: VscTatComponent;
  let fixture: ComponentFixture<VscTatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VscTatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VscTatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
