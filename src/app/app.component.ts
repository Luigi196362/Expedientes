import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isDarkTheme = false;
  title = 'Expedientes';

  ngOnInit(): void {
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
      // Si existe un tema guardado, lo aplicamos
      this.isDarkTheme = storedTheme === 'dark';
    } else {
      // Si no hay preferencia guardada, usamos la preferencia del sistema
      const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
      this.isDarkTheme = darkThemeMq.matches;
    }

    // Aplicar la clase según el valor de isDarkTheme
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }


  }

}
