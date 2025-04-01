const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

document.addEventListener("DOMContentLoaded", () => {
    canvas.width = 400;
    canvas.height = 400;
});

const jugador = {
    x: 50,
    y: 50,
    tamano: 20,
    velocidad: 3,
    color: "yellow",
    vidas: 3,
    puntos: 0
};

const teclas = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

const paredes = [
    { x: 100, y: 100, ancho: 200, alto: 20 },
    { x: 50, y: 200, ancho: 20, alto: 200 }
];

let bolitas = [
    { x: 150, y: 150, tamano: 5 },
    { x: 300, y: 250, tamano: 5 },
    { x: 200, y: 300, tamano: 5 }
];

const enemigos = [
    { x: 200, y: 200, tamano: 20, velocidad: 2, color: "red", dirX: "derecha", dirY: "abajo" },
    { x: 300, y: 100, tamano: 20, velocidad: 1.5, color: "blue", dirX: "izquierda", dirY: "abajo" },
    { x: 100, y: 300, tamano: 20, velocidad: 2, color: "purple", dirX: "derecha", dirY: "arriba" },
    { x: 250, y: 250, tamano: 20, velocidad: 1.8, color: "pink", dirX: "izquierda", dirY: "arriba" }
];

function colision(entidad, paredes) {
    return paredes.some(pared =>
        entidad.x < pared.x + pared.ancho &&
        entidad.x + entidad.tamano > pared.x &&
        entidad.y < pared.y + pared.alto &&
        entidad.y + entidad.tamano > pared.y
    );
}

function colisionJugadorEnemigo() {
    enemigos.forEach(enemigo => {
        if (Math.hypot(jugador.x - enemigo.x, jugador.y - enemigo.y) < jugador.tamano) {
            jugador.vidas--;
            jugador.x = 50;
            jugador.y = 50;
            if (jugador.vidas === 0) {
                alert("¡Perdiste!");
                location.reload();
            }
        }
    });
}

function moverEnemigos() {
    enemigos.forEach(enemigo => {
        if (enemigo.dirX === "derecha") enemigo.x += enemigo.velocidad;
        else enemigo.x -= enemigo.velocidad;
        if (enemigo.dirY === "abajo") enemigo.y += enemigo.velocidad;
        else enemigo.y -= enemigo.velocidad;

        if (enemigo.x >= canvas.width - enemigo.tamano || enemigo.x <= 0) {
            enemigo.dirX = enemigo.dirX === "derecha" ? "izquierda" : "derecha";
        }
        if (enemigo.y >= canvas.height - enemigo.tamano || enemigo.y <= 0) {
            enemigo.dirY = enemigo.dirY === "abajo" ? "arriba" : "abajo";
        }
    });
}

function generarBolitas() {
    for (let i = 0; i < 3; i++) {
        bolitas.push({
            x: Math.random() * (canvas.width - 10) + 5,
            y: Math.random() * (canvas.height - 10) + 5,
            tamano: 5
        });
    }
    enemigos.forEach(enemigo => enemigo.velocidad += 0.2); 
}

document.addEventListener("keydown", (e) => {
    if (teclas.hasOwnProperty(e.key)) {
        teclas[e.key] = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (teclas.hasOwnProperty(e.key)) {
        teclas[e.key] = false;
    }
});

function actualizar() {
    let siguienteX = jugador.x;
    let siguienteY = jugador.y;

    if (teclas.ArrowUp) siguienteY -= jugador.velocidad;
    if (teclas.ArrowDown) siguienteY += jugador.velocidad;
    if (teclas.ArrowLeft) siguienteX -= jugador.velocidad;
    if (teclas.ArrowRight) siguienteX += jugador.velocidad;

    const jugadorTemp = { ...jugador, x: siguienteX, y: siguienteY };
    if (!colision(jugadorTemp, paredes)) {
        jugador.x = siguienteX;
        jugador.y = siguienteY;
    }

    bolitas.forEach((bolita, indice) => {
        if (Math.hypot(jugador.x - bolita.x, jugador.y - bolita.y) < jugador.tamano / 2) {
            bolitas.splice(indice, 1);
            jugador.puntos++;
            if (bolitas.length === 0 && jugador.puntos < 8) {
                generarBolitas();
            }
            if (jugador.puntos >= 9) {
                alert("¡Ganaste!");
                location.reload();
            }
        }
    });

    colisionJugadorEnemigo();
    moverEnemigos();
}

function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = jugador.color;
    ctx.beginPath();
    ctx.arc(jugador.x, jugador.y, jugador.tamano / 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(jugador.x, jugador.y);
    ctx.fill();
    
    ctx.fillStyle = "blue";
    paredes.forEach(pared => {
        ctx.fillRect(pared.x, pared.y, pared.ancho, pared.alto);
    });
    
    ctx.fillStyle = "white";
    bolitas.forEach(bolita => {
        ctx.beginPath();
        ctx.arc(bolita.x, bolita.y, bolita.tamano, 0, Math.PI * 2);
        ctx.fill();
    });
    
    enemigos.forEach(enemigo => {
        ctx.fillStyle = enemigo.color;
        ctx.fillRect(enemigo.x, enemigo.y, enemigo.tamano, enemigo.tamano);
    });
    
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Vidas: " + jugador.vidas, 10, 20);
    ctx.fillText("Puntos: " + jugador.puntos, 10, 40);
}

function cicloJuego() {
    actualizar();
    dibujar();
    requestAnimationFrame(cicloJuego);
}

cicloJuego();