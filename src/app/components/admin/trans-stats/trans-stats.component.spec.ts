import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransStatsComponent } from './trans-stats.component';

describe('TransStatsComponent', () => {
  let component: TransStatsComponent;
  let fixture: ComponentFixture<TransStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
