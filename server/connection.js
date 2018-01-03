const Rx = require('rxjs')

const createStreams = (io) => {

	const io$ = Rx.Observable.of(io)

	const connection$ = io$
		.mergeMap(io => {
			return Rx.Observable.fromEvent(io, 'connection')
				.map(client => ({ io, client }))
		})

	const disconnect$ = connection$
		.mergeMap(({ client }) => {
			return Rx.Observable.fromEvent(client, 'disconnect')
				.map(() => client)
		})

	return { io$, connection$, disconnect$ }

}

module.exports = createStreams