import { useAppSelector } from "../redux/hooks";
import { jwtDecode } from "jwt-decode";
export interface JwtPayload {
  exp: number;
}

export const useTokenExpired = (): boolean => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  if (accessToken) {
    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.log("Invalid access token:", error);
      return true;
    }
  }
  return true;
};
