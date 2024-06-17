import { AbstractControl } from "@angular/forms";

export class User {

    protected name : string;
    protected surname : string;
    protected profile! : string;
    protected age : number;
    protected dni : number;
    protected email : string;
    protected password : string;
    protected img : Array<string> | string ;

    constructor(name : string, surname:string, age:number, dni: number, email:string, password:string, img: Array<string> | string ){
        this.name = name;
        this.surname = surname;
        this.age =age;
        this.dni = dni;
        this.email = email;
        this.password = password;
        this.img = img;
    }
//#region Getters
    get Name() : string{
        return this.name;
    }

    get Surname() : string{
        return this.surname;
    }

    get Profile() : string{
        return this.profile;
    }

    get Age() : number{
        return this.age;
    }
    get Dni() : number{
        return this.dni;
    }
    get Email() : string{
        return this.email;
    }

    get Password() : string{
        return this.password;
    }

    get Img() : Array<string> | string{
        return this.img;
    }
//#endregion


    static isDniAvailable(dni : number, dniCharged : number[]) : boolean{
        let available = true;

        for (let item of dniCharged) {
            if (item == dni) {
                available = false;
            }
        }
        return available
    }

    static validateDni( control: AbstractControl, dniCharged : number[]) : null | object{
        const data = (control.value);
        if(data  && data.toString().length == 8){
            let available = this.isDniAvailable(data,dniCharged)
            if ((isNaN(data)) || available == true) {
                return null; 
            } else {
                return { dniAvailable: true }; 
            }
        }
        else{
            return null;
        }
    }

    static ageMinMax( control: AbstractControl) : null | object{
        const data = parseInt(control.value);
        
        if ((isNaN(data)) || (data >= 18 && data <= 99)) {
            return null; 
        } else {
            return { ageMinMax: true }; 
        }
    }



}
