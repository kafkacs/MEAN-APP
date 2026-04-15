import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
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
import { FormsModule } from '@angular/forms';
import { TextInput } from '../../shared/components/text-input/text-input';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export type UserRole = 'admin' | 'user';

@Component({
  selector: 'app-users',
  imports: [User, FormsModule, TextInput],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit, OnDestroy {
  private readonly usersApisService = inject(UsersApisService);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.filterUsersFormListener();
      this.removeUserListener();
    });
  }

  users = signal<UserI[]>([]);
  fullNameControl = new FormControl('');

  private scrollListenerFn!: () => void;
  private throttleTimer: NodeJS.Timeout | null = null;

  readonly limit = signal<number>(20);
  readonly lastFetchedCount = signal<number>(-1);
  readonly isFetching = signal<boolean>(false);

  readonly roleOptions: (UserRole | 'all')[] = ['all', 'admin', 'user'];
  readonly activeRole = signal<UserRole | 'all'>('all');

  get hasActiveFilters(): boolean {
    return this.activeRole() !== 'all' || !!this.fullNameControl.value?.trim();
  }

  ngOnInit(): void {
    this.findAllUsers({ skip: 0, limit: this.limit() }, false);
    this.setupScrollListener();

    this.fullNameControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.resetAndFetch();
      });
  }

  onCreateUser() {
    this.router.navigate([`create-user`]);
  }

  onRoleChange(role: UserRole | 'all'): void {
    if (this.activeRole() === role) return;
    this.activeRole.set(role);
    this.resetAndFetch();
  }

  clearFilters(): void {
    this.activeRole.set('all');
    this.fullNameControl.setValue('');
    this.resetAndFetch();
  }

  private resetAndFetch(): void {
    this.lastFetchedCount.set(-1);
    this.findAllUsers({ skip: 0, limit: this.limit() }, false);
  }

  private buildFilters(): Partial<FilterUsersDto> {
    const filters: Partial<FilterUsersDto> = {};

    if (this.activeRole() !== 'all') {
      filters.role = this.activeRole() as UserRole;
    }

    const fullName = this.fullNameControl.value?.trim();
    if (fullName) {
      filters.fullName = fullName;
    }

    return filters;
  }

  removeUserListener() {
    if (!!this.usersService.removeUser()) {
      this.users.update((prev) =>
        prev.filter((user) => user._id !== this.usersService.removeUser()!._id),
      );
      this.usersService.removeUser.set(null);
    }
  }

  filterUsersFormListener() {
    if (!!this.usersService.filterUsers()) {
      this.lastFetchedCount.set(-1);
      this.findAllUsers(this.usersService.filterUsers()!, false);
    }
  }

  findAllUsers(filterUsersDto: FilterUsersDto, isOnScroll: boolean) {
    if (this.isFetching()) return;

    this.isFetching.set(true);

    this.usersApisService
      .findAllUsers({
        limit: this.limit(),
        skip: isOnScroll ? filterUsersDto.skip : 0,
        ...this.buildFilters(),
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isFetching.set(false);
          this.cd.detectChanges();
        }),
      )
      .subscribe({
        next: (response) => {
          const incoming = response.data;

          this.lastFetchedCount.set(incoming.length);

          if (isOnScroll) {
            this.users.update((prev) => [...prev, ...incoming]);
          } else {
            this.users.set(incoming);
          }
        },
        error: (err: DelegatedUIErrorI) => {
          if (!isOnScroll) this.users.set([]);
          console.error(err.title, err.description);
        },
      });
  }

  private setupScrollListener(): void {
    this.scrollListenerFn = this.renderer.listen('window', 'scroll', () => {
      if (this.throttleTimer) return;
      this.throttleTimer = setTimeout(() => {
        this.checkScrollPosition();
        this.throttleTimer = null;
      }, 200);
    });
  }

  private checkScrollPosition(): void {
    if (this.isFetching()) return;
    if (this.lastFetchedCount() === 0) return;
    if (this.lastFetchedCount() < this.limit()) return;

    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= scrollableHeight - 200) {
      this.findAllUsers({ skip: this.users().length, limit: this.limit() }, true);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollListenerFn) this.scrollListenerFn();
    if (this.throttleTimer) clearTimeout(this.throttleTimer);
  }
}
