import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance){
    app.get('/users', async (request, response) => {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true, 
                admin: true,
                passwd: true
            }
        })
        return response.status(200).send(users)
      })

      app.get('/users/:id', async (request) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id,
            }
        })

        return user
    })

    app.post('/users', async (request, response) => {
        const bodySchema = z.object({
            name: z.string(),   
            admin : z.string(),
            passwd: z.string()
        })

        const { name, admin, passwd } = bodySchema.parse(request.body)

        if (!name || !admin || !passwd) {
            return response.status(400).send('Invalid username or password');
        }else {

            const user = await prisma.user.create({
                data: {
                    name,
                    admin,
                    passwd,
                }
            })

            return response.status(200).send(user)
        }



    })

    app.put('/users/:id', async (request, response) => {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const bodySchema = z.object({
            name: z.string(),   
            admin : z.string(),
            passwd: z.string()
        })

        const { name, admin, passwd } = bodySchema.parse(request.body)

        const user = await prisma.user.update({
            where: {
                id
            },
            data: {
                name,
                admin,
                passwd
            }
        })

        return response.status(200).send(user)
    })

    app.delete('/users/:id', async (request) => {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        await prisma.user.delete({
            where: {
                id
            }
        })
    })
}