document.addEventListener(
  "DOMContentLoaded",
  function () {
    // Tu código JavaScript que manipula el DOM aquí
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    function generarCalendario(mes, anio) {
      // Encabezado del calendario
      const header = document.getElementById("calendar-header");
      header.textContent = `Hero's Calendar ${anio}`;

      // Días de la semana
      const diasSemana = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

      // Encabezado de los dias
      const dayHeader = document.getElementById("day-header");
      dayHeader.innerHTML = "";

      // Cuerpo del calendario
      const body = document.getElementById("day-body");
      body.innerHTML = "";

      // Agregar los días de la semana al encabezado
      for (const diaSemana of diasSemana) {
        const diaHeader = document.createElement("div");
        diaHeader.textContent = diaSemana;
        // // diaHeader.classList.add("day");
        dayHeader.appendChild(diaHeader);
      }

      // Obtener el primer día del mes y la cantidad de días en el mes
      const primerDia = new Date(anio, mes - 1, 1);
      const ultimoDia = new Date(anio, mes, 0);

      // Calcular el número de días en la última semana del mes anterior
      const diasMesAnterior = primerDia.getDay();

      // Generar días del mes anterior en la primera semana del calendario
      for (let i = diasMesAnterior - 1; i >= 0; i--) {
        const diaAnterior = new Date(anio, mes - 1, 0 - i);
        agregarDia(diaAnterior.getDate(), ["weekend"], body);
      }

      // Generar días del mes actual
      for (let i = 1; i <= ultimoDia.getDate(); i++) {
        const diaActual = new Date(anio, mes - 1, i);
        const claseDia = [];

        if (diaActual.getTime() === hoy.getTime()) {
          claseDia.push("today");
        } else if (diaActual.getDay() === 0 || diaActual.getDay() === 6) {
          claseDia.push("weekend");
        }
        agregarDia(i, claseDia, body);
      }
    }

    function agregarDia(dia, clase, contenedor) {
      const nuevoDia = document.createElement("div");
      nuevoDia.classList.add("day", ...clase);
      const numeroDia = document.createElement("span");
      numeroDia.textContent = dia;
      nuevoDia.appendChild(numeroDia);
      contenedor.appendChild(nuevoDia);
    }
    function actualizarCalendario() {
      const mes = document.getElementById("inputMes").value;
      const anio = document.getElementById("inputAnio").value;
      generarCalendario(parseInt(mes), parseInt(anio));
    }

    function mostrarNombreMes() {
      const inputMes = document.getElementById("inputMes");
      const nombreMes = document.getElementById("nombreMes");

      const mesSeleccionado = parseInt(inputMes.value);
      if (mesSeleccionado < 1) {
        inputMes.value = 12;
      } else if (mesSeleccionado > 12) {
        inputMes.value = 1;
      }

      nombreMes.textContent = obtenerNombreMes(parseInt(inputMes.value));
    }

    function obtenerNombreMes(numeroMes) {
      const nombresMeses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];

      return nombresMeses[numeroMes - 1];
    }

    const botonActualizar = document.getElementById("botonActualizar");
    botonActualizar.addEventListener("click", actualizarCalendario);

    const inputMes = document.getElementById("inputMes");
    inputMes.addEventListener("input", mostrarNombreMes);
    inputMes.value = hoy.getMonth() + 1;

    const inputAnio = document.getElementById("inputAnio");
    inputAnio.value = hoy.getFullYear();

    document.addEventListener("wheel", function (event) {
      const activeElement = document.activeElement;

      if (activeElement === inputMes || activeElement === inputAnio) {
        activeElement.value =
          parseInt(activeElement.value) + (event.deltaY > 0 ? 1 : -1);

        if (activeElement === inputMes) {
          if (activeElement.value < 1) {
            activeElement.value = 12;
          } else if (activeElement.value > 12) {
            activeElement.value = 1;
          }
        } else if (activeElement === inputAnio) {
          if (activeElement.value < 1900) {
            activeElement.value = 1900;
          }
        }

        if (activeElement === inputMes) {
          mostrarNombreMes();
        }
      }
    });

    mostrarNombreMes();
    // Inicializar con un mes específico
    generarCalendario(hoy.getMonth() + 1, hoy.getFullYear());
  },
  { passive: false }
);
