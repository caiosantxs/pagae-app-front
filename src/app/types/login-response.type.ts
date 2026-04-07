export type LoginResponse = {
  token: string;
  name: string;
  id: number;
};

export type ResetPasswordDTO = {
  token: string;
  newPassword: string;
}

export type ForgotPasswordDTO = {
  email: string;
}