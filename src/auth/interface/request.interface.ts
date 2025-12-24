import { User } from 'src/users/entities/user.entity';

export interface IRequest {
  params?: any;
  url?: string;
  method?: string;
  query?: string;
  headers?: any;
  user: User;
  route?: {
    path?: string;
  };
}
