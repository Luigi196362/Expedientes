import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Paciente } from '../../models/Paciente';
import { PacienteService } from '../../services/Paciente/paciente.service';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-pacientes',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,NavBarComponent,MatButton,RouterLink],
  templateUrl: './admin-pacientes.component.html',
  styleUrls: ['./admin-pacientes.component.css'],
})
export class AdminPacientesComponent implements AfterViewInit, OnInit {
  Pacientes: Paciente[] = [];

  displayedColumns: string[] = [
    'matricula',
    'nombre',
    'sexo',
    'fecha_nacimiento',
  ];

  dataSource: MatTableDataSource<Paciente>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private pacienteService: PacienteService) {
    // Inicializar la dataSource con los datos vacíos al principio
    this.dataSource = new MatTableDataSource<Paciente>();
  }

  ngOnInit() {
    // Llamar al servicio para obtener los pacientes
    this.pacienteService.getPacientes().subscribe(
      (data: Paciente[]) => {
        this.Pacientes = data; // Guardar los datos de los pacientes
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
