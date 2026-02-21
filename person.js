class Person {
    constructor(name){
        this.name = name;
    }
    sayMyName(){
        return `Meu nom é ${this.name}`
    }
}

module.exports = {
    Person
};