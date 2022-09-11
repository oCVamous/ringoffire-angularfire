import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Firestore, collectionData, collection, setDoc, doc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;
  games$: Observable<any[]> | undefined;
  games : Array<any> | undefined;
  coll: any;

  // private firestore: getFirestore,
  constructor(private firestore: Firestore, public dialog: MatDialog, private route: ActivatedRoute) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent); 

    dialogRef.afterClosed().subscribe((name : string ) => {
      if(name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    // this.newGame()
    this.route.params.subscribe(async (params) => {
      console.log(params['id']);

      const coll = collection(this.firestore, 'games');
      let gameInformation = await addDoc(coll, { game: this.game.toJSON() });
      console.log(gameInformation);
    });

    

  }

  async newGame() {
    this.game = new Game();
    console.log(this.game)
    
    // const coll = collection(this.firestore, 'games');
    // let gameInformation = await addDoc(coll, { game: this.game.toJSON() });
    // console.log(gameInformation);
    
  }

  takeCard() {
    if(!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      console.log(this.currentCard)
      this.pickCardAnimation = true;
      
      console.log('New Card ',this.currentCard);
      console.log('Game is ',this.game);
      
      //Nächster Spieler
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(()=>{
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
        }, 1000);
  }

  
  
    
  

}



}