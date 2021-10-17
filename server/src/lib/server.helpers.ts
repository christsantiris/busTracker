import * as fs from 'fs';
import * as path from 'path';
import { Services } from '../services';
import { Connection } from 'mongoose';

export class ServerHelpers {
  public static async handleProgramExit(connection: Connection): Promise<void> {
    if (connection) {
      await connection.close();
      process.exit(0);
    }
  }

  public static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public static loadRoutes(app, express, services: Services) {
    const routes = this.checkMainDirectory(path.join(__dirname, '..', 'routes'));
    if (!routes || !routes.length) {
      throw new Error('Did not find any routes');
    }
    for (const route of routes) {
      if (route?.parentPaths?.length && route.routeName === route.parentPaths[route.parentPaths.length - 1]) {
        app.use(`/${route.parentPaths.join('/')}`, require(route.fullPath.replace(/\.[tj]s$/g, '')).default(app, express, services));
        console.info(`Loaded routes for: /${route.parentPaths.join('/')}`);
      } else if (route?.parentPaths?.length) {
        app.use(
          `/${route.parentPaths.join('/')}/${route.routeName}`,
          require(route.fullPath.replace(/\.[tj]s$/g, '')).default(app, express, services)
        )
        console.info(`Loaded routes for /${route.parentPaths.join('/')}/${route.routeName}`);
      } else {
        app.use(`/${route.routeName}`, require(route.fullPath.replace(/\.[tj]s$/g, '')).default(app, express, services));
        console.info(`Loaded routes for /${route.routeName}`);
      }
    }
  }

  private static checkMainDirectory(directory: string) {
    const routes: Array<any> = [];
    fs.readdirSync(directory).forEach((file) => {
      const fullPath = path.join(directory, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        routes.push(...this.recurseDirectory(fullPath, [file]));
      } else if (/\.api\.[tj]s$/.test(file)) {
        routes.push({
          fileName: file,
          routeName: file.replace(/\..+/g, ''),
          fullPath: fullPath
        });
      }
    });
    return routes;
  }

  public static recurseDirectory(directory: string, priorPath: Array<string> = []): Array<any> {
    const results = [];

    fs.readdirSync(directory).forEach((file) => {
      const fullPath = path.join(directory, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        results.push(...this.recurseDirectory(fullPath, priorPath.concat([file])));
      } else if (/\.api.[tj]s$/.test(file)) {
        results.push({
          fileName: file,
          routeName: file.replace(/\..+/g, ''),
          fullPath: fullPath,
          parentPaths: priorPath
        });
      }
    });
    return results;
  }
}
