function get(target){
    console.log(target);
}

@get
class Person{
    constructor(name, age, gender){
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    getName(){
        return this.name;
    }
}



