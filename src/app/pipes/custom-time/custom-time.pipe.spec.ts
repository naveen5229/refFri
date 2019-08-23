import { CustomTimePipe } from './custom-time.pipe';

describe('CustomTimePipe', () => {
  let value;
  it('create an instance', () => {
    const pipe = new CustomTimePipe(value);
    expect(pipe).toBeTruthy();
  });
});
