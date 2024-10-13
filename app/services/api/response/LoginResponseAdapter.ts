import { LoginResult } from '../../models'
import { LoginResponseDTO } from '../dtos'

export class LoginResponseAdapter {
  service(dto: LoginResponseDTO): LoginResult {
    return {
      token: dto.token,
    }
  }
}
