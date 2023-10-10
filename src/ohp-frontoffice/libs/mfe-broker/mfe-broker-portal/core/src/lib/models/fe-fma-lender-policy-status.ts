export interface FeFmaLenderPolicyStatus {
  type: 'accepted' | 'declined' | 'referred' | 'waiting';
  reasons?: string[];
}
