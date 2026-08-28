import type Comment from './Comment';

export default interface Attachment {
  id: number;
  nomeArquivo: string;
  url: string;
  comment?: Comment | null;
}