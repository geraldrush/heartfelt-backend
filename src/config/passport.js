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
            sentRequests: true, // Include sent requests
            receivedRequests: true, // Include received requests
          },
        });

        // If the user does not exist, create a new user with the specified fields
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              avatarUrl: profile.photos[0].value,
              story: "", // Initialize an empty bio; can be updated later
              tokens: 0.0, // Initialize the token balance
              gender: "", // Initialize gender as empty; can be updated later
              age: null, // Initialize age as null; can be updated later
              race: "", // Initialize race as empty; can be updated later
              location: "", // Initialize location as empty; can be updated later
              preference: "", // Initialize preference as empty; can be updated later
              // Optional initial story if needed
              Story: {
                create: {
                  content: "This is my story!", // Default content; user can edit later
                },
              },
            },
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
        sentRequests: true, // Include sent requests
        receivedRequests: true, // Include received requests
      },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
