import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkUser(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                try {
                    let user = await prisma.users.findUnique({
                        where: {
                            id: decodedToken.id
                        }
                    });
                    res.locals.user = user;
                    next();
                } catch (error) {
                    console.error(error)
                }
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

export default checkUser;