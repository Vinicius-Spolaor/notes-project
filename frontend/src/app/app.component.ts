import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { LoadingService } from './core/services/loading.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { TokenStorageService } from './core/services/token-storage.service';
import { environment } from './environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  subs: Subscription = new Subscription();

  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadingService.loading$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.cdr.detectChanges();
    });

    this.subs.add(
      this.router.events.subscribe( (value: Event) => {
        if (value instanceof NavigationStart && value.url === '/'){
          if (this.tokenStorageService.getToken()){
            this.router.navigate(['/notes']);
          }
          else {
            this.router.navigate(['/login']);
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}