import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserResponse {
  @Expose()
  id: string;

  @Expose()
  email: string;
  
  @Expose()
  role: string;
}
