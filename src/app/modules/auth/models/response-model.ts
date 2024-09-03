import { LoginResponse } from "./login-response.model";

export interface Response{
    data?: LoginResponse;
    isSuccess: boolean;
    message: string;
}