import "reflect-metadata";
import express, { type Request, type Response } from "express";

function createRouterDecorator(method: string) {
  return function (path: string) {
    return function (target: any, propertyKey: string) {
      const routers =
        Reflect.getMetadata("custom:routers", target.constructor) || [];
      routers.push({ method, path, handler: propertyKey });
      Reflect.defineMetadata("custom:routers", routers, target.constructor);
    };
  };
}

const Get = createRouterDecorator("GET");
const Post = createRouterDecorator("POST");

function Param(paramName: string) {
  return function (target: any, propertyKey: string, paramIndex: number) {
    const params =
      Reflect.getMetadata(`params_${propertyKey}`, target, propertyKey) || [];
    params[paramIndex] = { type: "param", name: paramName };
    Reflect.defineMetadata(
      `params_${propertyKey}`,
      params,
      target,
      propertyKey
    );
  };
}

function Controller(prefix: string) {
  return function (target: any) {
    Reflect.defineMetadata("custom:prefix", prefix, target);
  };
}

function Injectable() {
  return function (target: any) {
    Reflect.defineMetadata("custom:injectable", true, target);
  };
}

const m = new Map();

function inject(constructor: any) {
  if (!m.has(constructor)) {
    m.set(constructor, new constructor());
  }
  return m.get(constructor);
}

@Injectable()
class UserService {
  getUserById(id: number) {
    return { id: id, name: `user${id}` };
  }
}

@Controller("/api/user")
class UserController {
  private userService = inject(UserService);

  @Get("")
  listUser() {
    return [
      { id: 1, name: "user1" },
      { id: 2, name: "user2" },
    ];
  }

  @Get("/:id")
  getUser(@Param("id") id: number) {
    return this.userService.getUserById(id);
  }

  @Post("/")
  createUser() {
    console.log("create user");
  }
}

function setupRouter(controller: any, app: any) {
  const prefix = Reflect.getMetadata("custom:prefix", controller.constructor);
  const routers = Reflect.getMetadata("custom:routers", controller.constructor);
  for (const router of routers) {
    const handler = controller[router.handler].bind(controller);
    app[router.method.toLowerCase()](
      prefix + router.path,
      (req: Request, res: Response) => {
        const params =
          Reflect.getMetadata(
            `params_${router.handler}`,
            controller,
            router.handler
          ) || [];
        const args = params.map((param: any) => {
          if (param.type === "param") {
            return req.params[param.name];
          }
        });
        const result = handler(...args);
        res.json(result);
      }
    );
  }
}

const app = express();

const userController = new UserController();
setupRouter(userController, app);

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("the server is running at 3000");
});
