import type { InferModelOutput } from '@uni-ts/model/safe';
import { ms, type StringValue } from 'ms';
import { z } from 'zod';
import { createModel } from '../utils/models';

export type Milliseconds = InferModelOutput<typeof Milliseconds>;
export const Milliseconds = createModel(z.number().int().brand('Milliseconds'), {
  fromString,
});

function fromString(value: StringValue): Milliseconds {
  return Milliseconds.cast(ms(value));
}
