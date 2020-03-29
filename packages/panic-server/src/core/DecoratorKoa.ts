import fs from 'fs';
import { Context, Middleware } from 'koa';
import Router from 'koa-router';
import path from 'path';
export enum HttpMethod {
  GET,
  PUT,
  PATCH,
  POST,
  DELETE,
  ALL,
  OPTIONS,
  HEAD,
}
/**
 *
 * @param dir directory path
 * @param files_
 *
 */

function getFiles(dir: string, fileList?: string[]): string[] {
  fileList = fileList || [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, fileList);
    } else {
      if (name.indexOf('.map') === -1) {
        fileList.push(name);
      }
    }
  });
  return fileList;
}

const router = new Router();
const instances = new Map();

export function Controller(url: string, middleware: Middleware[] = []) {
  return (target: any) => {
    if (!target.prototype.router) {
      target.prototype.router = new Router();
    }
    let instance;
    if (!instances.get(target.name)) {
      instance = new target.prototype.constructor();
      instances.set(target.name, instance);
    } else {
      instance = instances.get(target.name);
    }

    if (middleware.length > 0) {
      target.prototype.router.use(...middleware);
    }
    router.use(url, instance.router.routes(), target.prototype.router.allowedMethods());
    return;
  };
}

export function route(url: string, method?: HttpMethod, ...middleware: Middleware[]) {
  return (target: any, key?: string | symbol): void => {
    if (!target.router) {
      target.router = new Router();
    }

    let instance = instances.get(target.constructor.name);
    if (!instance) {
      instance = new target.constructor();
      instances.set(target.constructor.name, instance);
    }

    const action: any = instance[key].bind(instance);

    const handelReturnMiddleware = async (ctx: Context) => {
      await action(ctx);
    };

    switch (method) {
      case HttpMethod.HEAD:
        target.router.head(url, ...middleware, handelReturnMiddleware);
        break;
      case HttpMethod.OPTIONS:
        target.router.options(url, ...middleware, handelReturnMiddleware);
        break;
      case HttpMethod.GET:
        target.router.get(url, ...middleware, handelReturnMiddleware);
        break;
      case HttpMethod.POST:
        target.router.post(url, ...middleware, handelReturnMiddleware);
        break;
      case HttpMethod.PATCH:
        target.router.patch(url, ...middleware, handelReturnMiddleware);
        break;
      case HttpMethod.PUT:
        target.router.put(url, ...middleware, handelReturnMiddleware);
        break;
      case HttpMethod.DELETE:
        target.router.delete(url, ...middleware, handelReturnMiddleware);
        break;
      case HttpMethod.ALL:
        target.router.all(url, ...middleware, handelReturnMiddleware);
        break;
    }
  };
}

/**
 *
 * @param controllersDir
 */

export function load(controllersDir: string): Router {
  getFiles(controllersDir).forEach(async file => {
    try {
      await import(file);
    } catch (error) {
      //
    }
  });
  return router;
}
