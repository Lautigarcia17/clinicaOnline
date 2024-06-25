import { Injectable } from '@angular/core';
import { DocumentData, Firestore, QuerySnapshot, addDoc, arrayUnion, collection, collectionData, doc, docData, getDocs,orderBy,query,updateDoc,where } from '@angular/fire/firestore';
import { Patient } from '../class/patient';
import { Specialist } from '../class/specialist';
import { Administrator } from '../class/administrator';
import { ref, uploadBytes,Storage, getDownloadURL } from '@angular/fire/storage';
import { Observable, map, take } from 'rxjs';
import { Shift } from '../models/shift';
import { Specialty } from '../models/specialty';

;

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(public firestore: Firestore,private storage : Storage) { }

  savePatientDatabase(user : Patient) : void{
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

  saveSpecialistDatabase(user : Specialist) : void{
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
        workDays: [],
        workHour : {
          start : '',
          end : ''
        },
        shifts: []
      });
    }catch (error) {
      console.error("Error adding document: ", error);
    }
  }


  saveAdministratorDatabase(user : Administrator) : void{
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


  
  getDni() : Observable<number[]> {
      const data = query(collection(this.firestore,'users'));
      return collectionData<any>(data).pipe(
        map(users => users.map((user: any) => user.dni))
      );
  }

  async uploadImage(file : any, path : string) : Promise<string>{
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

  addSpecialty(specialty : string) : void{
    try{
      addDoc(collection(this.firestore,"specialty"),{
        name: specialty,
        img : 'https://firebasestorage.googleapis.com/v0/b/clinicaonline-de6c8.appspot.com/o/images%2Fspecialtys%2Fdoctor.jpg?alt=media&token=72c4f933-1b4f-4867-8d63-367baf408ca2'
      });
    }catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  getSpecialty() : Observable<Specialty[]>{
    return collectionData(collection(this.firestore,'specialty')) as Observable<Specialty[]>
  }

  updateVerificationByAdmin(dni: number, state: boolean) : void{
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

  getUsersDatabase(): Observable<any[]> {
    return collectionData(collection(this.firestore, 'users'), { idField: 'id' })
      .pipe(
        map((users: any[]) => 
          users.map(user => {
            if (user.workHour) {
              if (user.workHour.start !== ''){
                user.workHour.start = user.workHour.start.toDate(); 
              }
              if (user.workHour.end !== '') {
                user.workHour.end = user.workHour.end.toDate(); 
              }
            }
            return user;
          })
        )
      );
  }

  getUser(email : string) : Observable<any>{
    const data = query(collection(this.firestore,'users'),where("email", "==", email));
    return collectionData<any>(data,{idField: 'id'}).pipe(take(1));  
  }




  updateWorkDays(email: string, days: Array<string>) : void{

    try {
      getDocs(query(collection(this.firestore, 'users'), where("email", "==", email)))
      .then((querySnapshot: QuerySnapshot<DocumentData>) => {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, { workDays: days });
        });
      })

    } catch (error) {
      console.error("Error updating user verification by admin: ", error);
    }
  }

  
  updateWorkHour(email: string, start : Date, end : Date) : void{

    try {
      getDocs(query(collection(this.firestore, 'users'), where("email", "==", email)))
      .then((querySnapshot: QuerySnapshot<DocumentData>) => {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, { workHour: { start : start, end:end} });
        });
      })

    } catch (error) {
      console.error("Error updating user verification by admin: ", error);
    }
  }

  // SHIFTS 
  getShifts() : Observable<Shift[]> {
    const data = query(collection(this.firestore, 'shifts'), orderBy('date','asc'));
    return collectionData<any>(data, {idField: 'id'})
    .pipe(map( (shifts : Shift[]) => {
        return shifts.map( (shift : any) => ({
          ...shift,
          id : shift.id,
          date: shift.date.toDate() 
        }));
      })
    ) as Observable<Shift[]>
  }

  saveShiftDatabase(data : any) : void{
    try{
      addDoc(collection(this.firestore,"shifts"),{
        patient: data.patient,
        emailPatient: data.emailPatient,
        specialist : data.specialist,
        emailSpecialist: data.emailSpecialist,
        specialty: data.specialty,
        date : data.date,
        review: "",
        stateShift: "pendiente",
        survey : {
          experience : '',
          hygiene : '',
          comment : ''
        },
        qualification : '',
        diagnosis : {
          principalDiagnosis : '',
          comment : '',
          height : '',
          weight : '',
          temperature : '',
          pressure : '',
          additionalData : {},
        },

      });
    }catch (error) {
      console.error("Error adding document: ", error);
    }
  }


  saveShiftInSpecialist(email: string, date : Date) : void{
    try {
      getDocs(query(collection(this.firestore, 'users'), where("email", "==", email)))
      .then((querySnapshot: QuerySnapshot<DocumentData>) => {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, { shifts: arrayUnion(date) });
        });
      })

    } catch (error) {
      console.error("Error updating user verification by admin: ", error);
    }
  }

  removeShiftInSpecialist(email: string, date : Date) : void{
    try {
      getDocs(query(collection(this.firestore, 'users'), where("email", "==", email)))
      .then((querySnapshot: QuerySnapshot<DocumentData>) => {
        querySnapshot.forEach((doc : any) => {
          querySnapshot.forEach((doc : any) => {
            const shifts = doc.data().shifts;   
            const updatedShifts = shifts.filter((shiftDate: any) => shiftDate.toDate().getTime() !== date.getTime());
            updateDoc(doc.ref, { shifts: updatedShifts });
          });
        });
      })

    } catch (error) {
      console.error("Error updating user verification by admin: ", error);
    }
  }

  updateStateShift(id : string, newState : string) : void{
    try {
      const docRef = doc(this.firestore, 'shifts', id);
      updateDoc(docRef, { stateShift: newState });
      
      console.log('StateShift updated successfully');
    } catch (error) {
      console.error('Error updating state of shift: ', error);
    }
  }

  saveReviewShift(id : string, review : string) : void{
    try {
      const docRef = doc(this.firestore, 'shifts', id);
      updateDoc(docRef, { review: review });
      
      console.log('Review saved successfully');
    } catch (error) {
      console.error('Error save review: ', error);
    }
  }

  saveSurvey(id : string, experience : string, hygiene : string, comment : string) : void{
    try {
      const docRef = doc(this.firestore, 'shifts', id);
      updateDoc(docRef, { survey: {experience : experience, hygiene : hygiene, comment : comment } });
      
      console.log('survey saved successfully');
    } catch (error) {
      console.error('Error updating survey ', error);
    }
  }

  saveQualification(id : string, qualification : string) : void{
    try {
      const docRef = doc(this.firestore, 'shifts', id);
      updateDoc(docRef, { qualification:  qualification});
      console.log('qualification save successfully');
    } catch (error) {
      console.error('Error save qualification ', error);
    }
  

  }

  saveDiagnosis(id : string, principalDiagnosis : string, comment : string, height : number, weight : number, temperature : number, pressure : number,additionalData : { [key: string]: string }) : void{
    
    try{
      const docRef = doc(this.firestore, 'shifts',id)
      updateDoc(docRef,{ diagnosis: {principalDiagnosis : principalDiagnosis, comment : comment, 
        height : height, weight : weight , temperature : temperature, pressure : pressure, additionalData : additionalData} })
    }
    catch (error) {
      console.error('Error updating state of shift: ', error);
    }
  
  }
  // -/


}
