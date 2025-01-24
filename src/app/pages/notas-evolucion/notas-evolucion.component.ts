import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Nota_Evolucion } from '../../models/nota-evolucion';
import { NotasEvolucionService } from '../../services/Notas-Evolucion/notas-evolucion.service';
import { DatePipe } from '@angular/common';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-notas-evolucion',
  standalone: true,
  imports: [DatePipe, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, NavBarComponent],
  templateUrl: './notas-evolucion.component.html',
  styleUrl: './notas-evolucion.component.css'
})
export class NotasEvolucionComponent  implements AfterViewInit, OnInit {
  notas_evolucion: Nota_Evolucion[] = [];

  displayedColumns: string[] = [
    'usuario',
    'diagnostico',
    'paciente',
    'fecha_creacion'
  ];

  dataSource: MatTableDataSource<Nota_Evolucion>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private notasEvolucionService: NotasEvolucionService) {
    // Inicializar la dataSource con los datos vacíos al principio
    this.dataSource = new MatTableDataSource<Nota_Evolucion>();
  }

  ngOnInit() {
    
    this.notasEvolucionService.getNotas().subscribe(
      (data: Nota_Evolucion[]) => {
        this.notas_evolucion = data; 
        this.dataSource.data = this.notas_evolucion;
      },
      (error) => {
        console.error('Error al obtener las notas:', error);
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