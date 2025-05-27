import { AppError } from "./app-erro"

// esse class é para erros notfound(id)
export class NotFoundError extends AppError {
    constructor(message: string) {
        // o super o construtor da class apperror
        super(message, 404)
        this.name = 'NotFoundError'
    }
}