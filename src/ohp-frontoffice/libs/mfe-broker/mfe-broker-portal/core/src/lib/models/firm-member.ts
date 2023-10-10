import { Assistant } from './assistant';

export interface FirmMember {
  id: number;
  firstName: string;
  lastName: string;
  FCAnumber: number;
  position: string;
  lastSeen: string;
  status: string;
  avatar: string;
  tradingDetails: {
    name: string;
    address: string;
  };
  contactDetails: {
    email: string;
    phone: string;
  };
  assistants: Assistant[];
}
