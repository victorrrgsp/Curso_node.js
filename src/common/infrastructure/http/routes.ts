// aqui nesse arquivo foi definido as rotas, mas ainda não então sendo chamadas
import {Router} from 'express'

const routes = Router()

routes.get('/', (req, res) => {
    return res.status(200).json({ message: 'Hello dev' })
})

export {routes}