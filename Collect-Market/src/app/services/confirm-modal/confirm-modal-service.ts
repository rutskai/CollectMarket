import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalService {
  visible = false;

   /**
   * Abre el modal de confirmación.
   */
  open() { 
    this.visible = true; 
  }

    /**
   * Cierra el modal de confirmación.
   */
  close() { 
    this.visible = false; 
  }
}