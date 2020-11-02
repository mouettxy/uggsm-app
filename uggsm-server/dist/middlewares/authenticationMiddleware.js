"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddleware = void 0;
function authenticationMiddleware(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookies = request.cookies;
        next();
        /* if (cookies && cookies.Authorization) {
          //const secret = process.env.JWT_SECRET
          try {
            next()
            /* const verificationResponse = jwt.verify(
              cookies.Authorization,
              secret,
            ) as DataStoredInToken
            const id = verificationResponse._id
            const user = await UserModel.findById(id)
            if (user) {
              next()
            } else {
              next(new WrongAuthenticationTokenException())
            }
          } catch (error) {
            next(new WrongAuthenticationTokenException())
          }
        } else {
          next(new AuthenticationTokenMissingException())
        } */
    });
}
exports.authenticationMiddleware = authenticationMiddleware;
