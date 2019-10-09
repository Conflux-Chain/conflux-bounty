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
export function isMobile() {
  return window.screen.width <= 600;
}

export default function unitParser(unit) {
  let myUnit = unit;
  const type = undefined === myUnit ? 'undefined' : getType(myUnit);
  if (type === 'number') {
    myUnit += 'dp';
  }
  const regExp = /^([\d.]+)(px|dp)?$/g;
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
        myCount = (myCount / 375) * window.screen.width;
    }

    if (!allowMiniPixel() && myCount < 1) {
      myCount = 1;
    }
    return `${myCount}px`;
  });
}
