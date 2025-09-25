import type { InferModelOutput } from '@uni-ts/model/safe';
import z from 'zod';
import { createModel } from '@/common/utils/models';

export type Password = InferModelOutput<typeof Password>;
export const Password = createModel(z.string().min(8).brand('Password'));
