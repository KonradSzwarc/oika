import type { InferModelOutput } from '@uni-ts/model/safe';
import z from 'zod';
import { createModel } from '../utils/models';

export type Url = InferModelOutput<typeof Url>;
export const Url = createModel(z.url().trim().brand('Url'));
