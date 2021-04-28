# Infinite Minesweeper

Infinite Minesweeper is a web-based minesweeper game that has literally infinite mine field.

Unlike other minesweeper games, it limits time while you can extend space infinitely by dragging field. Touching mine is not a game-over condition, it just decreases given time.

## Development Story

Technically, this project has some proof of concept in mind:

> Good fusion of OOP(Object Oriented Paradigm) and FP(Functional Paradigm) ideas.

I wished every states used in this project to minimize side effects and utilize OOP features so that I can make well-structured, concentrated state objects.

You can see, every state objects, e.g. FieldState, assign its internal variables only once at the constructor. It's like the pure functions only accept its inputs from parameters.

With that class concept, I intended to adapt OOP's structuring power. Methods in a state class are related exactly with that state. No need for nested functions to mimic capsulation, just take advantage of language's natural features.

Every states are set only at `Game` component. Since states are immutable, it was easy to apply states on React components. A state change yields new state, and just `setState`!

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
