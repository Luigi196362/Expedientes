import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Paciente } from '../../models/paciente.model';
import { PacienteService } from '../../services/paciente.service';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/Auth/auth.service';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButton,
    RouterLink,
    CommonModule,
    MatIcon
  ],
  templateUrl: './paciente-list.component.html',
  styleUrls: ['./paciente-list.component.css'],
})
export class PacienteListComponent implements AfterViewInit, OnInit {
  Pacientes: Paciente[] = [];

  displayedColumns: string[] = [
    'matricula',
    'nombre',
    'sexo',
    'fecha_nacimiento',
    'fecha_creacion',
    'boton'
  ];

  dataSource: MatTableDataSource<Paciente>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private pacienteService: PacienteService, public authService: AuthService) {
    // Inicializar la dataSource con los datos vacíos al principio
    this.dataSource = new MatTableDataSource<Paciente>();
  }

  ngOnInit() {
    // Llamar al servicio para obtener los pacientes
    this.pacienteService.getPacientes().subscribe(
      (data: Paciente[]) => {
        this.Pacientes = data; // Guardar los datos de los pacientes

        // Ordenar los pacientes del último al primero según fecha de creación (o id)
        this.Pacientes.sort((a, b) => {
          return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
        });

        this.dataSource.data = this.Pacientes; // Asignar los datos a la tabla
      },
      (error) => {
        console.error('Error al obtener pacientes:', error);
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

    // Asegurarse de que la tabla vuelva a la primera página después de filtrar
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    // Ajustar si el cumpleaños no ha ocurrido este año.
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
}
