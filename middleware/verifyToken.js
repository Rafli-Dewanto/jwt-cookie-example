import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
    const token = req.cookies.jwt;

    if (!token) {
        res.redirect('/login')
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        // req.user = decoded.id;
        console.log({decoded});
        console.log(req.user);
        next();
    } catch (error) {
        res.redirect('/login')
    }
}

export default verifyToken;