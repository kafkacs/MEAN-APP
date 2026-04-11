import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import { UserI } from '../../shared/interfaces/user.interface';
import { UsersApisService } from './users-apis-service';
import { UsersService } from './users-service';
import { FilterUsersDto } from './dtos/filter-users.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/internal/operators/finalize';
import { DelegatedUIErrorI } from '../../shared/interfaces/delegated-ui-error.interface';
import { User } from './user/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [User],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  private readonly usersApisService = inject(UsersApisService);
  private readonly usersService = inject(UsersService);

  private readonly router = inject(Router);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly renderer = inject(Renderer2);

  private destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.filterUsersFormListener();
      this.removeUserListener();
    });
  }

  users = signal<UserI[]>([]);

  scrollListenerFn!: () => void;
  throttleTimer!: NodeJS.Timeout | null;

  skip = signal<number>(0);
  limit = signal<number>(20);
  lastFetchedCount = signal<number>(-1);
  isFetching = signal<boolean>(false);

  ngOnInit(): void {
    this.findAllUsers({ skip: 0, limit: this.limit() }, false);
  }

  onCreateUser() {
    this.router.navigate([`create-user`]);
  }

  removeUserListener() {
    if (!!this.usersService.removeUser()) {
      this.users().splice(
        this.users().findIndex((user) => user._id === this.usersService.removeUser()!._id),
        1,
      );
      this.usersService.removeUser.set(null);
    }
  }

  filterUsersFormListener() {
    if (!!this.usersService.filterUsers()) {
      this.findAllUsers(this.usersService.filterUsers()!, false);
    }
  }

  findAllUsers(filterUsersDto: FilterUsersDto, isOnScroll: boolean) {
    this.usersApisService
      .findAllUsers({
        limit: this.limit(),
        skip: isOnScroll ? filterUsersDto.skip : 0,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isFetching.update(() => false);
          this.cd.detectChanges();
        }),
      )
      .subscribe({
        next: (productsFindResponse) => {
          this.users.set(productsFindResponse.data);
        },
        error: (err: DelegatedUIErrorI) => {
          this.users.set([]);
          console.log(err.description, err.title);
        },
      });
  }

  setupScrollListener() {
    this.scrollListenerFn = this.renderer.listen('window', 'scroll', () => {
      if (this.throttleTimer) return;

      this.throttleTimer = setTimeout(() => {
        this.checkScrollPosition();
        this.throttleTimer = null;
      }, 200);
    });
  }

  checkScrollPosition() {
    if (this.isFetching() || this.lastFetchedCount() === 0) return;
    if (this.lastFetchedCount() < this.limit()) return;

    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    const threshold = 200;

    if (scrollPosition >= scrollableHeight - threshold) {
      this.findAllUsers(
        {
          skip: this.users().length,
          limit: this.limit(),
        },
        true,
      );
    }
  }
}
