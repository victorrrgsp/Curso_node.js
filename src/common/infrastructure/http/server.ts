// no server é onde vai subir a nossa aplicação

import { env } from "../env";
import { dataSource } from "../typeorm";
import { app } from "./app";

dataSource.initialize().then(() => {
    // quando executar a aplicação (npm run dev), onde está configurado no packege.json este arquivo (server), vai executar a aplicação que vai usar na port 3333 do servidor e irá mostar no console uma menssage
    app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`)
        console.log('API docs avalable at GET /docs')
    })
}).catch((error) => {
    console.error('Error initializing data source', error)
})


