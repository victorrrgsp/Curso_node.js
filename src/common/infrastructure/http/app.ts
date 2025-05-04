import  express  from "express"
import cors from "cors"
import {routes} from "./routes" 
import { errorHandler } from "./middlewares/errorHandler"

// aqui é a instacia do express(mico fremeworlk)
const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)
app.use(errorHandler)

export {app}
