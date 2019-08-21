import { CustomDatePipe } from './custom-date.pipe';

describe('CustomDatePipe', () => {
  let value;
  it('create an instance', () => {
    const pipe = new CustomDatePipe(value);
    expect(pipe).toBeTruthy();
  });
});
