const express = require("express")
const cors = require("cors")

const PUERTO = 8080
const TIEMPO_MAXIMO_INACTIVO = 5000

const DEBUG_POSICION = true

const app = express()

app.use(express.static("public"))
app.use(cors())
app.use(express.json())

class Jugador {
  constructor(id) {
    this.id = id
  }

  asignarMokepon(mokepon) {
    this.mokepon = mokepon
  }

  actualizarPosicion(x, y) {
    this.x = x
    this.y = y
    this.ultimaVez = Date.now()
  }

  asignarAtaques(ataques) {
    this.ataques = ataques
  }
}

class Mokepon {
  constructor(nombre) {
    this.nombre = nombre
  }
}

const jugadores = []

function buscarJugador(jugadorId) {
  return jugadores.find((jugador) => jugador.id === jugadorId)
}

function estaActivo(jugador) {
  return Boolean(
    jugador.mokepon &&
    jugador.ultimaVez &&
    Date.now() - jugador.ultimaVez < TIEMPO_MAXIMO_INACTIVO
  )
}

app.get("/unirse", (req, res) => {
  const id = `${Math.random()}`

  jugadores.push(new Jugador(id))
  console.log("Jugador unido con id:", id)

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.send(id)
})

app.post("/mokepon/:jugadorId", (req, res) => {
  const jugadorId = req.params.jugadorId || ""
  const nombre = req.body.mokepon || ""

  const jugador = buscarJugador(jugadorId)

  if (jugador) {
    jugador.asignarMokepon(new Mokepon(nombre))
    console.log(`Jugador ${jugadorId} eligió a ${nombre}`)
  } else {
    console.log("No se encontró el jugador con id:", jugadorId)
  }

  res.end()
})

app.post("/mokepon/:jugadorId/posicion", (req, res) => {
  const jugadorId = req.params.jugadorId || ""
  const x = req.body.x || 0
  const y = req.body.y || 0

  const jugador = buscarJugador(jugadorId)

  if (jugador) {
    jugador.actualizarPosicion(x, y)

    if (DEBUG_POSICION) {
      console.log(`Posición de ${jugadorId}: x=${x}, y=${y}`)
    }
  } else {
    console.log("Posición recibida de un jugador desconocido:", jugadorId)
  }

  const enemigos = jugadores.filter((otro) => otro.id !== jugadorId && estaActivo(otro))

  res.send({ enemigos })
})

app.post("/mokepon/:jugadorId/ataques", (req, res) => {
  const jugadorId = req.params.jugadorId || ""
  const ataques = req.body.ataques || []

  const jugador = buscarJugador(jugadorId)

  if (jugador) {
    jugador.asignarAtaques(ataques)
    console.log(`Jugador ${jugadorId} envió ataques:`, ataques)
  }

  res.end()
})

app.get("/mokepon/:jugadorId/ataques", (req, res) => {
  const jugadorId = req.params.jugadorId || ""
  const jugador = buscarJugador(jugadorId)

  res.send({
    ataques: (jugador && jugador.ataques) || []
  })
})

app.listen(PUERTO, () => {
  console.log(`Servidor funcionando en http://localhost:${PUERTO}`)
})