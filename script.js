document.addEventListener(
  "DOMContentLoaded",
  function () {
    const numeroDeDias = {
      1: 31,
      2: 28,
      3: 31,
      4: 30,
      5: 31,
      6: 30,
      7: 31,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31,
    };

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

    const diasSemana = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
    ];

    let diasExtra = 0;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // const header = document.getElementById("calendar-header");
    const title = document.getElementById("calendar-title");
    const dayHeader = document.getElementById("day-header");
    const body = document.getElementById("day-body");

    const inputMes = document.getElementById("inputMes");
    const inputAnio = document.getElementById("inputAnio");
    const inputDia = document.getElementById("inputDia");
    const inputImagen = document.getElementById("inputImagen");
    const inputTitle = document.getElementById("inputTitle");

    inputMes.value = hoy.getMonth() + 1;
    inputAnio.value = hoy.getFullYear();
    inputDia.value = hoy.getDate();

    inputMes.addEventListener("input", mostrarNombreMes);
    inputDia.addEventListener("input", mostrarDias);

    document.addEventListener("wheel", function (event) {
      const activeElement = document.activeElement;

      if (
        activeElement === inputMes ||
        activeElement === inputAnio ||
        activeElement === inputDia
      ) {
        const increment = event.deltaY > 0 ? 1 : -1;
        activeElement.value = parseInt(activeElement.value) + increment;

        if (activeElement === inputMes) {
          ajustarRango(inputMes, 1, 12);
          mostrarNombreMes();
        } else if (activeElement === inputAnio) {
          ajustarRango(inputAnio, 1999, 2099);
        } else if (activeElement === inputDia) {
          ajustarRango(inputDia, 1, numeroDeDias[inputMes.value]);
        }
      }
    });

    const botonActualizar = document.getElementById("botonActualizar");
    botonActualizar.addEventListener("click", actualizarCalendario);

    const botonInsertar = document.getElementById("botonInsertar");
    botonInsertar.addEventListener("click", insertar);

    const botonLimpiarImagen = document.getElementById("botonLimpiarImagen");
    botonLimpiarImagen.addEventListener("click", limpiarImagen);

    function ajustarRango(input, min, max) {
      const valor = parseInt(input.value);
      if (valor > max) input.value = min;
      else if (valor < min) input.value = max;
    }

    function insertar() {
      const selectedFile = inputImagen.files[0];
      const selectedDay = parseInt(document.getElementById("inputDia").value);

      if (selectedDay) {
        const correctDay = selectedDay + diasExtra;

        const dayCell = document.querySelector(
          `.day-body .day:nth-child(${correctDay})`
        );

        if (dayCell) {
          dayCell.innerHTML = `<span>${selectedDay}</span>`;
          const existingTitle = dayCell.querySelector(".day-title");

          if (existingTitle) {
            // Si ya hay un título, reemplazarlo
            existingTitle.textContent = inputTitle.value;
          } else {
            // Si no hay un título, agregar uno nuevo
            const titleElement = document.createElement("div");
            titleElement.classList.add("day-title");
            titleElement.textContent = inputTitle.value;

            dayCell.appendChild(titleElement);
          }
          if (selectedFile) {
            const imageElement = document.createElement("img");
            imageElement.src = URL.createObjectURL(selectedFile);
            imageElement.alt = `Dia ${selectedDay}`;
            imageElement.classList.add("day-image");
            dayCell.appendChild(imageElement);
          }
        }
      }
    }

    function generarCalendario(mes, anio) {
      title.textContent = `${nombresMeses[mes - 1]}`;
      dayHeader.innerHTML = "";

      for (const diaSemana of diasSemana) {
        const diaHeader = document.createElement("div");
        diaHeader.textContent = diaSemana;
        dayHeader.appendChild(diaHeader);
      }

      body.innerHTML = "";
      const primerDia = new Date(anio, mes - 1, 1);
      const ultimoDia = new Date(anio, mes, 0);
      const diasMesAnterior = primerDia.getDay();
      const diasMesSiguiente = ultimoDia.getDay();
      diasExtra = diasMesAnterior;

      // Generar días del mes anterior en la primera semana del calendario
      for (let i = diasMesAnterior - 1; i >= 0; i--) {
        const diaAnterior = new Date(anio, mes - 1, 0 - i);
        agregarDia(diaAnterior.getDate(), ["noMesActual"], body);
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

      // Generar días del mes anterior en la primera semana del calendario
      for (let i = diasMesSiguiente + 1; i <= 6; i++) {
        const diaAnterior = new Date(anio, mes + 1, i);
        agregarDia(diaAnterior.getDate(), ["noMesActual"], body);
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
      const mes = parseInt(inputMes.value);
      const anio = parseInt(inputAnio.value);
      generarCalendario(mes, anio);
    }

    function mostrarNombreMes() {
      ajustarRango(inputMes, 1, 12);
      const nombreMes = document.getElementById("nombreMes");
      nombreMes.textContent = obtenerNombreMes(parseInt(inputMes.value));
    }

    function mostrarDias() {
      ajustarRango(inputDia, 1, numeroDeDias[inputMes.value]);
    }

    function obtenerNombreMes(numeroMes) {
      return nombresMeses[numeroMes - 1];
    }

    function limpiarImagen() {
      inputImagen.value = "";
    }

    mostrarNombreMes();

    // Inicializar con un mes específico
    generarCalendario(hoy.getMonth() + 1, hoy.getFullYear());
  },
  { passive: false }
);
