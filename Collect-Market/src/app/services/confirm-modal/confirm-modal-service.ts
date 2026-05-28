import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalService {

   showConfirm = signal(false);

  /**
   * Abre el modal de confirmación.
   */
  open() { this.showConfirm.set(true); }

  /**
   * Cierra el modal de confirmación.
   */
  close() { this.showConfirm.set(false); }  
  
}
