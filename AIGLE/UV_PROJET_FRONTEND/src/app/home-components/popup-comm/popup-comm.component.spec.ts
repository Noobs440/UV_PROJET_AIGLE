import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCommComponent } from './popup-comm.component';

describe('PopupCommComponent', () => {
  let component: PopupCommComponent;
  let fixture: ComponentFixture<PopupCommComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupCommComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupCommComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
