export interface LoginResponse{
    userId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    email: string;
    token: string;
    roles: string[];
}