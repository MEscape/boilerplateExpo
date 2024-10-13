import type { LoginParams, LoginResult } from '../models'
import { API_METHODS } from './apiMethods.type'
import { LoginResponseDTO } from './dtos'
import { END_POINTS } from './endPonts.type'
import { LoginResponseAdapter } from './response'
import serviceAdapter from './serviceAdapter'

export class AppServices {
  loginUser = async (loginParams: LoginParams): Promise<LoginResult> => {
    return new Promise((resolve, reject) => {
      serviceAdapter<LoginResponseDTO, LoginParams>(API_METHODS.POST, END_POINTS.LOGIN, loginParams)
        .then(res => {
          resolve(new LoginResponseAdapter().service(res))
        })
        .catch(reject)
    })
  }
}

export const appServices = new AppServices()
