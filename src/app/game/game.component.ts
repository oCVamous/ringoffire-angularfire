import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { AngularFirestore  } from '@angular/fire/compat/firestore';
import {  collection  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { doc, onSnapshot } from "firebase/firestore";



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
  constructor(private firestore: AngularFirestore, public dialog: MatDialog, private route: ActivatedRoute) {
    // const db = collection(this.firestore, 'games')
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent); 

    dialogRef.afterClosed().subscribe((name : string ) => {
      if(name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }

  // async ngOnInit(): Promise<void> {
  //   // this.newGame()
  //   this.route.params.subscribe(async (params) => {
  //     console.log(params['id']);

  //     const coll = doc(params['id']);
  //     let gameInformation = await addDoc(this.coll, { game: this.game.toJSON() });
  //     console.log(gameInformation);

  //     this.game.currentPlayer = this.game.currentPlayer;
  //     this.game.playedCards = this.game.playedCards;
  //     this.game.players = this.game.players;
  //     this.game.stack = this.game.stack;
  //   });


    

  //   // const unsub = onSnapshot(
  //   //   doc(this.coll), 
  //   //   { includeMetadataChanges: true }, 
  //   //   (doc) => {
  //   //     // ...
  //   //   });

    
  // }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params['id']);

      this
        .firestore
        .collection('games')
        .doc(params['id'])
        .valueChanges()
        .subscribe((game: any) => {
          console.log('Game update', game);
          this.game.currentPlayer = game.currentPlayer;
          this.game.playedCards = game.playedCards;
          this.game.players = game.players;
          this.game.stack = game.stack;

        });

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
      this.currentCard = this.game?.stack.pop();
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