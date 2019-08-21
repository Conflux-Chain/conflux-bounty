export const UPDATE_SHARE_MODAL = 'UPDATE_SHARE_MODAL';

export const canvasW = 200;
export const canvasH = 200;

export const update = d => ({
  type: UPDATE_SHARE_MODAL,
  payload: d,
});

export const updateShare = ({ qrTxt, show }) =>
  update({
    show,
    qrTxt,
  });
