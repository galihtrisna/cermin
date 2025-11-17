export type LoginData = {
  email: string;
  password: string;
};

export type Users = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  roleId: string;
};

export type Role = {
  role: string;
};