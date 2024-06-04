import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideToastr({positionClass : 'toast-bottom-right'}),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'clinicaonline-de6c8',
        appId: '1:427215162068:web:7f52c426a2a06f281ac941',
        storageBucket: 'clinicaonline-de6c8.appspot.com',
        apiKey: 'AIzaSyCvGFlH7F0AVS2WRmztVXhYC5Omb3IEQRo',
        authDomain: 'clinicaonline-de6c8.firebaseapp.com',
        messagingSenderId: '427215162068',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAnimationsAsync()
  ],
};
