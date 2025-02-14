import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { CommonModule, NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { IMessage } from '../../../interfaces/userInterface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ai',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './ai.component.html',
  styleUrl: './ai.component.css',
})
export class AiComponent implements OnDestroy {
  queryForm: FormGroup;
  isLoading = false;
  conversation: IMessage[] = [];
  private subscription = new Subscription();

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.queryForm = this.fb.group({
      query: [''],
    });
  }

  onSubmit() {
    const query = this.queryForm.get('query')?.value.trim();
    if (!query) return;

    this.isLoading = true;
    this.conversation.push({ role: 'user', content: query });

    const generateSubscription = this.apiService
      .generatePrompt(query)
      .subscribe(
        (data: { response: string }) => {
          this.conversation.push({
            role: 'assistant',
            content: data.response || 'No response received.',
          });
          this.isLoading = false;
          this.queryForm.reset();
        },
        (error: HttpErrorResponse) => {
          console.error('Error:', error);
          this.conversation.push({
            role: 'assistant',
            content: 'An error occurred while generating the response.',
          });
          this.isLoading = false;
        }
      );
    this.subscription.add(generateSubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
