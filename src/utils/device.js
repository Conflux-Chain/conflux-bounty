import { useMedia } from 'react-use';
import variable from '../globalStyles/variable';

function allowMiniPixel() {
  let allow = false;
  if (window.devicePixelRatio && devicePixelRatio >= 2) {
    const ele = document.createElement('div');
    ele.style.border = '.5px solid transparent';
    document.body.appendChild(ele);
    allow = ele.offsetHeight === 1;
    document.body.removeChild(ele);
  }
  return allow;
}
function getType(unit) {
  return typeof unit;
}

const isMobileQuery = `(orientation: portrait) and (max-width: ${variable.breakpoint.mobile}px)`;
export const isMobile = () => {
  return window.matchMedia(isMobileQuery).matches;
};

export const useMobile = () => {
  return useMedia(isMobileQuery);
};

function getw() {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

export default function unitParser(unit) {
  let myUnit = unit;
  const type = undefined === myUnit ? 'undefined' : getType(myUnit);
  if (type === 'number') {
    myUnit += 'dp';
  }
  const regExp = /^-?([\d.]+)(px|dp)?$/g;
  return myUnit.replace(regExp, (chars, count, suffix) => {
    let myCount = Number(count);
    switch (suffix) {
      case 'px':
        // np不做转换。1np就是1px 100np就是100px
        break;
      case 'dp':
      default:
        // 注意这里375,设计稿是按照375进行设计的。
        // deviceWidth为屏幕的宽度,iphone 5/SE为320 iphone 6/7/8为375
        myCount = (myCount / 375) * getw();
    }

    if (!allowMiniPixel() && myCount < 1) {
      myCount = 1;
    }
    return `${chars.startsWith('-') ? '-' : ''}${myCount}px`;
  });
}
