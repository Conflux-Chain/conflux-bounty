/* eslint-disable no-script-url */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-no-target-blank */
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
import mhomeImg from '../../assets/iconfont/m-home-back.svg';
import leftArrow from '../../assets/iconfont/left-arrow.svg';
import rightArrow from '../../assets/iconfont/right-arrow.svg';
import mArrowDown from '../../assets/iconfont/m-arrow-down.svg';
import { compose, commonPropTypes, i18nTxt } from '../../utils';
import DailyCheckin from '../../components/DailyCheckin';
import media from '../../globalStyles/media';
import Picker from '../../components/Picker/picker';
import unitParser from '../../utils/device';

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: #fff;
  .homeBg {
    background-image: url("${homeImg}");
    ${media.tablet`
    background-image: url("${mhomeImg}");
    height: 471px;
    `}
    ${media.mobile`
    height: ${unitParser(500)};
    `}
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
    ${media.tablet`display: none;`}
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
    ${media.tablet`align-self: flex-start; margin-left: 10px;`}
  }
  .hot-slider {
    width: 100%;
    max-width: 1400px;
    min-height: 230px;
    padding: 0 32px;
    ${media.tablet`
    padding: 0;
    `}

    ${media.mobile`
    min-height: ${unitParser(230)};
    `}

    .slick-track {
      min-width: 800px;
    }
    .hot-wall-items {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    ${media.tablet`
     div[class*="wrap-"] {
       width: 320px;
       margin-left: 12px;
       /* margin-right: 12px; */
     }
     .status-image .status-line {
       width: 64px;
     }
     .status-text {
       width: 300px;
     }
  `}

    ${media.mobile`
     div[class*="wrap-"] {
       width: ${unitParser(320)};
       margin-left: ${unitParser(12)};
       /* margin-right: 12px; */
     }
     .status-image .status-line {
       width: ${unitParser(64)};
     }
     .status-text {
       width: ${unitParser(300)}; 
     }
  `}

    .wrap-open,
    .wrap-finished,
    .wrap-ongoing {
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
const Broadcast = styled.div`
  ${media.mobile`display: none;`}
  width: 100%;
  max-width: 1200px;
  height: 44px;
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  z-index: 10;
  .broadcast {
    width: 100%;
    max-width: 1400px;
    min-height: 230px;
    padding: 0;
    .slick-slide {
      visibility: hidden;
    }
    .slick-slide.slick-current {
      visibility: visible;
    }
    .broadcast-item {
      z-index: 100;
      display: flex !important;
      flex: 1;
      height: 44px;
      align-items: center;
      color: #fff;
      ${media.mobile`
        text-align: center;
      `}
      a {
        display: flex;
        flex: 1;
        height: 16px;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        line-height: 16px;
        color: #fff;
        border-right: 1px solid rgba(255, 255, 255, 0.4);
        text-decoration: none;
        &:last-child {
          border-right: none;
        }
      }
    }
  }
`;

const BroadcastMobile = styled.div`
  display: none;
  ${media.mobile`display: block;`}

  background: rgba(0, 0, 0, 0.2);
  padding-top: 16px;
  padding-bottom: 16px;
  position: relative;
  overflow: auto;
  width: 100%;
  .broadcast-item-wrap {
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }

  .broadcast-item {
    font-size: 12px;
    line-height: 16px;
    color: #ffffff;
    display: inline-block;
    padding-left: 12px;
    padding-right: 12px;
    border-right: 1px solid rgba(255, 255, 255, 0.4);
    min-width: 150px;
    &:last-of-type {
      border-right: none;
    }
    ${media.mobile`
      text-align: center;
      border-right: 1px solid rgba(255, 255, 255, 0.4);
      &:last-of-type {
        border-right: 1px solid rgba(255, 255, 255, 0.4);
      }
   `}
  }
`;

const BountyWall = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 10;
  align-items: center;
  margin-top: 28px;
  ${media.mobile`margin-top: 0;`}
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
      display: block;
      width: 100px;
      line-height: 14px;
      color: #3b3d3d;
      margin-bottom: 12px;
    }
  }

  ${media.tablet`
width: 100%;
padding-left: 12px;
padding-top: 0;
display: block;
flex-direction: initial;
background-color: none;
border-radius: none;
margin: initial;
padding: none;

.category {
  display: block;
  height: initial;
  align-items: initial;
  margin-bottom: initial;
  &:last-of-type {
    margin-bottom: initial;
  }

  padding-bottom: 20px;
  border-bottom: 1px solid #EBEDED;
  white-space: nowrap;
    overflow: auto;
  > div {
    display: inline-block;
    border-radius: 4px;
  }
}
.title {
  width: initial;
  line-height: initial;

  display: block;
  font-size: 14px;
  color: #3B3D3D;
  margin-top: 20px;
  margin-bottom: 12px;
  font-weight: 500;
}
`}
`;

const BountyList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1240px;

  .bounty-list-header {
    ${media.tablet`display: none;`}
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

  .m-bounty-list {
    display: none;
    ${media.tablet`display: flex;`}
    padding-left: 12px;
    padding-right: 12px;
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #D8DDDF;
    justify-content: space-between;
    width: 100%;
    color: #8E9394;
    margin-bottom: 20px;

    > button {
      color: #8E9394;
    }

    .arrow-down {
      background-image: url("${mArrowDown}");
      width: 6px;
      display: inline-block;
      background-position: center;
      width: 20px;
      height: 12px;
      background-repeat: no-repeat;
      vertical-align: middle;
      margin-left: 8px;
    }
  }


  .bounty-list-content {
    width: 100%;
    max-width: 1240px;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    ${media.tablet`
    padding-left: 12px;
    padding-right: 12px;
    .wrap-create {
      display: none;
    }
    div[class*="wrap-"] {
      width: 100%;
    }
    `}
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

function getSortType(type) {
  let result;
  switch (type) {
    case 'fansCoin':
      result = i18nTxt('home.Bounty Rewards');
      break;
    case 'time':
      result = i18nTxt('home.Date');
      break;
    case 'account':
      result = i18nTxt('home.Participants');
      break;
    default:
      result = i18nTxt('home.Bounty Rewards');
  }
  return result;
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortType: 'time',
      sortOrder: false,
      sortPickerShow: false,
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
    const { getCategory: getCategoryData, getBountyList, getPopBountyList, getBroadcastList } = this.props;
    getCategoryData();
    getBountyList({});
    getBroadcastList();
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
    const { tag, category, subCategory, total, bountyList, popBountyList, broadcastList } = homeState;
    const { sortType, sortPickerShow, curSortType } = this.state;

    let infinite = false;
    if (popBountyList.length > 3) {
      infinite = true;
    }
    infinite = false;

    const settings = {
      dots: true,
      infinite,
      slidesToShow: 3,
      slidesToScroll: 3,
      autoplay: false,
      speed: 1000,
      autoplaySpeed: 3000,
      pauseOnHover: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      responsive: [
        {
          breakpoint: 1170,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 820,
          settings: {
            dots: false,
            variableWidth: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1,
            infinite: false,
            nextArrow: <Fragment></Fragment>,
            prevArrow: <Fragment></Fragment>,
          },
        },
      ],
    };
    const broadSettings = {
      dots: false,
      infinite: true,
      // fade: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      speed: 2000,
      autoplaySpeed: 5000,
      pauseOnHover: true,
      arrows: false,
    };
    // // test data
    // const broadcastList = [
    //   { title: 'Breaking News! Conflux Chain Mainnet online', url: 'https://www.baidu.com' },
    //   { title: 'Conflux Shenzhen Meetup 15 Sep 2019' },
    //   { title: 'Ginger Beer Sale Starts this Saturday!' },
    //   { title: 'Ginger Beer Sale Starts this Saturday!', url: 'http://www.google.com' },
    //   { title: 'Breaking News! Conflux Chain Mainnet online' },
    //   { title: 'Conflux Shenzhen Meetup 15 Sep 2019' },
    // ];

    return (
      <Container>
        <div className="homeBg" />
        <span className="bounty-slogan">{i18nTxt('Discovering the Value of Each Token')}</span>
        <HoTBounty>
          <span className="hot-bounty-title">{i18nTxt('HOTTEST BOUNTIES')}</span>
          <div className="hot-slider">
            <Slider {...settings}>
              {popBountyList.map(item => {
                return (
                  <div>
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
                  </div>
                );
              })}
            </Slider>
          </div>
        </HoTBounty>
        {broadcastList.length > 0 && (
          <Broadcast>
            <div className="broadcast">
              <Slider {...broadSettings}>
                <div className="broadcast-item">
                  {broadcastList.slice(0, 3).map((item, index) => {
                    return (
                      <a
                        key={index}
                        href={item.url ? item.url : 'Javascript: void(0)'}
                        style={{ cursor: item.url ? 'pointer' : 'auto' }}
                        target={item.url ? '_blank' : '_self'}
                      >
                        {item.title}
                      </a>
                    );
                  })}
                </div>
                {broadcastList.length > 3 && (
                  <div className="broadcast-item">
                    {broadcastList.slice(3, 6).map((item, index) => {
                      return (
                        <a
                          key={index}
                          href={item.url ? item.url : 'Javascript: void(0)'}
                          style={{ cursor: item.url ? 'pointer' : 'auto' }}
                          target={item.url ? '_blank' : '_self'}
                        >
                          {item.title}
                        </a>
                      );
                    })}
                  </div>
                )}
                {broadcastList.length > 6 && (
                  <div className="broadcast-item">
                    {broadcastList.slice(6, 9).map((item, index) => {
                      return (
                        <a
                          key={index}
                          href={item.url ? item.url : 'Javascript: void(0)'}
                          style={{ cursor: item.url ? 'pointer' : 'auto' }}
                          target={item.url ? '_blank' : '_self'}
                        >
                          {item.title}
                        </a>
                      );
                    })}
                  </div>
                )}
              </Slider>
            </div>
          </Broadcast>
        )}

        <BroadcastMobile>
          {/* <div className="broadcast-item-wrap">
            {broadcastList.map(item => {
              return (
                <a href={item.url ? item.url : 'Javascript: void(0)'} target={item.url ? '_blank' : '_self'} className="broadcast-item">
                  {item.title}
                </a>
              );
            })}
          </div> */}
          <Slider
            {...{
              infinite: false,
              slidesToShow: 1,
              slidesToScroll: 1,
              autoplay: true,
              speed: 1000,
              autoplaySpeed: 5000,
              variableWidth: true,
              arrows: false,
            }}
          >
            {broadcastList.map(item => {
              return (
                <a href={item.url ? item.url : 'Javascript: void(0)'} target={item.url ? '_blank' : '_self'} className="broadcast-item">
                  {item.title}
                </a>
              );
            })}
          </Slider>
        </BroadcastMobile>

        <BountyWall>
          {broadcastList.length === 0 && <span className="bounty-wall-title">{i18nTxt('BOUNTY WALL')}</span>}
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

            <div className="m-bounty-list">
              <span>{i18nTxt('Sort By')}</span>

              <button
                type="button"
                onClick={() => {
                  this.setState({
                    sortPickerShow: true,
                    curSortType: sortType,
                  });
                }}
              >
                <span>{getSortType(sortType)}</span>
                <span className="arrow-down"></span>
              </button>
            </div>

            <Picker
              optionGroups={{
                sortType: [
                  {
                    value: 'fansCoin',
                    label: getSortType('fansCoin'),
                  },
                  {
                    value: 'time',
                    label: getSortType('time'),
                  },
                  {
                    value: 'account',
                    label: getSortType('account'),
                  },
                ],
              }}
              valueGroups={{
                sortType: {
                  value: curSortType,
                },
              }}
              onChange={(name, val) => {
                this.setState({
                  sortOrder: false,
                  curSortType: val.value,
                });
              }}
              height={160}
              onCancel={() => {
                this.setState({
                  sortPickerShow: false,
                });
              }}
              onConfirm={() => {
                this.onChangeSort(curSortType);
                this.setState({
                  sortPickerShow: false,
                });
              }}
              show={sortPickerShow}
            ></Picker>

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
        <DailyCheckin />
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
  getBroadcastList: PropTypes.func.isRequired,
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
