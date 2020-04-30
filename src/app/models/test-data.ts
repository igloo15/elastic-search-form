import * as Faker from 'faker';

export interface MyGradeData {
    class: string;
    score: number;
}


export interface MyBasicData {
    name: string;
    age: number;
    grades: MyGradeData[];
    friends: string[];
}

export class DataGenerator {
    constructor() {}

    createGradeData(): MyGradeData {
        return {
            class: Faker.name.jobArea(),
            score: Faker.random.number(100)
        };
    }

    createBasicData(): MyBasicData {
        const tempData = {
            name: this.createName(),
            age: Faker.random.number(50),
            grades: [],
            friends: []
        };

        const gradeCount = Faker.random.number(20);
        const friendCount = Faker.random.number(10);
        for(let i = 0; i < gradeCount; i++) {
            tempData.grades.push(this.createGradeData());
        }

        for(let j = 0; j < friendCount; j++) {
            tempData.friends.push(this.createName());
        }

        return tempData;
    }

    createName(): string {
        return Faker.name.firstName() + ' ' + Faker.name.lastName();
    }

    createRandomNumber(): number {
        return Faker.random.number(100);
    }
}