import { Server as app } from "../index";

/**
 * db1: 接口相关
 */

export default class Redis {
  public static async get(db: number = 1, key: string) {
    return new Promise<string>((resolve, reject) => {
      app.redisClient.select(db, (err) => {
        if (err) {
          reject(err);
        }
        app.redisClient.get(key, (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data || "");
        });
      });
    });
  }

  /**
   * @param time 过期时间(s)
   */
  public static async set(db: number = 1, key: string, val: string, expiryMode?: 'EX' | 'PX', time?: number){
    return new Promise<void>((resolve, reject) => {
      app.redisClient.select(db, (err) => {
        if (err) {
          return reject(err);
        }
        if(expiryMode) {
          return app.redisClient.set(key, val, expiryMode, time);
        } else {
          app.redisClient.set(key, val, (err) => {
            if (err) reject(err);
            return resolve();
          })
        }
      });
    });
  }
  public static async keys(db: number, pattern: string) {
    return new Promise<string[]>((resolve, reject) => {
      app.redisClient.select(db, (err) => {
        if (err) reject(err);
        app.redisClient.keys(pattern, (err, res) => {
          if (err) reject(err);
          resolve(res);
        });
      });
    });
  }
}
