import styled from 'styled-components';
import imgRejectBack from '../../assets/iconfont/reject-back.svg';
import { StyledWrapper } from '../../globalStyles/common';

export const HeadDiv = styled.div`
  font-size: 20px;
  line-height: 20px;
  width: 590px;
  margin: 0 auto;
  background: linear-gradient(102.15deg, #ebeded 0%, #dee0e0 100%);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 20px 40px;

  > a {
    color: #595f61;
    text-decoration: none;
    &:hover {
      text-decoration: none;
    }
  }
`;

export const H2 = styled.div`
  font-size: 16px;
  margin-top: 40px;
  line-height: 16px;
  color: #171d1f;
  font-weight: bold;
`;

export const AttachmentDiv = styled.div`
  .attachment-line {
    color: #595f61;
  }
  .attachment-line a {
    cursor: pointer;
    line-height: 16px;
    text-decoration: underline;
    color: #595f61;
    word-break: break-all;
  }
  .attachment-line .material-icons {
    cursor: pointer;
    font-size: 16px;
    vertical-align: middle;
    margin-left: 5px;
    color: #bfc5c7;
  }
  .attachment {
    float: left;
    margin-left: 5px;
  }
  .add-attachment {
    color: #22b2d6;
    display: inline-block;
    margin-top: 6px;
    margin-right: 10px;
    height: 20px;

    font-size: 14px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid transparent;
    :hover {
      text-decoration: none;
      border-bottom: 1px solid;
    }
    > span {
      line-height: 20px;
      vertical-align: middle;
    }
    > i {
      font-style: normal;
      font-size: 20px;
      vertical-align: middle;
      margin-left: -4px;
    }
    input[type='file'] {
      display: none;
    }
  }
`;

export const ExampleDiv = styled.div`
  color: #595f61;
  cursor: pointer;
  > i {
    vertical-align: middle;
    margin-right: 5px;
  }
`;

export const SubmitDiv = styled.div`
  margin-top: 20px;
  overflow: auto;
  .btn {
    line-height: 40px;
    float: right;
    min-width: 80px;
  }
  > label {
    margin-top: 9px;
  }
`;

export const ImgDiv = styled.div`
  vertical-align: middle;
  margin-right: 20px;
  border-radius: 50%;
  background: #999;
  position: relative;
  overflow: hidden;
  display: inline-block;

  > img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
`;

export const LikeAndShare = styled.div`
  > button {
    display: inline-block;
    margin-right: 20px;
    cursor: pointer;
    i,
    span {
      vertical-align: middle;
      color: #8e9394;
    }
    i.like {
      color: #22b2d6;
    }
    > span {
      margin-left: 4px;
    }
    .material-icons {
      font-size: 20px;
    }
  }
`;

export const MyBounSolunDiv = styled(StyledWrapper)`
  padding: 40px;
  color: #171d1f;
  h1 {
    font-size: 32px;
    line-height: 32px;
    margin: 0;
    margin-bottom: 40px;
    font-weight: 500;
  }

  .item-link {
    cursor: pointer;
    position: absolute;
    top: 32px;
    right: 0;
    i,
    a > span {
      vertical-align: middle;
    }
  }
  .item-link.disabled {
    cursor: default;
    pointer-events: none;
  }
  .item-head {
    display: flex;
    justify-content: space-between;
  }
  .item-content {
    padding-right: 100px;
  }
  .my-bounty-item {
    border-top: 1px solid #ebeded;
    padding-top: 18px;
    padding-bottom: 18px;
    position: relative;

    h5 {
      margin: 0;
      margin-right: 90px;
      font-size: 16px;
      line-height: 16px;
      margin-bottom: 4px;
      color: #171d1f;
      font-weight: 500;
    }
    .item-status {
      color: #595f61;
      font-size: 14px;
    }
    .item-gray {
      color: #8e9394;
      font-size: 14px;
      margin-right: 12px;
    }
    .reject-tips {
      margin-top: 8px;
      width: 520px;
      height: 50px;
      background-image: url(${imgRejectBack});
      display: flex;
      align-items: center;
      padding: 20px 16px;
      padding-top: 26px;
      color: #e76a25;

      > i {
        font-size: 20px;
        color: #e76a25;
        margin-right: 8px;
      }
      > a {
        font-size: 14px;
        cursor: pointer;
        color: #595f61;
        > i,
        > span {
          vertical-align: middle;
        }
      }
    }
    .reject-content {
      flex: 1;
    }
  }
  .my-bounty-item:last-of-type {
    border-bottom: 1px solid #ebeded;
  }
  .show-more {
    text-align: center;
    margin-top: 40px;
  }
`;
