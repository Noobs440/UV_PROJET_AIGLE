import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListchatAdminComponent } from './listchat-admin.component';

describe('ListchatAdminComponent', () => {
  let component: ListchatAdminComponent;
  let fixture: ComponentFixture<ListchatAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListchatAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListchatAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
