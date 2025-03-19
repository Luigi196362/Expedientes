import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RegistroService } from '../../services/registros/registros.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Registro } from '../../models/Registro';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/Auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-registro-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './registro-list.component.html',
  styleUrls: ['./registro-list.component.css']
})
export class RegistroComponent implements AfterViewInit, OnInit {
  Registros: Registro[] = [];
  displayedColumns: string[] = ['usuario', 'paciente', 'fecha_creacion', 'tipo_registro'];
  dataSource: MatTableDataSource<Registro>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private registrosService: RegistroService,
    public authService: AuthService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<Registro>();
  }

  ngOnInit() {
    this.registrosService.getNotas().subscribe(
      (data: Registro[]) => {
        this.Registros = data;
        this.Registros.sort((a, b) => {
          return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
        });
        this.dataSource.data = this.Registros;
      },
      (error) => {
        console.error('Error al obtener registros:', error);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // editar(registro: Registro) {
  //   this.router.navigate(['/layout/registros/datos'], { state: { registro } });
  // }


  exportarPDF() {
    this.registrosService.exportar().subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Crea un enlace de descarga y haz clic en él
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Reporte completo.pdf'; // Nombre del archivo PDF
      document.body.appendChild(a); // Asegura que el enlace esté en el DOM
      a.click();
      document.body.removeChild(a); // Elimina el enlace después de hacer clic

      // Revoca el objeto URL después de la descarga
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error("Error al exportar el PDF", error);
    });
  }
}
