console.log("Notes file loaded..")

const age = 24;
const name = 'rounak';

const greet = () =>{
    console.log(`Hello ${name} - ${age}`);
}

module.exports = {
    age,
    name,
    greet
}