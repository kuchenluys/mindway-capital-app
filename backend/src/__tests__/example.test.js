describe('Backend Setup', () => {
  test('should have jest configured', () => {
    expect(true).toBe(true);
  });

  test('should be able to run tests', () => {
    const sum = 1 + 1;
    expect(sum).toBe(2);
  });

  test('should handle basic math', () => {
    expect(5 * 2).toBe(10);
    expect(10 - 3).toBe(7);
    expect(20 / 4).toBe(5);
  });
});

describe('API Configuration', () => {
  test('should have node environment', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  test('should support async operations', async () => {
    const result = await Promise.resolve('success');
    expect(result).toBe('success');
  });
});
