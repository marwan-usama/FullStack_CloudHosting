export interface CreateArticleDto {
  title: string;
  description: string;
}

export interface UpdateArticleDto {
  title?: string;
  description?: string;
}

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
}
