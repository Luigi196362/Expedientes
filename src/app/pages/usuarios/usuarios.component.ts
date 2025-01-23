import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuario } from '../../models/Usario';
import { UsuarioService } from '../../services/Usuario/usuario.service';
import { MatIcon } from '@angular/material/icon';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [MatIcon, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, NavBarComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements AfterViewInit, OnInit {
  Usuarios: Usuario[] = [];

  displayedColumns: string[] = [
    'nombre',
    'telefono',
    'facultad',
    'password',
    'edit'
  ];

  dataSource: MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private usuarioService: UsuarioService) {
    // Inicializar la dataSource con los datos vacíos al principio
    this.dataSource = new MatTableDataSource<Usuario>();
  }

  ngOnInit() {
    
    this.usuarioService.getUsuarios().subscribe(
      (data: Usuario[]) => {
        this.Usuarios = data; 
        this.dataSource.data = this.Usuarios;
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