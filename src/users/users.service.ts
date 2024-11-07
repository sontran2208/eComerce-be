import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserSigninDto } from './dto/user-signin.dto';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signup(userSignupDto: UserSignupDto): Promise<User> {
    const userExxists = await this.userRepository.findOneBy({
      email: userSignupDto.email,
    });
    if (userExxists) throw new BadRequestException('User already exists');
    userSignupDto.password = await hash(userSignupDto.password, 10);
    let user = this.userRepository.create(userSignupDto);
    user = await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async signin(userSigninDto: UserSigninDto): Promise<User> {
    const userExxists = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email: userSigninDto.email })
      .getOne();
    if (!userExxists) throw new BadRequestException('User not exists');
    const matchPassword = await compare(
      userSigninDto.password,
      userExxists.password,
    );
    if (!matchPassword) throw new BadRequestException('Password not match');
    delete userExxists.password;
    return userExxists;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id: id });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email: email });
  }

  async accessToken(user: User): Promise<string> {
    return sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }
}
