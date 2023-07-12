import { Post, Body, Controller, ValidationPipe, UsePipes, Get, UseGuards, Session, UnauthorizedException, NotFoundException, Param, RequestTimeoutException, Patch } from "@nestjs/common"
import { ForgetPassword, Login } from "src/models/login/login.dto"
import { LoginService } from "src/models/login/login.service"
import { SessionLoginGuard } from "./sessionLogin.gaurd"
import { AuthService } from "./auth.service";
import { TokenService } from "src/models/token/token.service";
import { TokenEntity } from "src/models/token/token.entity";
import { LoginEntity } from "src/models/login/login.entity";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) { }
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() data: Login, @Session() session): Promise<any> {
    const user = await this.loginService.getUserLoginInfoById(data.id)
    if (user != null) {
      const res = await this.loginService.login(data.password, user.password)
      if (res) {
        session.user = user
        return true
      }
      return new NotFoundException({ message: "User Id or Password didnot match" })
    }
    return new UnauthorizedException({ message: "User not found" })
  }

  @Patch('forgetpassword/:id')
  async forgetPassword(@Param('id') id: string): Promise<string> {
    const data = await this.loginService.getUserLoginInfoById(id)
    if (data != null) {
      const newToken = new TokenEntity()
      newToken.token = await this.tokenService.generateRandomNumber()
      newToken.startTime = new Date()
      newToken.endTime = new Date(newToken.startTime.getTime() + 10 * 60000)
      newToken.login = data
      const res = await this.tokenService.getTokenByLoginId(id)
      if (res != null) {
        await this.tokenService.updateToken(res.id, newToken)
      }
      else {
        await this.tokenService.addToken(newToken)
      }
      await this.authService.sendForgetPasswordMail(newToken)
      return await this.tokenService.generateMaskedMail(data.email)
    }
    else {
      throw new NotFoundException({ message: "User not found" })
    }
  }
  @Post('checkforgetpasswordcode/:id')
  @UsePipes(new ValidationPipe())
  async checkForgetPasswordCode(@Body() data: ForgetPassword, @Param('id') id: string): Promise<any> {
    const res = await this.tokenService.getTokenByLoginId(id)
    if (res != null) {
      const now = new Date()
      if (res.endTime > now) {
        if (res.token === data.token) {
          const newData = new LoginEntity()
          const newPass = await this.loginService.getHassedPassword(data.password)
          newData.password = newPass
          const newLogin = await this.loginService.updateUserLoginInfo(id, newData)
          const delRes = await this.tokenService.deleteToken(res.id)
          if (newLogin != null && delRes['affected'] > 0) {
            return {
              message: "Password changed successfully",
              url: "http://localhost:3000/auth/login"
            }
          }
        }
        else {
          throw new UnauthorizedException({ message: "Recovery data not appropiate" })
        }
      }
      else {
        throw new RequestTimeoutException({ message: "Session time-out, please try again" })
      }
    }
    else {
      throw new NotFoundException({ message: "Proper data not found" })
    }
  }

  @Get('logout')
  @UseGuards(SessionLoginGuard)
  logout(@Session() session): boolean {
    console.log(session.user)
    if (session.user != null) {
      session.destroy()
      return true
    }
  }
  // @Get('generatepdf')
  // generatePDF():any{
  //   const text="Product\t\tSales\t\tUnits Sold\t\t% of Total Sales\t\tChange from Previous Month"
  //   this.authService.generatePDF(text)
  // }
}