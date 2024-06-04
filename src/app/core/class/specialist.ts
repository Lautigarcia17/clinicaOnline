import { User } from "./user";

export class Specialist extends User{
    private specialty : string;

    constructor(name : string, surname:string, age:number, dni: number, specialty:string, email:string, password:string, img:string = ""){
        super(name,surname,age,dni,email,password,img);
        this.profile = "specialist";
        this.specialty = specialty;
    }

    get Specialty() : string{
        return this.specialty;
    }



}
