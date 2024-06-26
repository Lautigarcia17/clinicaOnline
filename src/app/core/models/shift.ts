export interface Shift {
    id : string,
    date : Date,
    diagnosis : {
        comment : string,
        height : string,
        pressure: string,
        principalDiagnosis: string,
        temperature: string,
        weight: string,
        additionalData: {[key : string] : string}
    },
    emailPatient: string,
    emailSpecialist: string,
    patient: string,
    qualification: string,
    review: string,
    specialist: string,
    specialty: string,
    stateShift: string,
    survey: {
        comment: string,
        experience: string,
        hygiene: string
    }
}
