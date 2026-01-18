export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  branchId: string;
  branchName: string;
  employeeId: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  roles: string[];
}