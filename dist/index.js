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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const app = new koa_1.default();
//Auth Middleware
const koa_basic_auth_1 = __importDefault(require("koa-basic-auth"));
//Router
const router_1 = __importDefault(require("@koa/router"));
const router = new router_1.default();
//Bodyparser
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
app.use(koa_bodyparser_1.default());
//Templates
const koa_pug_1 = __importDefault(require("koa-pug"));
new koa_pug_1.default({
    viewPath: "./res/views",
    basedir: "./res/views",
    app: app
});
//LowDB
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("res/db.json");
const db = low(adapter);
//Routes
//Display Contacts 
router.get("/", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const contacts = db.get("contacts").value();
    yield ctx.render("index", { contacts });
}));
//Delete a contact
router.post("/:id/delete", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    db.get("contacts")
        .remove({ id: +ctx.params.id })
        .write();
    yield ctx.redirect("/");
}));
//Insert a new contact
router.post("/", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const contacts = db.get("contacts").value();
    const mID = contacts.reduce((prev, cur) => {
        return Math.max(prev, cur.id);
    }, 0);
    contacts.push(Object.assign(Object.assign({}, ctx.request.body), { id: mID + 1 }));
    db.setState({ contacts }).write();
    yield ctx.redirect("/");
}));
//Authentication Trail
var credentials = { name: "tarun", pass: "y777" };
app.use(function* (next) {
    this.cookies.set("foo", "bar", { httpOnly: false });
    return yield next;
});
router.get("/protected", koa_basic_auth_1.default(credentials), function* (next) {
    this.body = "You have access to the protected area.";
    yield next;
});
app.use(router.routes()).use(router.allowedMethods());
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
//# sourceMappingURL=index.js.map