import { Opening } from './components/Opening';
import { BRAND } from './constants';
import Game from './scenes/Game';

function App() {
  return (
    <div className="app">
      <Game />
      <Opening brand={BRAND} />
    </div>
  );
}

export default App;
