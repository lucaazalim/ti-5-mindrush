import {z} from "zod";

export const uuidParser = z.string().uuid({
    message: "O ID informado é inválido."
});