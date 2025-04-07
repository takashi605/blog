import type { LexicalCommand } from 'lexical';
import { createCommand } from 'lexical';
import type { ImagePayload } from './ImageNode';

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND');
