/* eslint-disable @typescript-eslint/unbound-method */
import { sign } from 'jsonwebtoken';
import { AuthService } from '../src/auth/auth.service';
import { User } from '../src/user/user.model';
import { userService } from '../src/user/user.service';
import { userToRegisterResponseDto } from '../src/auth/converter';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { compare } from 'bcrypt';

process.env.JWT_SECRET = 'SECRET';
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../src/auth/converter');
jest.mock('../src/user/user.service', () => ({
  userService: {
    create: jest.fn(),
  },
}));

const compareMock = compare as jest.Mock;
const signMock = sign as jest.Mock;
const createUserMock = userService.create as jest.Mock;
const userToRegisterResponseDtoMock = userToRegisterResponseDto as jest.Mock;

console.log(compareMock);
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  describe('generateAuthToken', () => {
    it('should generate jwt token', () => {
      const userMock = { id: 1, email: 'testemail@gmail.com' } as User;
      const mockedToken = 'sometoken';

      signMock.mockReturnValueOnce(mockedToken);

      const result = service.generateAuthToken(userMock);

      expect(signMock).toBeCalledWith(
        { id: 1, email: 'testemail@gmail.com' },
        'SECRET',
        { expiresIn: '1h' }
      );
      expect(signMock).toBeCalledTimes(1);
      expect(result).toEqual(mockedToken);
    });
  });

  describe('register', () => {
    it('should register user', async () => {
      const mockedGenerateAuthToken = jest
        .spyOn(service, 'generateAuthToken')
        .mockImplementationOnce(() => 'some token');
      const createUserDtoMock = {} as CreateUserDto;
      const newUserMock = {} as User;
      const registerUserResponseDtoMock = {};

      userToRegisterResponseDtoMock.mockReturnValueOnce(
        registerUserResponseDtoMock
      );
      createUserMock.mockResolvedValueOnce(newUserMock);

      const result = await service.register(createUserDtoMock);

      expect(createUserMock).toBeCalledWith(createUserDtoMock);
      expect(createUserMock).toBeCalledTimes(1);
      expect(mockedGenerateAuthToken).toBeCalledWith(newUserMock);
      expect(mockedGenerateAuthToken).toBeCalledTimes(1);
      expect(userToRegisterResponseDtoMock).toBeCalledWith({
        user: newUserMock,
        token: 'some token',
      });
      expect(userToRegisterResponseDtoMock).toBeCalledTimes(1);

      expect(result).toEqual(registerUserResponseDtoMock);
    });
  });

  describe('comparePasswords', () => {
    it('should compare passwords', async () => {
      const providedPasswordMock = 'password';
      const storedPasswordMock = 'password';
      const isBoolean = true;

      compareMock.mockResolvedValueOnce(isBoolean);

      const result = await service.comparePasswords(
        providedPasswordMock,
        storedPasswordMock
      );

      expect(compareMock).toBeCalledWith(
        providedPasswordMock,
        storedPasswordMock
      );
      expect(compareMock).toBeCalledTimes(1);
      expect(result).toEqual(isBoolean);
    });
  });
});
