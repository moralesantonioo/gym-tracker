import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  day = 'Lunes';
  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  exercises = [{ name: '', weight: 0, reps: 0 }];
  currentUid: string = '';

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('ngOnInit ejecutado');

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUid = user.uid;
        console.log('Usuario autenticado:', this.currentUid);
        this.loadWorkout(); // Carga el entrenamiento para el día por defecto (Lunes)
      } else {
        console.log('Usuario no autenticado');
        this.resetForm();
      }
    });
  }

  
  onDayChange() {
    if (this.currentUid) {
      this.loadWorkout(); // Carga el entrenamiento según el día seleccionado
    }
  }

  async loadWorkout() {
    this.resetForm(); // 👈 Siempre limpia antes
  
    const docRef = doc(this.firestore, `users/${this.currentUid}/workouts/${this.day}`);
    const snapshot = await getDoc(docRef);
  
    if (snapshot.exists()) {
      const data: any = snapshot.data();
      this.exercises = data.exercises || [{ name: '', weight: 0, reps: 0 }];
      console.log(`Entrenamiento cargado para ${this.day}:`, data);
    } else {
      console.log(`No hay entrenamiento guardado para ${this.day}`);
    }
  
    this.cd.detectChanges(); // 👈 Siempre actualizar
  }
  

  addExercise() {
    this.exercises.push({ name: '', weight: 0, reps: 0 });
  }

  async saveWorkout() {
    const docRef = doc(this.firestore, `users/${this.currentUid}/workouts/${this.day}`);

    await setDoc(docRef, {
      day: this.day,
      exercises: this.exercises
    });

    alert(`Entrenamiento del día ${this.day} guardado`);
  }

  resetForm() {
    this.exercises = [{ name: '', weight: 0, reps: 0 }];
    this.cd.detectChanges();
  }
}
