const canvas = document.getElementById("grafica");
const ctx = canvas.getContext("2d");

let escala = 45;

let desplazamientoX = 0;
let desplazamientoY = 0;

let m = 0;
let b = 0;

let segundoX = 1;
let segundoY = 0;

let arrastrando = false;

let anteriorX = 0;
let anteriorY = 0;


/* =========================
   MCD
========================= */

function mcd(a, b) {

    a = Math.abs(a);
    b = Math.abs(b);

    while (b !== 0) {

        let temporal = b;

        b = a % b;

        a = temporal;
    }

    return a;
}


/* =========================
   FRACCIÓN
========================= */

function fraccion(numerador, denominador) {

    if (numerador === 0) {
        return "0";
    }

    if (denominador < 0) {
        numerador *= -1;
        denominador *= -1;
    }

    let divisor = mcd(numerador, denominador);

    numerador /= divisor;
    denominador /= divisor;

    if (denominador === 1) {
        return String(numerador);
    }

    return `${numerador}/${denominador}`;
}


/* =========================
   NÚMERO BONITO
========================= */

function numeroBonito(numero) {

    if (Math.abs(numero - Math.round(numero)) < 0.000001) {
        return String(Math.round(numero));
    }

    return Number(numero.toFixed(2));
}


/* =========================
   TÉRMINO
========================= */

function termino(valor, letra, primero = false) {

    if (valor === 0) {
        return "";
    }

    let absoluto = Math.abs(valor);

    let numero = absoluto;

    if (letra && absoluto === 1) {
        numero = "";
    }

    if (primero) {

        return (
            valor < 0 ? "-" : ""
        ) + numero + letra;
    }

    return (
        valor < 0
            ? " - "
            : " + "
    ) + numero + letra;
}


/* =========================
   ECUACIÓN ORIGINAL
========================= */

function ecuacionOriginal(A, B, C) {

    let resultado = "";

    if (A !== 0) {
        resultado += termino(A, "x", true);
    }

    if (B !== 0) {
        resultado += termino(
            B,
            "y",
            resultado === ""
        );
    }

    if (C !== 0) {
        resultado += termino(
            C,
            "",
            resultado === ""
        );
    }

    if (resultado === "") {
        resultado = "0";
    }

    return resultado + " = 0";
}


/* =========================
   FORMA FINAL
========================= */

function crearFormula(mTexto, bTexto, bNumero) {

    let resultado = "y = ";

    if (mTexto === "1") {

        resultado += "x";

    } else if (mTexto === "-1") {

        resultado += "-x";

    } else if (mTexto === "0") {

        resultado += "0";

    } else {

        resultado += mTexto + "x";
    }


    if (bNumero > 0) {

        resultado += " + " + bTexto;

    } else if (bNumero < 0) {

        resultado +=
            " - " +
            bTexto.replace("-", "");
    }

    return resultado;
}


/* =========================
   RESOLVER
========================= */

function resolver() {

    const A =
        Number(document.getElementById("valorA").value);

    const B =
        Number(document.getElementById("valorB").value);

    const C =
        Number(document.getElementById("valorC").value);


    if (!Number.isFinite(A) ||
        !Number.isFinite(B) ||
        !Number.isFinite(C)) {

        alert("Introduce números válidos.");

        return;
    }


    if (B === 0) {

        alert(
            "El valor de B no puede ser 0 porque no se puede despejar y."
        );

        return;
    }


    /*
       Ax + By + C = 0

       By = -Ax - C

       y = (-A/B)x + (-C/B)
    */


    const mNumerador = -A;
    const mDenominador = B;

    const bNumerador = -C;
    const bDenominador = B;


    m =
        mNumerador /
        mDenominador;

    b =
        bNumerador /
        bDenominador;


    const mTexto =
        fraccion(
            mNumerador,
            mDenominador
        );

    const bTexto =
        fraccion(
            bNumerador,
            bDenominador
        );


    /* ECUACIÓN ORIGINAL */

    document.getElementById("original").textContent =
        ecuacionOriginal(A, B, C);


    /* DESPEJE */

    const xDerecha = -A;
    const cDerecha = -C;

    let despeje = `${B}y = `;


    if (xDerecha !== 0) {

        despeje +=
            termino(
                xDerecha,
                "x",
                true
            );
    }


    if (cDerecha !== 0) {

        despeje +=
            termino(
                cDerecha,
                "",
                xDerecha === 0
            );
    }


    document.getElementById("despeje").textContent =
        despeje;


    /* DIVISIÓN */

    document.getElementById("division").textContent =
        `y = (${xDerecha}/${B})x + (${cDerecha}/${B})`;


    /* FORMA FINAL */

    const formula =
        crearFormula(
            mTexto,
            bTexto,
            b
        );


    document.getElementById("formaFinal").textContent =
        formula;

    document.getElementById("ecuacionGrafica").textContent =
        formula;


    /* M */

    document.getElementById("pendiente").textContent =
        `m = ${mTexto}`;


    /* B */

    document.getElementById("interseccion").textContent =
        `b = ${bTexto}`;


    /* =========================
       PUNTO B
    ========================= */

    document.getElementById("puntoB").textContent =
        `B = (0, ${bTexto})`;


    /*
       Para obtener otro punto usamos
       x = |B|.
    */

    segundoX = Math.abs(B);

    if (segundoX < 1) {
        segundoX = 1;
    }


    segundoY =
        m * segundoX + b;


    document.getElementById("punto2").textContent =
        `P = (${numeroBonito(segundoX)}, ${numeroBonito(segundoY)})`;


    dibujar();
}


/* =========================
   PREPARAR CANVAS
========================= */

function prepararCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    const dpr =
        window.devicePixelRatio || 1;


    canvas.width =
        rect.width * dpr;

    canvas.height =
        rect.height * dpr;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    return {
        ancho: rect.width,
        alto: rect.height
    };
}


/* =========================
   DIBUJAR TODO
========================= */

function dibujar() {

    const {
        ancho,
        alto
    } = prepararCanvas();


    ctx.clearRect(
        0,
        0,
        ancho,
        alto
    );


    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        0,
        0,
        ancho,
        alto
    );


    const centroX =
        ancho / 2 + desplazamientoX;

    const centroY =
        alto / 2 + desplazamientoY;


    dibujarCuadricula(
        ancho,
        alto,
        centroX,
        centroY
    );


    dibujarEjes(
        ancho,
        alto,
        centroX,
        centroY
    );


    dibujarRecta(
        ancho,
        alto,
        centroX,
        centroY
    );


    dibujarPuntos(
        centroX,
        centroY
    );
}


/* =========================
   CUADRÍCULA
========================= */

function dibujarCuadricula(
    ancho,
    alto,
    centroX,
    centroY
) {

    ctx.strokeStyle = "#e5e7eb";

    ctx.lineWidth = 1;


    let inicioX =
        ((centroX % escala) + escala) % escala;


    for (
        let x = inicioX;
        x <= ancho;
        x += escala
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, alto);

        ctx.stroke();
    }


    let inicioY =
        ((centroY % escala) + escala) % escala;


    for (
        let y = inicioY;
        y <= alto;
        y += escala
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(ancho, y);

        ctx.stroke();
    }
}


/* =========================
   EJES
========================= */

function dibujarEjes(
    ancho,
    alto,
    centroX,
    centroY
) {

    ctx.strokeStyle = "#111827";

    ctx.lineWidth = 2;


    /* X */

    ctx.beginPath();

    ctx.moveTo(0, centroY);

    ctx.lineTo(ancho, centroY);

    ctx.stroke();


    /* Y */

    ctx.beginPath();

    ctx.moveTo(centroX, 0);

    ctx.lineTo(centroX, alto);

    ctx.stroke();


    /* FLECHA X */

    ctx.beginPath();

    ctx.moveTo(ancho - 10, centroY - 5);

    ctx.lineTo(ancho, centroY);

    ctx.lineTo(ancho - 10, centroY + 5);

    ctx.stroke();


    /* FLECHA Y */

    ctx.beginPath();

    ctx.moveTo(centroX - 5, 10);

    ctx.lineTo(centroX, 0);

    ctx.lineTo(centroX + 5, 10);

    ctx.stroke();


    /* NÚMEROS */

    ctx.fillStyle = "#374151";

    ctx.font = "12px Arial";

    ctx.textAlign = "center";


    const cantidadX =
        Math.ceil(ancho / escala);


    for (
        let i = -cantidadX;
        i <= cantidadX;
        i++
    ) {

        if (i === 0) continue;

        const px =
            centroX + i * escala;


        if (
            px >= 0 &&
            px <= ancho
        ) {

            ctx.fillText(
                i,
                px,
                centroY + 17
            );
        }
    }


    ctx.textAlign = "right";


    const cantidadY =
        Math.ceil(alto / escala);


    for (
        let i = -cantidadY;
        i <= cantidadY;
        i++
    ) {

        if (i === 0) continue;

        const py =
            centroY - i * escala;


        if (
            py >= 0 &&
            py <= alto
        ) {

            ctx.fillText(
                i,
                centroX - 7,
                py + 4
            );
        }
    }
}


/* =========================
   RECTA
========================= */

function dibujarRecta(
    ancho,
    alto,
    centroX,
    centroY
) {

    ctx.strokeStyle = "#16a34a";

    ctx.lineWidth = 4;

    ctx.beginPath();


    let iniciado = false;


    for (
        let px = 0;
        px <= ancho;
        px++
    ) {

        const x =
            (px - centroX) / escala;


        const y =
            m * x + b;


        const py =
            centroY - y * escala;


        if (!iniciado) {

            ctx.moveTo(
                px,
                py
            );

            iniciado = true;

        } else {

            ctx.lineTo(
                px,
                py
            );
        }
    }


    ctx.stroke();
}


/* =========================
   PUNTOS
========================= */

function dibujarPuntos(
    centroX,
    centroY
) {

    /* PUNTO B */

    const bx = 0;

    const by = b;


    const pixelBX =
        centroX + bx * escala;

    const pixelBY =
        centroY - by * escala;


    dibujarPunto(
        pixelBX,
        pixelBY,
        "#dc2626",
        `B = (0, ${numeroBonito(b)})`,
        true
    );


    /* SEGUNDO PUNTO */

    const px = segundoX;

    const py = segundoY;


    const pixelPX =
        centroX + px * escala;

    const pixelPY =
        centroY - py * escala;


    dibujarPunto(
        pixelPX,
        pixelPY,
        "#2563eb",
        `P = (${numeroBonito(px)}, ${numeroBonito(py)})`,
        false
    );
}


/* =========================
   DIBUJAR PUNTO
========================= */

function dibujarPunto(
    x,
    y,
    color,
    texto,
    importante
) {

    ctx.fillStyle = color;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        importante ? 7 : 6,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* BORDE */

    ctx.strokeStyle = "#ffffff";

    ctx.lineWidth = 2;

    ctx.stroke();


    /* ETIQUETA */

    ctx.fillStyle = color;

    ctx.font = "bold 14px Arial";

    ctx.textAlign = "left";


    ctx.fillText(
        texto,
        x + 10,
        y - 12
    );
}


/* =========================
   ZOOM +
========================= */

function zoomMas() {

    escala += 8;

    if (escala > 100) {
        escala = 100;
    }

    dibujar();
}


/* =========================
   ZOOM -
========================= */

function zoomMenos() {

    escala -= 8;

    if (escala < 20) {
        escala = 20;
    }

    dibujar();
}


/* =========================
   CENTRAR
========================= */

function centrar() {

    desplazamientoX = 0;

    desplazamientoY = 0;

    dibujar();
}


/* =========================
   LIMPIAR
========================= */

function limpiar() {

    document.getElementById("valorA").value = 1;

    document.getElementById("valorB").value = 1;

    document.getElementById("valorC").value = 0;

    escala = 45;

    desplazamientoX = 0;

    desplazamientoY = 0;

    resolver();
}


/* =========================
   MOVER GRÁFICA
========================= */

canvas.addEventListener(
    "pointerdown",
    function(evento) {

        arrastrando = true;

        anteriorX =
            evento.clientX;

        anteriorY =
            evento.clientY;

        canvas.setPointerCapture(
            evento.pointerId
        );
    }
);


canvas.addEventListener(
    "pointermove",
    function(evento) {

        if (!arrastrando) {
            return;
        }


        desplazamientoX +=
            evento.clientX -
            anteriorX;


        desplazamientoY +=
            evento.clientY -
            anteriorY;


        anteriorX =
            evento.clientX;

        anteriorY =
            evento.clientY;


        dibujar();
    }
);


canvas.addEventListener(
    "pointerup",
    function() {

        arrastrando = false;
    }
);


canvas.addEventListener(
    "pointercancel",
    function() {

        arrastrando = false;
    }
);


/* =========================
   INICIAR
========================= */

window.addEventListener(
    "resize",
    dibujar
);


resolver();
