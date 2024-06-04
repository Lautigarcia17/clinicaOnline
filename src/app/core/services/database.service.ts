import { Injectable } from '@angular/core';
import { DocumentData, Firestore, QuerySnapshot, addDoc, collection, collectionData, getDocs,query,updateDoc,where } from '@angular/fire/firestore';
import { Patient } from '../class/patient';
import { Specialist } from '../class/specialist';
import { Administrator } from '../class/administrator';
import { ref, uploadBytes,Storage, getDownloadURL } from '@angular/fire/storage';

;

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(public firestore: Firestore,private storage : Storage) { }

  getUserDatabase(email : string) : Promise<any>  
  {
    return new Promise<string>( (resolve,reject) =>{
      let user : any = "";

      getDocs(collection(this.firestore,'users'))
      .then((querySnapshot: QuerySnapshot<DocumentData>) => {
        querySnapshot.forEach( (document) => {
          if (email == document.data()['email']){
            user = document.data();
            resolve(user);
          }
        })
        resolve(user);
      })
      .catch( (error) => {
        console.log("Error getting documents: ",error);
        reject(error);
      })
    } )
  }

  savePatientDatabase(user : Patient){
    try{
      addDoc(collection(this.firestore,"users"),{
        name: user.Name,
        surname: user.Surname,
        profile : user.Profile,
        age: user.Age,
        dni: user.Dni,
        socialSecurity: user.SocialSecurity,
        email: user.Email,
        password: user.Password,
        img: user.Img,
      });
    }catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  saveSpecialistDatabase(user : Specialist){
    try{
      addDoc(collection(this.firestore,"users"),{
        name: user.Name,
        surname: user.Surname,
        profile : user.Profile,
        age: user.Age,
        dni: user.Dni,
        specialty: user.Specialty,
        email: user.Email,
        password: user.Password,
        adminVerified: false,
        img: user.Img,
      });
    }catch (error) {
      console.error("Error adding document: ", error);
    }
  }


  saveAdministratorDatabase(user : Administrator){
    try{
      addDoc(collection(this.firestore,"users"),{
        name: user.Name,
        surname: user.Surname,
        profile : user.Profile,
        age: user.Age,
        dni: user.Dni,
        email: user.Email,
        password: user.Password,
        img: user.Img
      });
    }catch (error) {
      console.error("Error adding document: ", error);
    }
  }


  getDni() 
  {
      let dni : any = [];
      getDocs(collection(this.firestore,'users'))
      .then((querySnapshot: QuerySnapshot<DocumentData>) => {
        querySnapshot.forEach( (document) => {
          dni.push(parseInt(document.data()['dni']))
        })
      })
      return dni;
  }

  async uploadImage(file : any, path : string){
    const imgRef = ref(this.storage, 'images/' + path);

    try {
      await uploadBytes(imgRef, file);
      const downloadURL = await getDownloadURL(imgRef);
      return downloadURL;
    } catch (error) {
      console.log(error);
      throw error; 
    }
  }

  addSpecialty(specialty : string){
    try{
      addDoc(collection(this.firestore,"specialty"),{
        name: specialty,
      });
    }catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  getSpecialty(){
    return collectionData(collection(this.firestore,'specialty'));
  }

  updateVerificationByAdmin(dni: number, state: boolean) {
    try {
      getDocs(query(collection(this.firestore, 'users'), where("dni", "==", dni)))
      .then((querySnapshot: QuerySnapshot<DocumentData>) => {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, { adminVerified: state });
        });
      })

    } catch (error) {
      console.error("Error updating user verification by admin: ", error);
    }
  }

  getUsersDatabase() {
    return collectionData(collection(this.firestore,'users'));
  }


}
