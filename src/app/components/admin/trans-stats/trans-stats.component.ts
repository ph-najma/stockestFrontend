import { Component, Input } from '@angular/core';
import { IStatistics } from '../../../interfaces/interface';

@Component({
  selector: 'app-trans-stats',
  imports: [],
  templateUrl: './trans-stats.component.html',
  styleUrl: './trans-stats.component.css',
})
export class TransStatsComponent {
  @Input() stats: IStatistics = {
    buyTransactions: 0,
    sellTransactions: 0,
    total: 0,
    totalVolume: 0,
  };
}
