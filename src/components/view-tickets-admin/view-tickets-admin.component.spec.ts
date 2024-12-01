import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTicketsAdminComponent } from './view-tickets-admin.component';

describe('ViewTicketsAdminComponent', () => {
  let component: ViewTicketsAdminComponent;
  let fixture: ComponentFixture<ViewTicketsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTicketsAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTicketsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
