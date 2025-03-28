import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Player } from '../services/player';
import { Players } from '../services/mockup-players';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; 
import { PentagonComponent } from '../pentagon/pentagon.component';
import { PlayerMediaComponent } from '../player-media/player-media.component';
import { PlayerService } from '../services/playerService';


@Component({
  selector: 'app-player-detail',
  standalone: true,  // Marcamos como standalone
  imports: [CommonModule, PentagonComponent, PlayerDetailComponent, PlayerMediaComponent],  // Importamos CommonModule para usar directivas como *ngIf
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css'],
})
export class PlayerDetailComponent implements OnInit, OnDestroy {
  
  
  private routeSub: Subscription = new Subscription(); // Para manejar la suscripción
  @Input() player?: Player; 
  activeIndex=0; // Asegúrate de que player tenga el tipo adecuado
  selectedPlayerId!:number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private playerService: PlayerService 
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedPlayerId = Number(params.get('id'));
      this.loadPlayer();
    });
  }
  loadPlayer(): void {
    if (this.selectedPlayerId) {
      this.player = this.playerService.getPlayerDetails(this.selectedPlayerId);
    }
  }
  ngOnDestroy(): void {
    // Limpiar la suscripción cuando el componente se destruya
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  getPlayerDetails(playerId: number): void {
    if (playerId === 0) return;

    // Buscamos al jugador en el mockup usando el ID
    this.player = Players.find(player => player.id === playerId);
    if (this.player) {
      console.log('Jugador encontrado:', this.player);
    } else {
      console.log('Jugador no encontrado');
    }
  }

  goBack(): void {
    this.location.back();  // Volver a la página anterior
  }

  getMedia(): void {
    if (this.player) {
      this.router.navigate(['/player', this.player.id, 'media']); // Navegar a los detalles del jugador
    }
  }
  setActiveImage(index: number): void {
    this.activeIndex = index;
  }

  setActiveVideo(index: number): void {
    this.activeIndex = index;
  }
}
