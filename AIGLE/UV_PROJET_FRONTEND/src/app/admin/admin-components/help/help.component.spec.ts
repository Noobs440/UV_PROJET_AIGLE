import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpComponentAdmin } from './help.component';

describe('HelpComponentAdmin', () => {
  let component: HelpComponentAdmin;
  let fixture: ComponentFixture<HelpComponentAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpComponentAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpComponentAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

