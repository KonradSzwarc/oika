import type { InferModelOutput } from '@uni-ts/model/safe';
import z from 'zod';
import { createModel } from '../utils/models';

export type Uuid = InferModelOutput<typeof Uuid>;
export const Uuid = createModel(z.uuid().brand('Uuid'));
