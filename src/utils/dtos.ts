export interface CreateArticleDto {
  title: string;
  description: string;
}

export interface UpdateArticleDto {
  title?: string;
  description?: string;
}

export interface UpdateUserDto {
  username?: string;
  password?: string;
}

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
}

export interface RecieveUserDto {
  email: string;
  password: string;
}

export interface DeleteUserDto {
  token:string
}


