import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingTableComponent } from './listing-table.component';

describe('ListingTableComponent', () => {
  let component: ListingTableComponent;
  let fixture: ComponentFixture<ListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
