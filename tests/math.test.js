const { fahrenheitToCelsius ,celsiusToFahrenheit, add } = require('../src/math');

test('Fahrenheit to celsius', () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
})

test('Celsius to fahrenheit', () =>{
    expect(celsiusToFahrenheit(0)).toBe(32);
})

test('Testing async code', async(done) => {
    const sum = await add(1,2);
    expect(sum).toBe(5);
    done();
})
