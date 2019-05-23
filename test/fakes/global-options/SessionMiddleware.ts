import {ExpressMiddlewareInterface} from "../../../src/driver/express/ExpressMiddlewareInterface";
import * as session from "express-session";

export class SessionMiddleware implements ExpressMiddlewareInterface {
    public use(requestOrContext: any, responseOrNext: any, next?: (err?: any) => any): any {
        return this.expSession(requestOrContext, responseOrNext, next);
    }

    private expSession = session({
        secret: "19majkel94_helps_pleerock",
        resave: false,
        saveUninitialized: true,
    });
}
