const fahrenheitToCelsius = (temp) => (temp -32) /1.8;
const celsiusToFahrenheit = (temp) => (temp * 1.8) + 32;

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(a < 0 || b < 0) {
                return reject('Numbers must be non-negative');
            }
            resolve(a+b);
        }, 2000);
    })
}

const fun = async(num1, num2) => {
    try{
        const ret = await add(num1, num2);
        console.log(ret);
    }
    catch(e) {
        console.log(e);
    }
}
fun(-1,3);
module.exports = {
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
}