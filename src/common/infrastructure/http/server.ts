// no server é onde vai subir a nossa aplicação

import { app } from "./app";

const port = 3333
// quando executar a aplicação (npm run dev), onde está configurado no packege.json este arquivo (server), vai executar a aplicação que vai usar na port 3333 do servidor e irá mostar no console uma menssage
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

