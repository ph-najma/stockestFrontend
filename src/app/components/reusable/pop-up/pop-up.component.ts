import { Component, OnInit } from '@angular/core';
import { PopUpService } from '../../../services/pop-up.service';
@Component({
  selector: 'app-pop-up',
  imports: [],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.css',
})
export class PopUpComponent implements OnInit {
  message: string | null = null;

  constructor(private popMessageService: PopUpService) {}

  ngOnInit(): void {
    this.popMessageService.message$.subscribe((msg) => {
      this.message = msg;

      if (msg) {
        setTimeout(() => {
          this.popMessageService.clearMessage();
        }, 3000);
      }
    });
  }
}
