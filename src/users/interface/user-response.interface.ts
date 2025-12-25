export interface CreateUserInterface {
  data: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  message: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'tourist' | 'employee';
  createdAt: string;
  updatedAt: string;
}

export interface UserDetail {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'tourist' | 'employee';
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  trips: UserTrip[];
}

export interface UserTrip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}
