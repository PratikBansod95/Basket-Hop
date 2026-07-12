import type {
  RegisterPlayerRequest,
  RegisterPlayerResponse,
  RenameNicknameRequest,
  RenameNicknameResponse,
} from '../../../shared/contracts/leaderboard';
import { requestJson } from './client';

export function registerPlayer(request: RegisterPlayerRequest): Promise<RegisterPlayerResponse> {
  return requestJson<RegisterPlayerResponse>('/api/players/register', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function renamePlayer(request: RenameNicknameRequest): Promise<RenameNicknameResponse> {
  return requestJson<RenameNicknameResponse>('/api/players/nickname', {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
}
