import "reflect-metadata";
import {createExpressServer} from "../../src/index";

// base directory. we use it because file in "required" in another module
const baseDir = __dirname;

const app = createExpressServer({
    controllers: [baseDir + "/modules/**/controllers/*{.js,.ts}"],
    middlewares: [baseDir + "/modules/**/middlewares/*{.js,.ts}"]
});
app.listen(3001);

console.log("server is running on port 3001. Open http://localhost:3001/blogs/");
