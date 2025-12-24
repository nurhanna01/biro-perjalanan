import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Logger } from '@nestjs/common';

export async function seedUsers(dataSource: DataSource) {
  const repo = dataSource.getRepository(User);

  const users: Partial<User>[] = [
    {
      name: 'Nur Hanna',
      email: 'pegawai@example.com',
      password: await bcrypt.hash('123456', 10),
      role: UserRole.EMPLOYEE,
    },
    {
      name: 'Tourist User',
      email: 'tourist@example.com',
      password: await bcrypt.hash('123456', 10),
      role: UserRole.TOURIST,
    },
  ];

  await repo.save(users);
  Logger.log('Seeded Users');
}
