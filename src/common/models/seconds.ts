import type { InferModelOutput } from '@uni-ts/model/safe';
import { ms, type StringValue } from 'ms';
import { z } from 'zod';
import { createModel } from '../utils/models';

export type Seconds = InferModelOutput<typeof Seconds>;
export const Seconds = createModel(z.number().int().brand('Seconds'), {
  fromString,
});

function fromString(value: StringValue): Seconds {
  return Seconds.cast(Math.round(ms(value) / 1000));
}
