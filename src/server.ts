import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import cors from '@fastify/cors'

const app = fastify()

app.register(cors, {
  origin: true
})

app.register(usersRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('😁🎉 Servidor Online!')
  })

