import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTicketsSoporteComponent } from './view-tickets-soporte.component';

describe('ViewTicketsSoporteComponent', () => {
  let component: ViewTicketsSoporteComponent;
  let fixture: ComponentFixture<ViewTicketsSoporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTicketsSoporteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTicketsSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
