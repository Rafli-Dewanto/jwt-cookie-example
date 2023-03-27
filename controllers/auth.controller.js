import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const oneDay = 24 * 60 * 60 * 1000;

export function getSignup(req, res) {
    res.render('signup');
}

export function getLogin(req, res) {
    res.render('login');
}

export async function signup(req, res) {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const payload = {
        email,
        password: hashedPassword
    }

    try {
        const newUser = await prisma.users.create({
            data: payload
        })

        const token = jwt.sign({ 'id': newUser.id }, process.env.ACCESS_TOKEN, { expiresIn: '1d' });

        res.cookie('jwt', token, { httpOnly: true, secure: false, maxAge: oneDay });

        res.status(201).json({
            status: 'created',
            id: newUser.id,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 'INTERNAL_SERVER_ERROR',
            error: error
        })
    }
}

export async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await prisma.users.findUniqueOrThrow({
            where: {
                email
            }
        })

        const match = await bcrypt.compare(password, user.password);

        if (!match) return res.status(401).json({
            status: 'UNAUTHORIZED',
            errors: [
                `your email or password is wrong`
            ],
        })

        const token = jwt.sign({ 'id': user.id }, process.env.ACCESS_TOKEN, { expiresIn: '1d' });
        res.cookie('jwt', token, { httpOnly: true, secure: false, maxAge: oneDay });

        return res.status(200).json({
            status: 'OK',
            id: user.id
        })

    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({
            status: 'NOT_FOUND',
            errors: [
                `your email or password is wrong`
            ]
        })
    }
}

export async function logout(req, res) {
    const token = req.cookies.jwt;
    if (!token) return res.sendStatus(204);
    res.clearCookie("jwt", { httpOnly: true });
    res.redirect('/')
}