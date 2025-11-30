export type LoginData = {
  email: string;
  password: string;
};

export type Users = {
  role: string;
  id?: string;
  name: string;
  email: string;
  password?: string;
  roleId: string;
};

export type RoleData = {
  role: "superadmin" | "admin" | "staff" | null;
};
