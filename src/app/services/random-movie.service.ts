import { Injectable, inject } from '@angular/core';
import { FavoritesService } from './favorites.service';

@Injectable({
  providedIn: 'root'
})
export class RandomMovieService {
  private favoritesService = inject(FavoritesService);

  private readonly popularImdbIds = [
    'tt0468569', // The Dark Knight
    'tt0111161', // The Shawshank Redemption
    'tt1375666', // Inception
    'tt0109830', // Forrest Gump
    'tt0133093', // The Matrix
    'tt0068646', // The Godfather
    'tt0110912', // Pulp Fiction
    'tt0120737', // The Lord of the Rings: The Fellowship of the Ring
    'tt0816692', // Interstellar
    'tt0108052', // Schindler's List
    'tt0080684', // Star Wars: Episode V
    'tt0082971', // Raiders of the Lost Ark
    'tt0099685', // Goodfellas
    'tt0114369', // Se7en
    'tt0118715', // The Big Lebowski
    'tt0120815', // Saving Private Ryan
    'tt0169547', // American Beauty
    'tt0209144', // Memento
    'tt0241527', // Harry Potter and the Sorcerer's Stone
    'tt0361748', // Inglourious Basterds
    'tt0407887', // The Departed
    'tt0892769', // Avatar
    'tt1853728', // Django Unchained
    'tt0482571', // The Prestige
    'tt0332280', // The Notebook
    'tt0120338', // Titanic
    'tt0137523', // Fight Club
    'tt1049413', // Up
    'tt2267998', // Gone Girl
    'tt4154796'  // Avengers: Endgame
  ];

  getRandomId(): string {
    const favorites = this.favoritesService.favorites();
    const favoriteIds = favorites.map(f => f.imdbID);
    
    // Essayer de trouver un film qui n'est pas dans les favoris
    const availableIds = this.popularImdbIds.filter(id => !favoriteIds.includes(id));
    
    // Si tous sont favoris, on pioche dans la liste complète
    const listToUse = availableIds.length > 0 ? availableIds : this.popularImdbIds;
    
    const randomIndex = Math.floor(Math.random() * listToUse.length);
    return listToUse[randomIndex];
  }
}
