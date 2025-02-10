import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Rol } from '../../models/rol.model';
import { RolService } from '../../services/rol.service';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/Auth/auth.service';

@Component({
  selector: 'app-rol-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './rol-list.component.html',
  styleUrl: './rol-list.component.css'
})
export class RolListComponent implements AfterViewInit, OnInit {
  Roles: Rol[] = [];

  displayedColumns: string[] = [
    'nombre',
    'descripcion',
    'actions'
  ];

  dataSource: MatTableDataSource<Rol>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private rolService: RolService, public authService: AuthService, private router: Router) {
    // Inicializar la dataSource con los datos vacíos al principio
    this.dataSource = new MatTableDataSource<Rol>();
  }

  ngOnInit() {
    // Llamar al servicio para obtener los roles
    this.rolService.getRoles().subscribe(
      (data: Rol[]) => {
        this.Roles = data; // Guardar los datos de los roles

        // Ordenar los pacientes del último al primero según fecha de creación (o id)
        this.Roles.sort((a, b) => {
          return b.id - a.id;
        });

        this.dataSource.data = this.Roles; // Asignar los datos a la tabla
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

  editar(rol: Rol) {
    this.router.navigate(['/layout/roles/editar'], { state: { rol } });
  }

}