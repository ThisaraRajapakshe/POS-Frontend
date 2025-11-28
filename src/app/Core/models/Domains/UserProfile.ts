export interface UserProfile
{
  id: string,
  userName: string,
  email: string,
  fullName: string,
  branchId: string,
  branchName: string,
  employeeId: string,
  isActive: boolean,
  createdAt: Date,
  lastLoginAt: Date,
  roles: string[]
}