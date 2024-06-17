import { User } from "./user";

export class Specialist extends User{
    private specialty : Array<string>;

    constructor(name : string, surname:string, age:number, dni: number, specialty: Array<string>, email:string, password:string, img:string = ""){
        super(name,surname,age,dni,email,password,img);
        this.profile = "especialista";
        this.specialty = specialty;
    }

    get Specialty() : Array<string>{
        return this.specialty;
    }



}
