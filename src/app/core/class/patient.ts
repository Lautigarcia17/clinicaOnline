import { User } from "./user";

export class Patient extends User{
    private socialSecurity : string;


    constructor(name : string, surname:string, age:number, dni: number, socialSecurity:string, email:string, password:string, img:Array<string>){
        super(name,surname,age,dni,email,password,img);
        this.profile = "paciente";
        this.socialSecurity = socialSecurity;
    }

    get SocialSecurity() : string{
        return this.socialSecurity;
    }



}
