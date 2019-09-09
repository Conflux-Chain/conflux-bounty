import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Slider from 'react-slick';
import { withRouter } from 'react-router-dom';
import * as actions from './action';
import { getCategory } from '../../utils/api';
import HomeTag from '../../components/HomeTag';
import HomeCategory from '../../components/HomeCategory';
import HomeBounty from '../../components/HomeBounty';
import sortImg from '../../assets/iconfont/sort.svg';
import homeImg from '../../assets/iconfont/home-back.svg';
import leftArrow from '../../assets/iconfont/left-arrow.svg';
import rightArrow from '../../assets/iconfont/right-arrow.svg';
import { compose, commonPropTypes, i18nTxt } from '../../utils';
import DailySign from '../../components/DailySign';

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: #fff;
  .homeBg {
    background-image: url(${homeImg});
    height: 616px;
    width: 100%;
    position: absolute;
    top: -120px;
    left: 0px;
    background-size: cover;
    background-position: center bottom;
    background-repeat: no-repeat;
  }
  .bounty-slogan {
    margin-top: 20px;
    font-weight: 800;
    font-size: 40px;
    line-height: 40px;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    z-index: 10;
  }
  .bounty-action {
    display: flex;
    align-items: center;
    margin-bottom: 60px;
  }
`;

const HoTBounty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  z-index: 10;
  margin-top: 30px;
  .hot-bounty-title {
    display: inline-block;
    font-weight: 700;
    font-size: 24px;
    line-height: 24px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #fff;
    margin-bottom: 15px;
  }
  .hot-slider {
    width: 100%;
    max-width: 1400px;
    min-height: 230px;
    padding: 0 32px;
    .hot-wall-items {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .wrap-open {
      margin: 0 auto;
    }
    button {
      z-index: 100;
      position: absolute;
      top: 45%;
      display: block;
      width: 32px;
      height: 40px;
      padding: 0;
      -webkit-transform: translate(0, -50%);
      -ms-transform: translate(0, -50%);
      transform: translate(0, -50%);
      cursor: pointer;
      border: none;
      outline: none;
      background: transparent;
      img {
        opacity: 0.6;
      }
      &:hover {
        img {
          opacity: 1;
        }
      }
    }
    .right-arrow {
      right: -32px;
    }
    .left-arrow {
      left: -32px;
    }
    .slick-dots {
      bottom: -45px !important;
    }
    .slick-dots li button:before {
      color: #000 !important;
      opacity: 0.6 !important;
    }
    .slick-dots li.slick-active button:before {
      color: #fff !important;
      opacity: 1 !important;
    }
    /* .slick-active,
    .slick-current {
      display: flex !important;
      justify-content: center !important;
    } */
  }
`;
const BountyWall = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 10;
  align-items: center;
  margin-top: 28px;
  width: 100%;
  max-width: 1240px;
  .bounty-wall-title {
    display: inline-block;
    font-weight: 700;
    font-size: 24px;
    line-height: 24px;
    letter-spacing: 0.1em;
    color: #fff;
    margin-bottom: 16px;
  }
`;
const Category = styled.div`
  width: calc(100% - 40px);
  display: flex;
  flex-direction: column;
  background-color: #f7f9fa;
  border-radius: 12px;
  margin: 40px 20px;
  padding: 20px;
  .category {
    display: flex;
    height: 32px;
    align-items: center;
    margin-bottom: 12px;
    &:last-of-type {
      margin-bottom: 0;
    }
    .title {
      display: inline-block;
      width: 100px;
      line-height: 14px;
      color: #8e9394;
    }
  }
`;

const BountyList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1240px;

  .bounty-list-header {
    display: flex;
    width: 100%;
    padding: 0 20px;
    justify-content: space-between;
    color: #8e9394;
    margin-bottom: 20px;
    .bounty-sort {
      display: flex;
      align-items: center;
      .bounty-sort-item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        padding: 0;
        cursor: pointer;
        span {
          display: inline-block;
          margin-right: 8px;
          color: #8e9394;
          font-size: 14px;
        }
      }
    }
  }
  .bounty-list-content {
    width: 100%;
    max-width: 1240px;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
  }
`;

const Blank = styled.div`
  visibility: hidden;
  width: 373px;
  height: 200px;
  margin: 0 20px;
`;

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <button className="right-arrow" type="button" onClick={onClick}>
      <img src={rightArrow} alt="right" />
    </button>
  );
}

SampleNextArrow.propTypes = {
  onClick: PropTypes.func,
};
SampleNextArrow.defaultProps = {
  onClick: () => {},
};
function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <button className="left-arrow" type="button" onClick={onClick}>
      <img src={leftArrow} alt="left" />
    </button>
  );
}
SamplePrevArrow.propTypes = {
  onClick: PropTypes.func,
};
SamplePrevArrow.defaultProps = {
  onClick: () => {},
};

function getType(status) {
  let result = 'open';
  switch (status) {
    case 'OPEN':
      result = 'open';
      break;
    case 'ONGOING':
    case 'HAND_IN':
    case 'AUDITING':
      result = 'ongoing';
      break;
    case 'FINISHED':
      result = 'finished';
      break;
    default:
      result = 'open';
  }
  return result;
}

function getStatus(status) {
  let result = 'Open';
  switch (status) {
    case 'OPEN':
      result = 'Open';
      break;
    case 'ONGOING':
      result = 'Ongoing';
      break;
    case 'HAND_IN':
      result = 'Auditing';
      break;
    case 'AUDITING':
      result = 'Final Auditing';
      break;
    case 'FINISHED':
      result = 'Finished';
      break;
    default:
      result = 'Open';
  }
  return result;
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortType: 'time',
      sortOrder: true,
    };
    this.onChangeTag = this.onChangeTag.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onChangeSubCategory = this.onChangeSubCategory.bind(this);
    this.onCreateBounty = this.onCreateBounty.bind(this);
    this.onOpenBounty = this.onOpenBounty.bind(this);
  }

  componentDidMount() {
    document.title = 'Conflux Bounty';
    this.reinitData();
  }

  onChangeTag(value) {
    const { getBountyList } = this.props;
    getBountyList({
      tag: value,
      skip: 0,
    });
  }

  onChangeCategory(value) {
    const { getBountyList } = this.props;
    getBountyList({
      category: value,
      subCategory: null,
    });
  }

  onChangeSubCategory(value) {
    const { getBountyList } = this.props;
    getBountyList({
      subCategory: value,
    });
  }

  onChangeSort(value) {
    let { sortType, sortOrder } = this.state;
    const { getBountyList } = this.props;
    if (sortType === value) {
      sortOrder = !sortOrder;
    } else {
      sortType = value;
      sortOrder = true;
    }
    this.setState({
      sortType,
      sortOrder,
    });
    getBountyList({
      sort: sortType + (sortOrder ? '_asc' : '_desc'),
    });
  }

  onCreateBounty() {
    const { history } = this.props;
    history.push('/create-bounty');
  }

  onOpenBounty(id) {
    const { history } = this.props;
    history.push(`/view-bounty?bountyId=${id}`);
  }

  getBlankNum() {
    const { homeState } = this.props;
    const { bountyList, tag } = homeState;
    const length = tag === 'open' ? bountyList.length + 1 : bountyList.length;
    let count = 3;
    if (window.innerWidth >= 1239) {
      count = 3;
    } else if (window.innerWidth >= 826) {
      count = 2;
    } else {
      count = 1;
    }
    const lastNum = length % count;
    return lastNum === 0 ? 0 : count - lastNum;
  }

  reinitData() {
    const { getCategory: getCategoryData, getBountyList, getPopBountyList } = this.props;
    getCategoryData();
    getBountyList({});
    getPopBountyList();
  }

  /* eslint camelcase: 0 */
  UNSAFE_componentWillReceiveProps({ lang: newLang }) {
    const { lang: oldLang } = this.props;
    if (newLang !== oldLang) {
      this.reinitData();
    }
  }

  renderBlank() {
    const count = this.getBlankNum();
    const arr = [];
    for (let i = 0; i < count; i += 1) {
      arr.push(i);
    }
    const BlankConrtent = (
      <Fragment>
        {arr.map(item => (
          <Blank key={item} />
        ))}
      </Fragment>
    );
    return BlankConrtent;
  }

  render() {
    const { homeState, getMoreBounty, categoryL1List, categoryMap } = this.props;
    const { tag, category, subCategory, total, bountyList, popBountyList } = homeState;
    let count = 3;
    if (window.innerWidth > 1290) {
      count = 3;
    } else if (window.innerWidth > 860) {
      count = 2;
    } else {
      count = 1;
    }
    const settings = {
      dots: true,
      infinite: true,
      slidesToShow: count,
      slidesToScroll: count,
      autoplay: true,
      speed: 1000,
      autoplaySpeed: 3000,
      pauseOnHover: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
    };
    return (
      <Container>
        <div className="homeBg" />
        <span className="bounty-slogan">{i18nTxt('Discovering the Value of Each Token')}</span>
        <HoTBounty>
          <span className="hot-bounty-title">{i18nTxt('HOTTEST BOUNTIES')}</span>
          <div className="hot-slider">
            {popBountyList.length < count ? (
              <div className="hot-wall-items">
                {popBountyList.map(item => (
                  <HomeBounty
                    id={item.id}
                    key={item.id}
                    type={getType(item.status)}
                    status={getStatus(item.status)}
                    count={item.submissionAccountNumber}
                    title={item.title}
                    user={item.user.nickname}
                    fansCoin={item.fansCoin}
                    onClick={this.onOpenBounty}
                  />
                ))}
                {/* <HomeBounty type="open" title="Animoji" user="Rach" fansCoin={20100} onClick={this.onOpenBounty} />
                <HomeBounty type="open" title="Animoji" user="Rach" fansCoin={20100} onClick={this.onOpenBounty} /> */}
              </div>
            ) : (
              <Slider {...settings}>
                {popBountyList.map(item => (
                  <HomeBounty
                    id={item.id}
                    key={item.id}
                    type={getType(item.status)}
                    status={getStatus(item.status)}
                    count={item.submissionAccountNumber}
                    title={item.title}
                    user={item.user.nickname}
                    fansCoin={item.fansCoin}
                    onClick={this.onOpenBounty}
                  />
                ))}
                {/* <HomeBounty type="open" title="Animoji" user="Rach" fansCoin={20100} onClick={this.onOpenBounty} />
                <HomeBounty type="open" title="Animoji" user="Rach" fansCoin={20100} onClick={this.onOpenBounty} />
                <HomeBounty type="open" title="Animoji" user="Rach" fansCoin={20100} onClick={this.onOpenBounty} />
                <HomeBounty type="open" title="Animoji" user="Rach" fansCoin={20100} onClick={this.onOpenBounty} /> */}
              </Slider>
            )}
          </div>
        </HoTBounty>
        <BountyWall>
          <span className="bounty-wall-title">{i18nTxt('BOUNTY WALL')}</span>
          <HomeTag
            items={[
              { value: 'open', text: i18nTxt('OPEN') },
              { value: 'ongoing', text: i18nTxt('ONGOING') },
              { value: 'finished', text: i18nTxt('FINISHED') },
            ]}
            selected={tag}
            onChangeValue={this.onChangeTag}
          />
          <Category>
            <div className="category">
              <span className="title">{i18nTxt('Category')}:</span>
              <HomeCategory text={i18nTxt('All')} value={null} selected={category === null} onClick={this.onChangeCategory} />
              {categoryL1List.map(item => (
                <HomeCategory
                  key={item.id}
                  text={item.name}
                  value={item.id}
                  selected={category === item.id}
                  onClick={this.onChangeCategory}
                />
              ))}
            </div>
            {category !== null && (
              <div className="category">
                <span className="title">{i18nTxt('SubCategory')}:</span>
                <HomeCategory text="All" value={null} selected={subCategory === null} onClick={this.onChangeSubCategory} />
                {(categoryMap[category] || []).map(item => (
                  <HomeCategory
                    key={item.id}
                    text={item.name}
                    value={item.id}
                    selected={subCategory === item.id}
                    onClick={this.onChangeSubCategory}
                  />
                ))}
              </div>
            )}
          </Category>
          <BountyList>
            <div className="bounty-list-header">
              <div className="bounty-sort">
                <button type="button" className="bounty-sort-item" onClick={() => this.onChangeSort('fansCoin')}>
                  <span>{i18nTxt('Sort by Bounty Rewards')}</span>
                  <img src={sortImg} className="sorticon" alt="sorticon" />
                </button>
                <button type="button" className="bounty-sort-item" onClick={() => this.onChangeSort('time')}>
                  <span>{i18nTxt('Sort by Date')}</span>
                  <img src={sortImg} className="sorticon" alt="sorticon" />
                </button>
                <button type="button" className="bounty-sort-item" onClick={() => this.onChangeSort('account')}>
                  <span>{i18nTxt('Sort by Participants')}</span>
                  <img src={sortImg} className="sorticon" alt="sorticon" />
                </button>
              </div>
              <span>{i18nTxt('Found <%=total%> Results', { total })}</span>
            </div>
            <div className="bounty-list-content">
              {tag === 'open' && <HomeBounty type="create" title="" user="" fansCoin={0} onClick={this.onCreateBounty} />}
              {bountyList.map(item => (
                <HomeBounty
                  id={item.id}
                  key={item.id}
                  type={getType(item.status)}
                  status={getStatus(item.status)}
                  count={item.submissionAccountNumber}
                  title={item.title}
                  user={item.user.nickname}
                  fansCoin={item.fansCoin}
                  onClick={this.onOpenBounty}
                />
              ))}
              {this.renderBlank()}
            </div>
          </BountyList>
        </BountyWall>
        <div className="bounty-action">
          {bountyList.length < total && (
            <button className="btn default" type="button" onClick={() => getMoreBounty()}>
              {i18nTxt('SHOW MORE')}
            </button>
          )}
        </div>
        <DailySign />
      </Container>
    );
  }
}

const categoryType = {
  id: PropTypes.string,
  name: PropTypes.string,
};

Home.propTypes = {
  getCategory: PropTypes.func.isRequired,
  getBountyList: PropTypes.func.isRequired,
  getPopBountyList: PropTypes.func.isRequired,
  getMoreBounty: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  homeState: PropTypes.objectOf({
    tag: PropTypes.string,
  }).isRequired,
  categoryL1List: PropTypes.arrayOf(categoryType).isRequired,
  categoryMap: PropTypes.objectOf({
    id: PropTypes.arrayOf(categoryType),
  }).isRequired,
  history: commonPropTypes.history.isRequired,
  lang: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    categoryL1List: state.common.categoryL1List,
    categoryMap: state.common.categoryMap,
    homeState: state.home,
    lang: state.common.lang,
  };
}

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    {
      ...actions,
      getCategory,
    }
  )
);

export default enhance(Home);
