import passport from "passport";
import { PrismaClient } from "@prisma/client";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
          include: {
            sentRequests: true,
            receivedRequests: true,
          },
        });

        if (!user) {
          // Create a new user if they do not exist
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              avatarUrl: profile.photos[0].value,
              story: "",
              tokens: 0.0,
              gender: "",
              age: null,
              race: "",
              location: "",
              preference: "",
              status: "online", // Set status to online for new users
              Story: {
                create: {
                  content: "This is my story!",
                },
              },
            },
          });
        } else {
          // Update the existing user's status to online if they are already registered
          user = await prisma.user.update({
            where: { googleId: profile.id },
            data: { status: "online" },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        sentRequests: true,
        receivedRequests: true,
      },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
