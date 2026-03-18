export type Article = {
    id:number;
    userId:number;
    title:string;
    description:string;
}

export type TokenPayload = {
  id: number;
  isAdmin: boolean;
};

