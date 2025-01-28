import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButton,
    RouterLink
  ],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.css'
})
export class UsuarioListComponent implements AfterViewInit, OnInit {
  Usuarios: Usuario[] = [];

  displayedColumns: string[] = [
    'nombre',
    'telefono',
    'facultad',
    'boton'
  ];

  dataSource: MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private usuarioService: UsuarioService) {
    // Inicializar la dataSource con los datos vacíos al principio
    this.dataSource = new MatTableDataSource<Usuario>();
  }


  ngOnInit() {
    // Llamar al servicio para obtener los usuarios
    this.usuarioService.getUsuarios().subscribe(
      (data: Usuario[]) => {
        this.Usuarios = data; // Guardar los datos de los usuarios

        // Ordenar los usuarios del último al primero según fecha de creación (o id)
        this.Usuarios.sort((a, b) => {
          return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();

          // Si no tienes un campo de fecha, usa el id
          // return b.id - a.id;
        });

        this.dataSource.data = this.Usuarios; // Asignar los datos a la tabla
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
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

}