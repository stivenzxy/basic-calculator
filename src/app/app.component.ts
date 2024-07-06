import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  titulo = 'Calculadora';
  screen = "";
  a:any;
  b:any;
  c:any;
  d = "";
  e = "";

  contenedor: any;
  arrayOperaciones: any = [];
  arrayResultados: any = [];
  verOperaciones: any = [];
  mostrarStorage: any;
  buttonHistory: any;
  btnActive = "text-right";
  calculadoraPos: any;
  historyPos: any;
  estiloPos1?: string;
  estiloPos2?: string;


  @ViewChild('mostrarOperaciones', { static: true }) mostrarOperaciones!: ElementRef;  

  constructor(private renderer:Renderer2){

  }

  ngOnInit(): void {
    // Posicion texto del historial por defecto
    this.buttonHistory = true;
    this.btnActive = 'text-right';

    // Posicion inicial divs
    this.calculadoraPos = false;
    this.historyPos = true;

    // verificando las variables del localStorage
    this.verOperaciones = localStorage.getItem('operaciones') || [];
    
    // creando el elemento del historial con las variables del storage
    this.crearHtmlStorage();
  }

  ingresarValor(valor:string){
    if ((this.b == "+") || (this.b == "-") || (this.b == "*") || (this.b == "/")) {
      this.d = this.d + valor;
      this.screen = this.screen + valor;
      this.c = this.d;


      console.log(this.b,this.c);
    } else {
      this.screen = this.screen + valor;
      this.a = this.screen;
      console.log(this.a);
    }
  }

  condicion(valor:string){
    this.screen = this.screen + valor;
    this.b = valor;
  }

  limpiar(){
    this.screen = "";
    this.a = "";
    this.b = "";
    this.c = "";
    this.d = "";
  }

  showHistory(){
    const operacion = `${this.a}${this.b}${this.c}`;
    const resultado = this.screen;

    this.crearHtml(operacion, resultado);
  }

  resultado(){
    if(this.b == '+'){
      this.screen = `${this.screen} = ${(parseInt(this.a) + parseInt(this.c)).toString()}`;
      this.screen = (parseInt(this.screen) + parseInt(this.c)).toString();

      this.showHistory();
    }

    if(this.b == '-'){
      this.screen = `${this.screen} = ${(parseInt(this.a) - parseInt(this.c)).toString()}`;
      this.screen = (parseInt(this.screen) - parseInt(this.c)).toString();

      this.showHistory();
    }

    if(this.b == '*'){
      this.screen = `${this.screen} = ${(parseInt(this.a) * parseInt(this.c)).toString()}`;
      this.screen = (parseInt(this.screen) * parseInt(this.c)).toString();

      this.showHistory();
    }

    if(this.b == '/'){
      this.screen = `${this.screen} = ${(parseInt(this.a) / parseInt(this.c)).toString()}`;
      this.screen = (parseInt(this.screen) / parseInt(this.c)).toString();

      this.showHistory();
    }

    this.limpiar(); 
  }

  // creando el history de forma dinamica en base al registro del DOM
  crearHtml(operacion:string, resultado:string){
    const mostrar = {
      operacion:operacion,
      resultado:resultado
    }

    var containerCard = document.createElement('div');
    var verOperacion = document.createElement('p');
    var verResultado = document.createElement('p');

    containerCard.classList.add('containerCard'); // agrega la clase CSS containerCard por lo tanto el estilo de ContainerCard puede ser manipulado
    verOperacion.classList.add('operation');      // agrega la clase CSS operation al elemento verOperacion, para que luego pueda ser estilizado en el .CSS
    verResultado.classList.add('resultOperation'); // agrega la clase CSS resultOperation al elemento verResultado, para poder aplicar propiedades a la variable con CSS

    containerCard.appendChild(verOperacion);
    containerCard.appendChild(verResultado);

    this.renderer.appendChild(this.mostrarOperaciones.nativeElement, containerCard);
    this.contenedor = containerCard;
    this.arrayOperaciones = [...this.arrayOperaciones, mostrar];

    this.arrayOperaciones.forEach((element:any )=> {
      this.contenedor.querySelector('.operation').innerText = element.operacion;
      this.contenedor.querySelector('.resultOperation').innerText = element.resultado;
    });

    this.sincronizarStorage();
  }

  sincronizarStorage(){
    localStorage.setItem('operaciones', JSON.stringify(this.arrayOperaciones));
  }

  // guardando el historial en el almacenamiento local del navegador
  crearHtmlStorage(){
    if (this.verOperaciones.length > 0) {
      var containerCard = document.createElement('div');
      var verOperacion = document.createElement('p');
      var verResultado = document.createElement('p');

      containerCard.classList.add('containerCard');
      verOperacion.classList.add('operation');
      verResultado.classList.add('resultOperation');

      containerCard.appendChild(verOperacion);
      containerCard.appendChild(verResultado);

      this.renderer.appendChild(this.mostrarOperaciones.nativeElement,containerCard);
      this.contenedor = containerCard;
      this.arrayResultados = JSON.parse(this.verOperaciones);

      this.arrayResultados.forEach((element:any)=>{
        this.crearHtml(element.operacion,element.resultado);
      });
    }
  }

  limpiarHistorial(){
    const  {arrayOperaciones} = this; // desestructuracion de this.arrayOperaciones,, arrayOperaciones tendra el valor de this.arrayOperaciones
    if (arrayOperaciones.length > 0) {
      Swal.fire({
        icon:'question',
        title:'¿Desea limpiar el historial?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        allowOutsideClick:false // define si se puede cerrar la ventana haciendo click fuera de ella
      }).then((result)=>{
        if (result.isConfirmed) {
          localStorage.removeItem('operaciones');
          Swal.fire({
            icon:'success',
            title:'El historial se limpio correctamente!',
            confirmButtonText:'Aceptar'
          }).then(()=>location.reload()); // actualiza la pagina luego de la ejecucion anterior
        }else if (result.dismiss === Swal.DismissReason.cancel) {
          // El usuario hizo clic en el botón "No" o "Cancelar"
          // No hacemos nada y simplemente cerramos el mensaje
        }
      });
    }else{
      Swal.fire({
        icon:'info',
        title:'Historial vacio!',
        confirmButtonText: 'Aceptar'
      })
    }
  }
  cambiarPosHistorial(){
    if(this.buttonHistory){
      this.buttonHistory = false;
      this.btnActive = 'text-left';
    } else {
      this.buttonHistory = true;
      this.btnActive = 'text-right';
    }
  }

  invertirPosDivs(){
    if(this.calculadoraPos && !this.historyPos){ // si calculadoraPos esta en el lado derecho y historialPos esta en el lado izquierdo
      this.calculadoraPos = false; // calculadoraPos pasa al lado izquierdo
      this.historyPos = true; // historyPos pasa al lado derecho
      this.estiloPos1 = '';
      this.estiloPos2 = '';
    } else {
      this.calculadoraPos = true;
      this.historyPos = false;
      this.estiloPos1 = 'transform: translate(100%)';
      this.estiloPos2 = 'transform: translate(-100%)';
    }
  }
}
