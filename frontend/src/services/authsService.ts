import { BaseService } from "./baseService";

type TAuthParams = {
  email: string;
  password: string;
}

export class AuthsService extends BaseService<TAuthParams>{
  post = async (data: TAuthParams): Promise<boolean> => {
    const {email, password} = data;
    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const res = await response.json();
      if (!res.token) {
        console.error('No token in response');
        return false
      }
      localStorage.setItem('token', res.token);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  
  get = async (): Promise<TAuthParams[]|null> => {
    return null;
  }
  
  prepare(data: Partial<TAuthParams>): TAuthParams|null {
    return null;
  }
}
