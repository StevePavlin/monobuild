import Entity from './entity';

it('should correctly determine equality of entities', () => {
  class Fake extends Entity<any> {
    constructor(props: any) {
      super(props);
    }
  }
  const e1 = new Fake({ some: 'props' });
  const e2 = new Fake({ some: 'props' });
  const e3 = new Fake({ some: 'otherprops' });

  expect(e1).toEqual(e2);
  expect(e1).not.toEqual(e3);
});
