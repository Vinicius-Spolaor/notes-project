import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements OnInit {
  constructor(
    private router: Router,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {}

  onBackToHomeClick(): void {
    if (this.tokenService.getToken()) {
      this.router.navigate(['/notes']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
