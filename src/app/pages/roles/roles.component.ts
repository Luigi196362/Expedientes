import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Rol } from '../../models/Rol';
import { RolService } from '../../services/Rol/rol.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements AfterViewInit, OnInit {
  Roles: Rol[] = [];

  displayedColumns: string[] = [
    'nombre',
    'descripcion',
  ];

  dataSource: MatTableDataSource<Rol>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private rolService: RolService) {
    // Inicializar la dataSource con los datos vacíos al principio
    this.dataSource = new MatTableDataSource<Rol>();
  }

  ngOnInit() {
    
    this.rolService.getRoles().subscribe(
      (data: Rol[]) => {
        this.Roles = data; 
        this.dataSource.data = this.Roles;
      },
      (error) => {
        console.error('Error al obtener los roles:', error);
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