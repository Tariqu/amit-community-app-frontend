export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null; // Only for creation
  fathersName: string;
  mothersName: string;
  origin: string;
  gotr: string;
  occupation: string;
  occupationDetail: string;
  dob: string;
  phone: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  otherDescription: string;
  adminId?: number | null; // From API
  createdAt?: string; // From API
  updatedAt?: string; // From API
  deletedAt?: string | null; // From API
}
