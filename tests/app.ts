import express, { RequestHandler } from 'express'
import { Server } from 'http'
import { DataProvider } from 'ra-core'
import simpleRestProvider from 'ra-data-simple-rest'

let portOffset = 0

export const setupApp = async (
  requestHandler: RequestHandler,
  ctx: { server: Server | null }
) => {
  const port = 6767 + portOffset
  portOffset += 1

  const app = express()

  app.use((req, res, next) => {
    // console.log(req.originalUrl)
    next()
  })

  app.use(requestHandler)

  app.use((err, req, res, next) => {
    console.error(err)
    next(err)
  })

  ctx.server = await new Promise<Server>(resolve => {
    const _server = app.listen(port, () => resolve(_server))
  })

  return simpleRestProvider(`http://localhost:${port}`) as DataProvider
}
