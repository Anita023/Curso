const sectionSeleccionarAtaque = document.getElementById("seleccionar-ataque")
const sectionReiniciar = document.getElementById("reiniciar")
const botonMascota = document.getElementById("boton-mascota")
const botonReiniciar = document.getElementById("boton-reiniciar")

const sectionSeleccionarMascota = document.getElementById("seleccionar-mascota")
const spanMascotaJugador = document.getElementById("mascota-jugador")
const spanMascotaEnemigo = document.getElementById("mascota-enemigo")
const spanVidasJugador = document.getElementById("vidas-jugador")
const spanVidasEnemigo = document.getElementById("vidas-enemigo")
const sectionMensajes = document.getElementById("resultado")
const ataqueDelJugador = document.getElementById("ataques-del-jugador")
const ataqueDelEnemigo = document.getElementById("ataques-del-enemigo")
const contenedorTarjetas = document.getElementById("contenedorTarjetas")
const contenedorAtaques = document.getElementById("contenedorAtaques")
const sectionVerMapa = document.getElementById("ver-mapa")
const mapa = document.getElementById("mapa")

const URL_SERVIDOR = `http://${window.location.hostname || "localhost"}:8080`

const IMAGENES = {
    mapa: "./assets/mokemap.png",
    Hipodoge: {
        tarjeta: "./assets/mokepons_mokepon_hipodoge_attack.png",
        mapa: "./assets/hipodoge.png"
    },
    Capipepo: {
        tarjeta: "./assets/mokepons_mokepon_capipepo_attack.png",
        mapa: "./assets/capipepo.png"
    },
    Ratigueya: {
        tarjeta: "./assets/mokepons_mokepon_ratigueya_attack.png",
        mapa: "./assets/ratigueya.png"
    }
}

const ATAQUES = {
    Hipodoge: [
        { nombre: "💧", id: "boton-agua" },
        { nombre: "🔥", id: "boton-fuego" },
        { nombre: "💧", id: "boton-agua" },
        { nombre: "🌱", id: "boton-tierra" },
        { nombre: "💧", id: "boton-agua" }
    ],
    Capipepo: [
        { nombre: "🔥", id: "boton-fuego" },
        { nombre: "💧", id: "boton-agua" },
        { nombre: "🔥", id: "boton-fuego" },
        { nombre: "🌱", id: "boton-tierra" },
        { nombre: "🔥", id: "boton-fuego" }
    ],
    Ratigueya: [
        { nombre: "🌱", id: "boton-tierra" },
        { nombre: "💧", id: "boton-agua" },
        { nombre: "🌱", id: "boton-tierra" },
        { nombre: "🔥", id: "boton-fuego" },
        { nombre: "🌱", id: "boton-tierra" }
    ]
}

let jugadorId = null
let enemigoId = null
let mokepones = []
let mokeponesEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionDemokepones
let inputHipodoge
let inputCapipepo
let inputRatigueya
let mascotaJugador
let mascotaJugadorObjeto
let ataquesMokepon
let botones = []
let victoriasJugador = 0
let victoriasEnemigo = 0
let indexAtaqueJugador
let indexAtaqueEnemigo
let ataquesMokeponEnemigo = []
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = IMAGENES.mapa

let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20
const anchoMaximoDelMapa = 350

if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600 / 800
mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos

const imagenesCargadas = {}

function obtenerImagen(ruta) {
    if (!imagenesCargadas[ruta]) {
        const imagen = new Image()
        imagen.src = ruta
        imagenesCargadas[ruta] = imagen
    }

    return imagenesCargadas[ruta]
}

class Mokepon {
    constructor(nombre, foto, vida, fotoMapa, id = null) {
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.ancho = 40
        this.alto = 40
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = obtenerImagen(fotoMapa)
        this.vx = 0
        this.vy = 0
    }

    pintarMokepon() {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}

function crearMokepon(nombre, id = null) {
    const imagenes = IMAGENES[nombre]

    if (!imagenes) {
        return null
    }

    const mokepon = new Mokepon(nombre, imagenes.tarjeta, 5, imagenes.mapa, id)
    mokepon.ataques = [...ATAQUES[nombre]]

    return mokepon
}

mokepones.push(
    crearMokepon("Hipodoge"),
    crearMokepon("Capipepo"),
    crearMokepon("Ratigueya")
)

function iniciarJuego() {
    sectionSeleccionarAtaque.style.display = "none"
    sectionVerMapa.style.display = "none"

    mokepones.forEach((mokepon) => {
        opcionDemokepones = `
       <input type="radio" name="mascota" id=${mokepon.nombre} />
            <label class="tarjeta-mokepon" for=${mokepon.nombre}>
                <p>${mokepon.nombre}</p>
                <img src=${mokepon.foto} alt=${mokepon.nombre}>
            </label>`

        contenedorTarjetas.innerHTML += opcionDemokepones
    })

    inputHipodoge = document.getElementById("Hipodoge")
    inputCapipepo = document.getElementById("Capipepo")
    inputRatigueya = document.getElementById("Ratigueya")

    sectionReiniciar.style.display = "none"

    botonMascota.addEventListener("click", SeleccionarMascotaJugador)
    botonReiniciar.addEventListener("click", reiniciarJuego)

    unirseAlJuego()
}

function unirseAlJuego() {
    fetch(`${URL_SERVIDOR}/unirse`)
        .then(function (res) {
            if (res.ok) {
                res.text()
                    .then(function (respuesta) {
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
            }
        })
}

function SeleccionarMascotaJugador() {
    if (inputHipodoge && inputHipodoge.checked) {
        spanMascotaJugador.innerHTML = inputHipodoge.id
        mascotaJugador = inputHipodoge.id
    } else if (inputCapipepo && inputCapipepo.checked) {
        spanMascotaJugador.innerHTML = inputCapipepo.id
        mascotaJugador = inputCapipepo.id
    } else if (inputRatigueya && inputRatigueya.checked) {
        spanMascotaJugador.innerHTML = inputRatigueya.id
        mascotaJugador = inputRatigueya.id
    } else {
        alert("Selecciona una mascota")
        return
    }

    sectionSeleccionarMascota.style.display = "none"

    seleccionarMokepon(mascotaJugador)

    extraerAtaques(mascotaJugador)
    sectionVerMapa.style.display = "flex"
    iniciarMapa()
}

function seleccionarMokepon(mascotaJugador) {
    if (!jugadorId) {
        console.log("Esperando ID del servidor...")
        return
    }

    fetch(`${URL_SERVIDOR}/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        })
    })
    .then(function (res) {
        if (res.ok) {
            console.log("Mokepon enviado al servidor con éxito")
        }
    })
}

function extraerAtaques(mascotaJugador) {
    let ataques
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            ataques = mokepones[i].ataques
        }
    }
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques) {
    ataques.forEach((ataque) => {
        ataquesMokepon = `
        <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button>
        `
        contenedorAtaques.innerHTML += ataquesMokepon
    })

    botones = document.querySelectorAll(".BAtaque")
    secuenciaAtaque()
}

function secuenciaAtaque() {
    botones.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            if (e.target.textContent === "🔥") {
                ataqueJugador.push("FUEGO")
                console.log(ataqueJugador)
                boton.style.background = "#ff69b4"
                boton.disabled = true
            } else if (e.target.textContent === "💧") {
                ataqueJugador.push("AGUA")
                console.log(ataqueJugador)
                boton.style.background = "#ff69b4"
                boton.disabled = true
            } else {
                ataqueJugador.push("TIERRA")
                console.log(ataqueJugador)
                boton.style.background = "#ff69b4"
                boton.disabled = true
            }

            if (ataqueJugador.length === 5) {
                enviarAtaques()
            }
        })
    })
}

function enviarAtaques() {
    if (!jugadorId) {
        return
    }

    fetch(`${URL_SERVIDOR}/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques() {
    if (!enemigoId) {
        return
    }

    fetch(`${URL_SERVIDOR}/mokepon/${enemigoId}/ataques`)
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ ataques }) {
                        if (ataques.length === 5 && ataqueEnemigo.length !== 5) {
                            ataqueEnemigo = ataques
                            combate()
                        }
                    })
            }
        })
}

function SeleccionarMascotaEnemigo(enemigo) {
    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesMokeponEnemigo = enemigo.ataques
}

function ataqueAleatorioEnemigo() {
    console.log("Ataques enemigo", ataquesMokeponEnemigo)
    let ataqueAleatorio = aleatorio(0, ataquesMokeponEnemigo.length - 1)

    if (ataquesMokeponEnemigo[ataqueAleatorio].nombre === "🔥") {
        ataqueEnemigo.push("FUEGO")
    } else if (ataquesMokeponEnemigo[ataqueAleatorio].nombre === "💧") {
        ataqueEnemigo.push("AGUA")
    } else {
        ataqueEnemigo.push("TIERRA")
    }

    console.log("Ataques del enemigo:", ataqueEnemigo)
    iniciarCombate()
}

function iniciarCombate() {
    if (ataqueJugador.length === 5) {
        combate()
    }
}

function indexAmbosOponentes(jugador, enemigo) {
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function combate() {
    clearInterval(intervalo)

    for (let index = 0; index < ataqueJugador.length; index++) {
        if (ataqueJugador[index] === ataqueEnemigo[index]) {
            indexAmbosOponentes(index, index)
            crearMensaje("EMPATE")
        } else if (
            (ataqueJugador[index] == "FUEGO" && ataqueEnemigo[index] == "TIERRA") ||
            (ataqueJugador[index] == "AGUA" && ataqueEnemigo[index] == "FUEGO") ||
            (ataqueJugador[index] == "TIERRA" && ataqueEnemigo[index] == "AGUA")
        ) {
            indexAmbosOponentes(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else {
            indexAmbosOponentes(index, index)
            crearMensaje("PERDISTE")
            victoriasEnemigo++
            spanVidasEnemigo.innerHTML = victoriasEnemigo
        }
    }

    revisarVidas()
}

function revisarVidas() {
    if (victoriasJugador === victoriasEnemigo) {
        crearMensajeFinal("Esto fue un empate 🤝")
    } else if (victoriasJugador > victoriasEnemigo) {
        crearMensajeFinal("¡FELICITACIONES! Ganaste 🎉")
    } else {
        crearMensajeFinal("Lo siento, perdiste 😢")
    }
}

function crearMensaje(resultado) {
    let nuevoAtaqueDelJugador = document.createElement("p")
    let nuevoAtaqueDelEnemigo = document.createElement("p")

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo

    if (ataqueDelJugador) {
        ataqueDelJugador.appendChild(nuevoAtaqueDelJugador)
    }
    if (ataqueDelEnemigo) {
        ataqueDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
    }
}

function crearMensajeFinal(resultadoFinal) {
    sectionMensajes.innerHTML = resultadoFinal
    sectionReiniciar.style.display = "block"
}

function reiniciarJuego() {
    location.reload()
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function obtenerObjetoMascota() {
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            return mokepones[i]
        }
    }
}

function pintarCanvas() {
    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.vx
    mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.vy

    lienzo.clearRect(0, 0, mapa.width, mapa.height)

    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )

    mascotaJugadorObjeto.pintarMokepon()

    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)

    mokeponesEnemigos.forEach(function (enemigo) {
        enemigo.pintarMokepon()
    })

    mokeponesEnemigos.some(function (enemigo) {
        return revisarColision(enemigo)
    })
}

function enviarPosicion(x, y) {
    if (!jugadorId) {
        return
    }

    fetch(`${URL_SERVIDOR}/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function (res) {
        if (res.ok) {
            res.json()
                .then(function ({ enemigos }) {
                    console.log(enemigos)
                    mokeponesEnemigos = enemigos
                        .map(function (enemigo) {
                            const mokeponNombre = (enemigo.mokepon && enemigo.mokepon.nombre) || ""
                            const mokeponEnemigo = crearMokepon(mokeponNombre, enemigo.id)

                            if (!mokeponEnemigo) {
                                return null
                            }

                            mokeponEnemigo.x = enemigo.x || 0
                            mokeponEnemigo.y = enemigo.y || 0

                            return mokeponEnemigo
                        })
                        .filter(function (enemigo) {
                            return enemigo !== null
                        })
                })
        }
    })
}

function moverArriba() {
    mascotaJugadorObjeto.vy = -5
}

function moverAbajo() {
    mascotaJugadorObjeto.vy = 5
}

function moverIzquierda() {
    mascotaJugadorObjeto.vx = -5
}

function moverDerecha() {
    mascotaJugadorObjeto.vx = 5
}

function detenerMovimiento() {
    mascotaJugadorObjeto.vx = 0
    mascotaJugadorObjeto.vy = 0
}

function sepresionounatecla(event) {
    switch (event.key) {
        case "ArrowUp":
            moverArriba()
            break
        case "ArrowDown":
            moverAbajo()
            break
        case "ArrowLeft":
            moverIzquierda()
            break
        case "ArrowRight":
            moverDerecha()
            break
        default:
            break
    }
}

function iniciarMapa() {
    mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador)
    console.log(mascotaJugadorObjeto, mascotaJugador)
    intervalo = setInterval(pintarCanvas, 50)

    window.addEventListener("keydown", sepresionounatecla)
    window.addEventListener("keyup", detenerMovimiento)
}

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = mascotaJugadorObjeto.y
    const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto
    const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho
    const izquierdaMascota = mascotaJugadorObjeto.x

    if (
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return false
    }

    detenerMovimiento()
    clearInterval(intervalo)
    console.log("Se detectó una colisión")

    sectionSeleccionarAtaque.style.display = "flex"
    sectionVerMapa.style.display = "none"
    enemigoId = enemigo.id
    SeleccionarMascotaEnemigo(enemigo)
    return true
}

window.addEventListener("load", iniciarJuego)