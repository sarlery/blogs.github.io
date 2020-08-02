function decorator(target){
    console.log(target);
}

@decorator
class Person{
    age = 18;
    constructor(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }
}

var p = new Person('Li');