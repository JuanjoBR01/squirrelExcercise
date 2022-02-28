// Lo primero es recuperar los datos

const url =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";
let array = [],
  td = [],
  eventosOrdenados = [];
let eventosDict = {},
  eventos = {};
let cadena = "";
let evento1 = "",
  evento2 = "";
let encontrado = false;
let tp = 0,
  fp = 0,
  tn = 0,
  fn = 0,
  mcc = 0;

function getData(callback) {
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      callback(res);
      // Se cra un diccionario con los eventos según el alimento
      for (let i = 0; i < array.length; i++) {
        cadena = "";

        for (let j = 0; j < res[i].events.length; j++) {
          cadena += res[i].events[j] + ", ";
        }
        cadena = cadena.substring(0, cadena.length - 2);

        const tablita = document.getElementById("tablitaEventos");

        filaTablitaEventos = document.createElement("tr");
        if (res[i].squirrel) {
          filaTablitaEventos.classList.add("bg-danger");
        }

        td = [];

        td[0] = document.createElement("td");
        td[1] = document.createElement("td");
        td[2] = document.createElement("td");

        td[0].classList.add("font-weight-bold");
        td[0].appendChild(document.createTextNode(i + 1));
        td[1].appendChild(document.createTextNode(cadena));
        td[2].appendChild(document.createTextNode(res[i].squirrel));

        filaTablitaEventos.appendChild(td[0]);
        filaTablitaEventos.appendChild(td[1]);
        filaTablitaEventos.appendChild(td[2]);

        tablita.appendChild(filaTablitaEventos);
      }

      //Ahora, se debe calcular la matriz de confusión para cada uno de los eventos

      // Recorro el arreglo de los datos
      // Nuevamente recorro los arreglos para poder separar la matriz de confusión
      // Creo un diccionario con todos los eventos y (tp - tn - fp - fn)
      for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].events.length; j++) {
          eventos[[res[i].events[j]]] = 0;
        }
      }
      // Con esta tabla de eventos por separado, puedo determinar la matriz de confusión
      // Recorro el arreglo dos veces, para así determinar los coeficientes de correlación

      // Recorro todas las filas del arreglo de eventos
      for (let i = 0; i < res.length; i++) {
        // Recorro el arreglo de eventos de un registro específico
        for (let m = 0; m < res[i].events.length; m++) {
          // Al recorrerlo, recupero el evento y calculo la matriz de confusión volviendo a recorrer todo
          evento1 = res[i].events[m];
          (tp = 0), (fp = 0), (tn = 0), (fn = 0);

          for (let j = 0; j < res.length && eventos[evento1] === 0; j++) {
            encontrado = false;
            //Ahora recorro todos los eventos
            for (let k = 0; k < res[j].events.length && !encontrado; k++) {
              evento2 = res[j].events[k];
              if (evento1 == evento2) {
                encontrado = true;
                if (res[j].squirrel) {
                  tp++;
                } else {
                  fn++;
                }
              }
            }

            if (!encontrado) {
              if (res[j].squirrel) {
                fp++;
              } else {
                tn++;
              }
            }
          }

          if (eventos[evento1] == 0) {
            mcc =
              (tp * tn - fp * fn) /
              Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn));
            //console.log(mcc);
            eventos[res[i].events[m]] = mcc;
          }
        }
      }

      // Creo una copia para los arreglos ordenados
      for (let i = 0; i < Object.keys(eventos).length; i++) {
        eventosDict[Object.keys(eventos)[i]] = [
          Object.keys(eventos)[i],
          eventos[Object.keys(eventos)[i]],
        ];
      }

      //Finalmente, se ordena el diccionario para mostrar los valores ordenados descendentemente:

      for (let j = 0; j < Object.keys(eventosDict).length; j++) {
        let maxEvent = "";
        let maxValue = -1000;
        for (let i = 0; i < Object.keys(eventosDict).length; i++) {
          if (
            eventosDict[Object.keys(eventosDict)[i]][1] > maxValue &&
            !eventosDict[Object.keys(eventosDict)[i]][2]
          ) {
            maxEvent = Object.keys(eventosDict)[i];
            maxValue = eventosDict[Object.keys(eventosDict)[i]][1];
          }
        }

        eventosOrdenados.push(eventosDict[maxEvent]);
        eventosDict[maxEvent].push(true);
        maxValue = -1000;
        maxEvent = "";
      }

      for (let i = 0; i < Object.keys(eventosOrdenados).length; i++) {
        const tablitaCorr = document.getElementById("tablitaCorr");
        filaTablitaCorr = document.createElement("tr");
        td = [];

        td[0] = document.createElement("td");
        td[1] = document.createElement("td");
        td[2] = document.createElement("td");

        td[0].classList.add("font-weight-bold");
        td[0].appendChild(document.createTextNode(i + 1));
        td[1].appendChild(
          document.createTextNode(
            eventosOrdenados[Object.keys(eventosOrdenados)[i]][0]
          )
        );
        td[2].appendChild(
          document.createTextNode(
            eventosOrdenados[Object.keys(eventosOrdenados)[i]][1]
          )
        );

        filaTablitaCorr.appendChild(td[0]);
        filaTablitaCorr.appendChild(td[1]);
        filaTablitaCorr.appendChild(td[2]);

        tablitaCorr.appendChild(filaTablitaCorr);
      }
    });
}

getData((value) => {
  array = value;
});
