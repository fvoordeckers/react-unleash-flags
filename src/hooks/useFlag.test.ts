import useFlag from './useFlag';

it('return the initial value undefined', () => {
    const flag = useFlag('test');

    expect(flag).toBeUndefined();
});
