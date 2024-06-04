import { User } from "./user";

export class Administrator extends User {
    constructor(name : string, surname:string, age:number, dni: number, email:string, password:string, img:string){
        super(name,surname,age,dni,email,password,img);
        this.profile = "administrator";
    }
}
