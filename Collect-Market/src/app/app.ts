import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { LoginModalService } from './services/login-modal/login-modal-service';
import { LoginModal } from './components/login-modal/login-modal';
import { Footer } from './components/footer/footer';
import { ConfirmModal } from './components/confirm-modal/confirm-modal';
import { ConfirmModalService } from './services/confirm-modal/confirm-modal-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, LoginModal,ConfirmModal, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Collect-Market');

  /**
   * Inyecta el servicio del modal de login
   * para controlarlo desde la plantilla.
   *
   * @param modalService Servicio que gestiona la visibilidad del modal.
   */
  
  constructor(public modalService: LoginModalService, public confirmModalService: ConfirmModalService) {}
}
