type TAuthParams = {
  email: string;
  password: string;
}

export class AuthsService {
  post = async (data: TAuthParams): Promise<boolean> => {
    const {email, password} = data;
    try {
      const response = await fetch('http://localhost:3000/auth', {
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
}
