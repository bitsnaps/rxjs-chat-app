const server = require('./server')
const { connection$, disconnect$, listenOnConnect } = require('./connection')

// Start server listening
server.listen(3000, () => console.log('listening on port: 3000'))

// Listen for new usernames and store in corresponding socket object
listenOnConnect('save username')
  .subscribe(({ io, client, data }) => {
    const allSockets = io.sockets.sockets //connected socket objects where each key is the socket id
    const id = client.id
    const username = data

    // Store username in socket
    allSockets[id].username = username

    // Inform other users of new user
    client.broadcast.emit('new user', { id, username })
  })

  // On connection, send array of all users
  connection$
    .subscribe(({ io, client }) => {
      const allSockets = io.sockets.sockets

      const allUsers = Object.entries(allSockets)
        .map(([ id, socket ]) => ({ id, username: socket.username }))
        // filter out any that don’t have a username
        .filter(({ username }) => username)

      client.emit('all users', allUsers)
    })

// On disconnect, tell other users
disconnect$
  .subscribe(client => {
    const id = client.id
    const username = client.username
    client.broadcast.emit('remove user', {id, username})
  })

// Listen for message events and send to relevant users
listenOnConnect('chat message')
  .subscribe(({ client, data }) => {
    const from = client.username
    const { id, message } = data

    if (!id) return

    if (id === 'everyone') {
      // Send to everyone
      client.broadcast.emit('chat message', { from, message })
    }
    else {
      // Send only to recipient
      client.broadcast.to(id).emit('chat message', { from, message })
    }
  })
