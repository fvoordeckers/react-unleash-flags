import { renderHook } from '@testing-library/react-hooks';
import useFlag from './useFlag';

describe('useFlag', () => {
  it('returns the initial value undefined', () => {
    const {
      result: { current },
    } = renderHook(() => useFlag('test'));

    expect(current).toBeUndefined();
  });
});
