import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingCourseComponent } from './trading-course.component';

describe('TradingCourseComponent', () => {
  let component: TradingCourseComponent;
  let fixture: ComponentFixture<TradingCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
