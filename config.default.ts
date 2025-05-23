interface IConfig {
  rds: {
    credentials: {
      username: string;
      password: string;
    };
    port: number;
  }
}

export const config: IConfig = {
  rds: {
    credentials: {
      username: 'admin',
      password: 'admin',
    },
    port: 5432,
  },
};