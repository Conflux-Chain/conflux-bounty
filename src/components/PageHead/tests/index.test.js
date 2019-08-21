import { getAccount } from '../action';

describe('<PageHead />', () => {
  it('getAccount should get user account info', async () => {
    const store = mockStore();
    await store.dispatch(getAccount());
    const actions = store.getActions();
    expect(actions[0].type).toEqual('UPDATE_HEAD');
  });
});
