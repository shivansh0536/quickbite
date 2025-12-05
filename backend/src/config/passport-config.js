const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('../utils/prisma');

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackURL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

if (!googleClientId || !googleClientSecret) {
    console.warn('⚠️  Google OAuth credentials not found. Google authentication will not be available.');
    console.warn('   Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file.');
} else {
    passport.use(
        new GoogleStrategy(
            {
                clientID: googleClientId,
                clientSecret: googleClientSecret,
                callbackURL: googleCallbackURL
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await prisma.user.findUnique({
                        where: { googleId: profile.id }
                    });

                    if (!user) {
                        user = await prisma.user.findUnique({
                            where: { email: profile.emails[0].value }
                        });

                        if (user) {
                            user = await prisma.user.update({
                                where: { id: user.id },
                                data: { googleId: profile.id }
                            });
                        } else {
                            user = await prisma.user.create({
                                data: {
                                    googleId: profile.id,
                                    email: profile.emails[0].value,
                                    name: profile.displayName,
                                    role: 'CUSTOMER'
                                }
                            });
                        }
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
