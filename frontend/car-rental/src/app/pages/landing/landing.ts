import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, TranslateModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {}
