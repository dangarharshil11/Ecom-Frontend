import { Injectable } from '@angular/core';

import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private messageService: MessageService) { }

  showSuccess(msg: string): void{
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  showError(msg: string): void{
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }
}
