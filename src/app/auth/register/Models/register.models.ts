import { UserRole } from "../../../Core/models";

export interface addStaffRequestDto{
    username: string;
    email: string;
    password: string;
    fullName: string;
    branchId:string;
    role: UserRole;
}