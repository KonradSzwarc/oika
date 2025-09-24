import type { InferModelOutput } from '@uni-ts/model/safe';
import z from 'zod';
import { createModel } from '../utils/models';

export type Email = InferModelOutput<typeof Email>;
export const Email = createModel(z.email().trim().toLowerCase().brand('Email'));
