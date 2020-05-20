const { of, fromEvent } = require('rxjs')
const { map, switchMap, mergeMap, takeUntil } = require('rxjs/operators')
const io = require('socket.io')
const server = require('./server')

// Initialise Socket.IO and wrap in observable
const io$ = of(io(server))

// Stream of connections
const connection$ = io$
  .pipe(
    // Stream uses the switchMap operator to switch over to a new observable listening for “connection” events.
    switchMap(io =>
      fromEvent(io, 'connection')
        .pipe(
          map(client => ({ io, client }))
        )
    )
  )

  // Stream of disconnections
  const disconnect$ = connection$
    .pipe(
      // We use mergeMap as our connection$ stream will emit multiple times (whenever a new client connects) and we want to retain all of these.
      mergeMap(({ client }) =>
        fromEvent(client, 'disconnect')
          .pipe(
            map(() => client)
          )
      )
    )

function listenOnConnect(event) {
  return connection$
    .pipe(
      mergeMap(({ io, client }) =>
        fromEvent(client, event)
          .pipe(
            // We can’t use our existing disconnect$ stream here as it will
            // emit on any client disconnection, but we want this stream to
            // end only when this specific client disconnects.
            takeUntil(
              fromEvent(client, 'disconnect')
            ),
            map(data => ({ io, client, data }))
          )
      )
    )
}

module.exports = { connection$, disconnect$, listenOnConnect}
