# Infinite Minesweeper

Infinite Minesweeper is a web-based minesweeper game that has literally infinite mine field.

Unlike other minesweeper games, it limits time while you can extend space infinitely by dragging a screen. Touching mine is not a game-over condition, it just decreases given time.

Technically, this project has some proof of concepts in mind:

* OOP(Object Oriented Paradigm) and FP(Functional Paradigm) are not contradicting.

  You can apply immutability and avoid side effects with OOP, these are not FP-only ideas.

* With well-designed architecture, Redux-like libraries are not necessary.

  IMHO, Redux-like libraries are adding a bloated and complicated layer on project. Take advantage of language's natural features.

  Consider F#, Elem, or Haskell if you fall in love with functions, seriously.

## Project Structure

There are three important layers:

1. game

   It contains main game logic that's completely independent of React. It is also possible to combine with other UI frameworks like Vue without any modification.

2. components

   Components in `components` directory are atoms to organisms in terms of [Atomic Design][atomic_design]. These are independent, standalone components, so you can see individual stories on Storybook.

3. scenes

   Components in `scenes` directory assemble `components` together, and inject game state to them. It's the only place combining game state directly.

## License

Licensed under the [MIT](LICENSE) license.

[atomic_design]: https://atomicdesign.bradfrost.com/chapter-2
