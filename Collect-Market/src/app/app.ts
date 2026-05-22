import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { LoginModalService } from './services/login-modal/login-modal-service';
import { LoginModal } from './components/login-modal/login-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, LoginModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Collect-Market');
  constructor(public modalService: LoginModalService) {}
}
