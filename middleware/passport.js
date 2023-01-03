const passport = require("passport");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const config = require('../config/config')

passport.use(
  "jwt",
  new JWTstrategy(
    {
      secretOrKey: config.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);
