export default abstract class Entity<T> {
  public props: T;

  constructor(props: T) {
    this.props = {
      ...props,
    };
  }

  equals(other: Entity<T>) {
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}
