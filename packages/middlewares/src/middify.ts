import middy from "@middy/core"
import { Context } from "aws-lambda"
import { ErrorHandlerMiddleware } from "./error-handler"

export const middify = <T>(
    handler: (event: T, context?: Context) => Promise<unknown>,
  ) => {
    return middy(handler)
      .use(ErrorHandlerMiddleware())
  }
