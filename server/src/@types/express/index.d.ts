// this file can be used to extend express types when needed
export {}

declare global {
  namespace Express {
      interface Request {
          customProperty?: any
      }
  }
}