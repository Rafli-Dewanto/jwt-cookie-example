import validator from 'validator';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const signUpValidator = async (req, res, next) => {
    const { email, password } = req.body;
    const errors = {};

    try {
        const isExist = await prisma.users.findUnique({
            where: {
                email
            }
        })

        if (isExist) {
            const message = 'email already exists';
            errors.email = [message]
        }
    } catch (error) {
        res.status(500).json(error)
    }

    if (!validator.isEmail(email)) {
        const validEmail = 'Invalid email';
        errors.email = [validEmail]
    }

    const passwordOptions = {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10
    };

    if (!validator.isStrongPassword(password, passwordOptions)) {
        errors.password = [
            'your password is not strong enough',
            passwordOptions
        ]
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            status: 'BAD_REQUEST',
            message: 'Invalid credentials',
            errors: errors
        });
    }

    next();
};

export const loginValidator = async (req, res, next) => {
    const { email } = req.body;
    const errors = [];

    if (!validator.isEmail(email)) {
        const validEmail = 'your email or password is wrong';
        errors.push(validEmail)
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            status: 'BAD_REQUEST',
            message: 'Invalid credentials',
            errors: errors
        });
    }

    next();
};
