

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function eleccion(jugada) {
    let resultado = ""
    if (jugador == 1) {
        resultado = "Piedra 🥌"
    } else if (jugador == 2) {
        resultado = "Papel 📄"
    } else if (jugador == 3) {
        resultado = "Tijera ✂️"
    } else {
        resultado = "Mal elegido "
    }
    return resultado;
}
// 1 es priedra, 2 es papel, 3 es tijera
let jugador = 0
let pc = 0
let triunfos = 0
let perdidas = 0


while (triunfos < 3 && perdidas < 3) {
    pc = aleatorio(1, 3)
    jugador = prompt("Elige: 1 para piedra, 2 para papel, 3 para tijera")
    alert("Elegiste: " + eleccion(jugador))
    alert("PC eligió: " + eleccion(pc))
    // COMBATE 
    if (pc == jugador) {
        alert("Empate!")
    } else if (jugador == 1 && pc == 3) {
        alert("Ganaste!")
        triunfos = triunfos + 1
    } else if (jugador == 2 && pc == 1) {
        alert("Ganaste!")
        triunfos = triunfos + 1
    } else if (jugador == 3 && pc == 2) {
        alert("Ganaste!")
        triunfos = triunfos + 1
    } else {
        alert("Perdiste!")
        perdidas = perdidas + 1
    }

    alert("Ganaste: " + triunfos + " veces, Perdiste: " + perdidas + " veces")

}
aleatorio(1, 3)
