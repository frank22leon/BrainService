import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTicketsUserComponent } from './view-tickets-user.component';

describe('ViewTicketsUserComponent', () => {
  let component: ViewTicketsUserComponent;
  let fixture: ComponentFixture<ViewTicketsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTicketsUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTicketsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
