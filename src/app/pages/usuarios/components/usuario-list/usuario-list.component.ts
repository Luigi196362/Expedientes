import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeleteDialogComponent } from '../../../../shared/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/Auth/auth.service';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.css'
})
export class UsuarioListComponent implements AfterViewInit, OnInit {

  Usuarios: Usuario[] = [];

  displayedColumns: string[] = [
    'username',
    'telefono',
    'facultad',
    'fecha_creacion',
    'nombre_rol',
    'actions'
  ];

  dataSource: MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private usuarioService: UsuarioService, private router: Router, private dialog: MatDialog, public authService: AuthService) {
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

  editar(usuario: Usuario) {
    this.router.navigate(['/layout/usuarios/editar'], { state: { usuario } });
  }

  crear(modo: String) {
    this.router.navigate(['/layout/usuarios/editar'], { state: { modo } });
  }


  eliminar(usuario: Usuario) {

    const dialogRef = this.dialog.open(DeleteDialogComponent, { data: { message: 'usuario ' + usuario.username } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.usuarioService.eliminarUsuario(usuario.id).subscribe(
          () => {
            // Actualizar la lista de usuarios después de eliminar
            this.Usuarios = this.Usuarios.filter(u => u.id !== usuario.id);
            this.dataSource.data = this.Usuarios;
          },
          (error: any) => {
            console.error('Error al eliminar usuario:', error);
          }
        );
      } else {
        console.log('El usuario canceló la operación');

      }
    });

  }

}
