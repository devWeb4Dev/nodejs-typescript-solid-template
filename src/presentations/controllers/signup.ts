import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../error/missing-param-error'
import { badRequest, internalServerError } from '../helpers/http'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../error/invalid-param-error'
import { ServerError } from '../error/server-error'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      return {
        statusCode: 200
      }
    } catch (error) {
      return internalServerError(new ServerError())
    }
  }
}
