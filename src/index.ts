import Koa from "koa";
const app = new Koa();

//Auth Middleware
import auth from "koa-basic-auth";

//Router
import Router from "@koa/router";
const router = new Router();

//Bodyparser
import bodyparser from "koa-bodyparser";
app.use(bodyparser());

//Templates
import Pug from "koa-pug";
new Pug({
  viewPath: "./res/views",
  basedir: "./res/views",
  app: app
});

//LowDB
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("res/db.json");
const db = low(adapter);

//Contacts Inteface
interface ContactsI {
  id: number;
  name: string;
  email: string;
  phone: string;
}

//Routes

//Display Contacts 
router.get("/", async ctx => {
  const contacts = db.get("contacts").value();
  await ctx.render("index", { contacts });
});

//Delete a contact
router.post("/:id/delete", async ctx => {
  db.get("contacts")
    .remove({ id: +ctx.params.id })
    .write();
  await ctx.redirect("/");
});

//Insert a new contact
router.post("/", async ctx => {
  const contacts: ContactsI[] = db.get("contacts").value();

  const mID = contacts.reduce((prev, cur) => {
    return Math.max(prev, cur.id);
  }, 0);

  contacts.push({ ...ctx.request.body, id: mID + 1 });

  db.setState({ contacts }).write();

  await ctx.redirect("/");
});

//Authentication Trail
var credentials = { name: "tarun", pass: "y777" };

app.use(function*(next) {
  this.cookies.set("foo", "bar", { httpOnly: false });
  return yield next;
});

router.get("/protected", auth(credentials), function*(next) {
  this.body = "You have access to the protected area.";
  yield next;
});


app.use(router.routes()).use(router.allowedMethods());

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
