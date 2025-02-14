import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IPortfolioItem } from '../../../interfaces/userInterface';

@Component({
  selector: 'app-portfolio-holdings',
  imports: [CommonModule, RouterModule],
  templateUrl: './portfolio-holdings.component.html',
  styleUrl: './portfolio-holdings.component.css',
})
export class PortfolioHoldingsComponent implements OnInit {
  @Input() portfolio: IPortfolioItem[] = [];

  ngOnInit(): void {
    this.portfolio.forEach((holding) => {
      holding.totalValue = holding.quantity * holding.stock.price;
    });

    const totalPortfolioValue = this.portfolio.reduce(
      (total, holding) => total + (holding.totalValue || 0),
      0
    );

    this.portfolio.forEach((holding) => {
      if (totalPortfolioValue > 0) {
        holding.allocation =
          (holding.totalValue ?? 0 / totalPortfolioValue) * 100;
      }
    });
  }
}
