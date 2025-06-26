import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsysDashboardComponent } from './adminsys-dashboard.component';

describe('AdminsysDashboardComponent', () => {
  let component: AdminsysDashboardComponent;
  let fixture: ComponentFixture<AdminsysDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminsysDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminsysDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
