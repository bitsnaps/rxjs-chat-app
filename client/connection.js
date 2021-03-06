const { of, fromEvent } = require('rxjs')
const { map, switchMap } = require('rxjs/operators')
const io = require('socket.io-client')

// Initialise Socket.IO and wrap in observable
const socket$ = of(io())

// Stream of connections
const connect$ = socket$
  .pipe(
    switchMap(socket =>
      fromEvent(socket, 'connect')
        .pipe(
          map(() => socket)
        )
    )
  )

// On connection, listen for event
export function listenOnConnect(event) {
  return connect$
    .pipe(
      switchMap(socket =>
        fromEvent(socket, event)
      )
    )
}

// On connection, emit data from observable
export function emitOnConnect(observable$) {
  return connect$
    .pipe(
      switchMap(socket =>
        observable$
          .pipe(
            map(data => ({ socket, data }))
          )
      )
    )
}
